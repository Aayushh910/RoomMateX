"""
Admin Dependencies - Middleware for protecting admin routes.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.config import settings

security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify that the current user is an admin.
    Checks JWT token for admin role.
    
    Args:
        credentials: Bearer token from request header
        
    Returns:
        dict: Admin data from token
        
    Raises:
        HTTPException: If token is invalid or user is not admin
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        
        email: str = payload.get("sub")
        role: str = payload.get("role")
        is_admin: bool = payload.get("is_admin", False)
        
        if email is None or role != "admin" or not is_admin:
            raise credentials_exception
            
        return {
            "email": email,
            "role": role,
            "is_admin": is_admin
        }
        
    except JWTError:
        raise credentials_exception


def verify_admin_access(admin: dict = Depends(get_current_admin)) -> dict:
    """
    Additional verification for admin access.
    Can be used for extra security checks.
    
    Args:
        admin: Admin data from get_current_admin
        
    Returns:
        dict: Verified admin data
    """
    # Additional checks can be added here if needed
    return admin
