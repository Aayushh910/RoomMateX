from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_access_token
from datetime import timedelta
from app.core.config import settings


class AuthService:
    
    @staticmethod
    def register_user(user_data: UserRegister, db: Session) -> User:
        """Register a new user."""
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create new user
        new_user = User(
            full_name=user_data.full_name,
            phone_number=user_data.phone_number,
            email=user_data.email,
            hashed_password=hashed_password,
            city=user_data.city,
            role=user_data.role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    @staticmethod
    def authenticate_user(login_data: UserLogin, db: Session) -> tuple[User, str, str]:
        """Authenticate user and return user object with access and refresh tokens."""
        # Find user by email
        user = db.query(User).filter(User.email == login_data.email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is Banned !"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value},
            expires_delta=access_token_expires
        )
        
        # Create refresh token
        refresh_token = create_refresh_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value}
        )
        
        return user, access_token, refresh_token
    
    @staticmethod
    def change_password(
        current_user: User,
        current_password: str,
        new_password: str,
        db: Session
    ) -> tuple[bool, str]:
        """
        Change user's password.
        
        Validates:
        - Current password must match
        - New password must be different
        - New password must be at least 6 characters
        
        Returns:
        - (True, success_message) on success
        - (False, error_message) on failure
        """
        # Verify current password
        if not verify_password(current_password, current_user.hashed_password):
            return False, "Current password is incorrect"
        
        # Check if new password is different
        if verify_password(new_password, current_user.hashed_password):
            return False, "New password must be different from current password"
        
        # Validate new password length (already validated by Pydantic, but double-check)
        if len(new_password) < 6:
            return False, "New password must be at least 6 characters"
        
        # Hash new password
        new_hashed_password = get_password_hash(new_password)
        
        # Update password
        current_user.hashed_password = new_hashed_password
        db.commit()
        
        return True, "Password changed successfully"
    
    @staticmethod
    def refresh_access_token(refresh_token: str, db: Session) -> tuple[User, str]:
        """Generate new access token from refresh token."""
        # Decode refresh token
        payload = decode_access_token(refresh_token)
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value},
            expires_delta=access_token_expires
        )
        
        return user, access_token
    
    @staticmethod
    def reset_password_with_otp(
        email: str,
        otp: str,
        new_password: str,
        db: Session
    ) -> tuple[bool, str]:
        """
        Reset password using OTP.
        
        Validates:
        - User exists
        - OTP matches
        - OTP not expired
        
        Returns:
        - (True, success_message) on success
        - (False, error_message) on failure
        """
        from datetime import datetime, timezone
        
        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return False, "Invalid email or OTP"
        
        # Check if OTP exists
        if not user.otp_code:
            return False, "No OTP request found. Please request a new OTP"
        
        # Check if OTP expired
        if not user.otp_expiry or datetime.now(timezone.utc) > user.otp_expiry:
            # Clear expired OTP
            user.otp_code = None
            user.otp_expiry = None
            db.commit()
            return False, "OTP has expired. Please request a new OTP"
        
        # Verify OTP
        if not verify_password(otp, user.otp_code):
            return False, "Invalid OTP"
        
        # Validate new password length
        if len(new_password) < 6:
            return False, "New password must be at least 6 characters"
        
        # Hash new password
        new_hashed_password = get_password_hash(new_password)
        
        # Update password and clear OTP
        user.hashed_password = new_hashed_password
        user.otp_code = None
        user.otp_expiry = None
        db.commit()
        
        return True, "Password reset successfully"
