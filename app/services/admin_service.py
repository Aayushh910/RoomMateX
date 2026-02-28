"""
Admin Service - Handles admin authentication without database.
Admin credentials are verified from environment variables only.
"""
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from datetime import timedelta


class AdminService:
    """Service for admin authentication and operations."""
    
    @staticmethod
    def verify_admin_credentials(email: str, password: str) -> bool:
        """
        Verify admin credentials against environment variables.
        Does NOT use database.
        
        Args:
            email: Admin email to verify
            password: Admin password to verify
            
        Returns:
            bool: True if credentials match, False otherwise
        """
        return (
            email == settings.ADMIN_EMAIL and 
            password == settings.ADMIN_PASSWORD
        )
    
    @staticmethod
    def create_admin_tokens(email: str) -> dict:
        """
        Create JWT tokens for admin session.
        
        Args:
            email: Admin email
            
        Returns:
            dict: Access and refresh tokens
        """
        # Create token data with admin flag
        token_data = {
            "sub": email,
            "role": "admin",
            "is_admin": True
        }
        
        access_token = create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        refresh_token = create_refresh_token(data=token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
