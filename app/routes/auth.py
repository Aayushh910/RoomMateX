from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import (
    UserRegister, UserLogin, UserRegisterResponse, 
    TokenResponse, UserResponse, OTPRequest, MessageResponse,
    ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest,
    RefreshTokenRequest
)
from app.services.auth_service import AuthService
from app.services.otp_service import OTPService
from app.models.user import User
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserRegisterResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user.
    User is created with is_verified = False.
    """
    user = AuthService.register_user(user_data, db)
    
    return UserRegisterResponse(
        message="User registered successfully",
        user=UserResponse.from_orm(user)
    )


@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return access token and refresh token.
    Login is allowed even if user is not verified.
    Returns JWT + refresh token + user object (including is_verified field).
    """
    user, access_token, refresh_token = AuthService.authenticate_user(login_data, db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(token_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token.
    Returns new access token with same refresh token.
    """
    user, access_token = AuthService.refresh_access_token(token_data.refresh_token, db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=token_data.refresh_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


@router.post("/send-otp", response_model=MessageResponse)
def send_otp(
    purpose: str = Query("verification", pattern="^(verification|password_change|account_delete)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send OTP to user's registered email for various purposes.
    
    - JWT required
    - OTP sent to user.email (registered email only)
    - OTP expires in 5 minutes
    - Purpose: verification, password_change, or account_delete
    """
    # Check if already verified (only for verification purpose)
    if purpose == "verification" and current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is already verified"
        )
    
    # Send OTP with specified purpose
    success = OTPService.send_otp(current_user, db, purpose=purpose)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP. Please try again later."
        )
    
    messages = {
        "verification": "OTP sent to your registered email for account verification",
        "password_change": "OTP sent to your registered email for password change",
        "account_delete": "OTP sent to your registered email for account deletion"
    }
    
    return MessageResponse(message=messages.get(purpose, "OTP sent to your registered email"))


@router.post("/verify-otp", response_model=MessageResponse)
def verify_otp(
    otp_request: OTPRequest,
    purpose: str = Query("verification", pattern="^(verification|password_change|account_delete)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verify OTP for various purposes.
    
    - JWT required
    - Validates OTP and expiry
    - Sets appropriate verification flag based on purpose
    - Clears OTP after successful verification
    """
    # Check if already verified (only for verification purpose)
    if purpose == "verification" and current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is already verified"
        )
    
    # Verify OTP with specified purpose
    success, message = OTPService.verify_user_otp(current_user, otp_request.otp, db, purpose=purpose)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return MessageResponse(message=message)


@router.post("/send-phone-otp", response_model=MessageResponse)
def send_phone_otp(current_user: User = Depends(get_current_user)):
    """
    Send OTP to user's phone for verification.
    Currently under development.
    """
    return MessageResponse(message="Phone verification is under process")


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    request_data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset OTP.
    
    No authentication required.
    
    Functionality:
    - Checks if user exists
    - Generates 6-digit OTP
    - Stores OTP with 5-minute expiry
    - Sends OTP to user's email
    
    Security:
    - Does not reveal whether email exists
    - Always returns success message
    """
    # Process forgot password request
    OTPService.send_password_reset_otp(request_data.email, db)
    
    # Always return same message (security best practice)
    return MessageResponse(
        message="If the email exists, an OTP has been sent to reset your password"
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    reset_data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Reset password using OTP.
    
    No authentication required.
    
    Validates:
    - Email exists
    - OTP matches
    - OTP not expired
    - New password at least 6 characters
    
    Functionality:
    - Hashes new password
    - Updates user password
    - Clears OTP fields
    
    Security:
    - Prevents OTP reuse
    - Handles expiration properly
    """
    success, message = AuthService.reset_password_with_otp(
        reset_data.email,
        reset_data.otp,
        reset_data.new_password,
        db
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return MessageResponse(message=message)
