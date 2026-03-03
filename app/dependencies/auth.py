from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user


def get_current_user_optional(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Optional authentication - returns user if authenticated, None otherwise.
    Does not raise an error if user is not authenticated.
    """
    from jose import JWTError, jwt
    from app.core.config import settings
    
    # Try to get authorization header
    try:
        if not authorization:
            return None
            
        # Extract token from "Bearer <token>" format
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None
        
        token = parts[1]
        
        # Decode JWT token
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
            
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        return user
        
    except (JWTError, Exception):
        return None


def verify_user_access(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency to enforce mandatory email verification.
    
    Use this dependency on protected routes that require verification:
    - Create room/listing
    - Add to wishlist
    - Room actions
    - Any feature routes
    
    Do NOT use on:
    - Login
    - Register
    - Dashboard
    - Send OTP
    - Verify OTP
    
    Raises:
        HTTPException: 403 Forbidden if user is not verified
    
    Returns:
        User: The verified user object
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification required"
        )
    return current_user


def verify_profile_complete(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency to verify user has completed their profile.
    Optional - use only if profile completion is required for specific routes.
    
    Raises:
        HTTPException: 400 Bad Request if profile is incomplete
    
    Returns:
        User: The user object with complete profile
    """
    if not current_user.is_profile_complete():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete your profile before proceeding. Required fields: occupation, age."
        )
    return current_user
