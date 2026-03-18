import secrets
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash, verify_password
from app.utils.email import EmailService


class OTPService:
    """Service for handling OTP generation and verification."""
    
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """Generate a secure OTP of specified length."""
        return ''.join([str(secrets.randbelow(10)) for _ in range(length)])
    
    @staticmethod
    def hash_otp(otp: str) -> str:
        """Hash OTP for secure storage."""
        return get_password_hash(otp)
    
    @staticmethod
    def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
        """Verify OTP against hashed version."""
        return verify_password(plain_otp, hashed_otp)
    
    @staticmethod
    def send_otp(user: User, db: Session, purpose: str = "verification") -> bool:
        """
        Generate and send OTP to user's email.
        
        Args:
            user: User object
            db: Database session
            purpose: Purpose of OTP - "verification", "password_change", or "account_delete"
        """
        # Generate OTP
        otp_code = OTPService.generate_otp()
        
        # Hash OTP before storing
        hashed_otp = OTPService.hash_otp(otp_code)
        
        # Set expiry (5 minutes from now)
        expiry = datetime.utcnow() + timedelta(minutes=5)
        
        # Update user record
        user.otp_code = hashed_otp
        user.otp_expiry = expiry
        
        # Clear any existing verification flags
        user.password_change_verified = False
        user.account_delete_verified = False
        user.verification_expiry = None
        
        db.commit()
        
        # Send email based on purpose
        if purpose == "password_change":
            success = EmailService.send_password_reset_email(
                to_email=user.email,
                otp_code=otp_code,
                user_name=user.full_name
            )
        elif purpose == "account_delete":
            success = EmailService.send_account_delete_email(
                to_email=user.email,
                otp_code=otp_code,
                user_name=user.full_name
            )
        else:
            # Default verification email
            success = EmailService.send_otp_email(
                to_email=user.email,
                otp_code=otp_code,
                user_name=user.full_name
            )
        
        return success
    
    @staticmethod
    def verify_user_otp(user: User, otp: str, db: Session, purpose: str = "verification") -> tuple[bool, str]:
        """
        Verify OTP and set appropriate verification flag.
        
        Args:
            user: User object
            otp: OTP to verify
            db: Database session
            purpose: Purpose of verification - "verification", "password_change", or "account_delete"
        """
        # Check if OTP exists
        if not user.otp_code:
            return False, "No OTP found. Please request a new one."
        
        # Check if OTP expired
        if not user.otp_expiry or datetime.utcnow() > user.otp_expiry:
            return False, "OTP has expired. Please request a new one."
        
        # Verify OTP
        if not OTPService.verify_otp(otp, user.otp_code):
            return False, "Invalid OTP. Please try again."
        
        # Set verification flag based on purpose
        verification_expiry = datetime.utcnow() + timedelta(minutes=5)
        
        if purpose == "verification":
            # Mark user as verified
            user.is_verified = True
            message = "Account verified successfully"
        elif purpose == "password_change":
            # Set password change verification flag
            user.password_change_verified = True
            user.verification_expiry = verification_expiry
            message = "OTP verified. You can now change your password."
        elif purpose == "account_delete":
            # Set account delete verification flag
            user.account_delete_verified = True
            user.verification_expiry = verification_expiry
            message = "OTP verified. You can now delete your account."
        else:
            return False, "Invalid verification purpose"
        
        # Clear OTP after successful verification
        user.otp_code = None
        user.otp_expiry = None
        
        db.commit()
        
        return True, message
    
    @staticmethod
    def check_verification_flag(user: User, flag_type: str) -> tuple[bool, str]:
        """
        Check if verification flag is valid and not expired.
        
        Args:
            user: User object
            flag_type: Type of flag - "password_change" or "account_delete"
        """
        if flag_type == "password_change":
            if not user.password_change_verified:
                return False, "Password change not verified. Please verify with OTP first."
            if not user.verification_expiry or datetime.utcnow() > user.verification_expiry:
                return False, "Verification expired. Please verify with OTP again."
            return True, "Verification valid"
        elif flag_type == "account_delete":
            if not user.account_delete_verified:
                return False, "Account deletion not verified. Please verify with OTP first."
            if not user.verification_expiry or datetime.utcnow() > user.verification_expiry:
                return False, "Verification expired. Please verify with OTP again."
            return True, "Verification valid"
        else:
            return False, "Invalid flag type"
    
    @staticmethod
    def clear_verification_flag(user: User, db: Session, flag_type: str):
        """Clear verification flag after operation is complete."""
        if flag_type == "password_change":
            user.password_change_verified = False
        elif flag_type == "account_delete":
            user.account_delete_verified = False
        
        user.verification_expiry = None
        db.commit()
    
    @staticmethod
    def send_password_reset_otp(email: str, db: Session) -> bool:
        """
        Generate and send password reset OTP to user's email.
        
        Security:
        - Does not reveal whether email exists
        - Always returns True (security best practice)
        - Generates 6-digit OTP for password reset
        """
        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        
        # If user doesn't exist, silently return (security best practice)
        if not user:
            return True
        
        # Generate 6-digit OTP for password reset
        otp_code = OTPService.generate_otp(length=6)
        
        # Hash OTP before storing
        hashed_otp = OTPService.hash_otp(otp_code)
        
        # Set expiry (5 minutes from now)
        expiry = datetime.utcnow() + timedelta(minutes=5)
        
        # Update user record
        user.otp_code = hashed_otp
        user.otp_expiry = expiry
        db.commit()
        
        # Send email
        success = EmailService.send_password_reset_email(
            to_email=user.email,
            otp_code=otp_code,
            user_name=user.full_name
        )
        
        return True  # Always return True (security)
