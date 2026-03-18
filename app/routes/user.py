from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserResponse, UserUpdate, MessageResponse, ChangePasswordRequest
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.services.user_service import UserService
from app.services.otp_service import OTPService
from app.core.security import verify_password, get_password_hash
from app.utils.file_upload import FileUploadService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get public profile of any user by ID."""
    from uuid import UUID
    
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    user = db.query(User).filter(User.id == user_uuid).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/me", response_model=UserResponse)
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile."""
    # Update fields if provided
    if user_update.occupation is not None:
        current_user.occupation = user_update.occupation
    
    if user_update.age is not None:
        current_user.age = user_update.age
    
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    
    if user_update.city is not None:
        current_user.city = user_update.city
    
    if user_update.phone_number is not None:
        current_user.phone_number = user_update.phone_number
    
    # Update preference fields
    if user_update.gender_preference is not None:
        current_user.gender_preference = user_update.gender_preference
    
    if user_update.budget_min is not None:
        current_user.budget_min = user_update.budget_min
    
    if user_update.budget_max is not None:
        current_user.budget_max = user_update.budget_max
    
    if user_update.lifestyle is not None:
        current_user.lifestyle = user_update.lifestyle
    
    if user_update.interests is not None:
        current_user.interests = user_update.interests
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.put("/change-password", response_model=MessageResponse)
def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change user's password with OTP verification.
    
    Requires:
    - Authentication (JWT)
    - OTP verification (password_change_verified flag must be True)
    - Current password must match
    - New password must be at least 6 characters
    
    Security:
    - Verification flag expires in 5 minutes
    - Flag is cleared after password change
    - Password is hashed using bcrypt
    """
    # Check verification flag
    is_valid, message = OTPService.check_verification_flag(current_user, "password_change")
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message
        )
    
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters"
        )
    
    # Check if new password is different from current
    if verify_password(password_data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    
    # Clear verification flag
    OTPService.clear_verification_flag(current_user, db, "password_change")
    
    db.commit()
    
    return MessageResponse(message="Password changed successfully")


@router.delete("/delete-account", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete current user's account and all related data.
    
    Requires:
    - Authentication (JWT)
    - OTP verification (account_delete_verified flag must be True)
    
    Deletes:
    - All properties owned by user (with images, amenities, house rules)
    - All reviews written by user
    - All wishlist entries
    - All reports submitted by user
    - User account
    
    Security:
    - Verification flag expires in 5 minutes
    - This action is irreversible
    """
    # Check verification flag
    is_valid, message = OTPService.check_verification_flag(current_user, "account_delete")
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message
        )
    
    # Delete user account and all related data
    UserService.delete_user_account(current_user, db)
    
    return MessageResponse(message="Account deleted successfully")


@router.post("/upload-profile-photo", response_model=UserResponse)
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload or update user's profile photo.
    
    Accepts: JPG, JPEG, PNG, WebP
    Max size: 5MB
    
    Returns updated user profile.
    """
    try:
        # Delete old profile photo if exists
        if current_user.profile_photo:
            FileUploadService.delete_image(current_user.profile_photo)
        
        # Save new profile photo (to Cloudinary or local storage)
        photo_url = await FileUploadService.save_image(file, folder="profiles")
        
        # Update user profile
        current_user.profile_photo = photo_url
        db.commit()
        db.refresh(current_user)
        
        return current_user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload profile photo: {str(e)}"
        )
