from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.schemas.property import MessageResponse, WishlistResponse
from app.services.wishlist_service import WishlistService

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.post("/{property_id}", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    property_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add property to wishlist.
    
    Requires authentication.
    Prevents duplicate entries.
    """
    WishlistService.add_to_wishlist(property_id, current_user, db)
    return MessageResponse(message="Property added to wishlist")


@router.delete("/{property_id}", response_model=MessageResponse)
def remove_from_wishlist(
    property_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove property from wishlist.
    
    Requires authentication.
    """
    WishlistService.remove_from_wishlist(property_id, current_user, db)
    return MessageResponse(message="Property removed from wishlist")


@router.get("/", response_model=list[WishlistResponse])
def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's wishlist.
    
    Requires authentication.
    """
    wishlists = WishlistService.get_user_wishlist(current_user, db)
    return wishlists
