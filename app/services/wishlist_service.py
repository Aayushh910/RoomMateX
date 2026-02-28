from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from app.models.property import Wishlist, Property
from app.models.user import User


class WishlistService:
    """Service for wishlist operations."""
    
    @staticmethod
    def add_to_wishlist(
        property_id: UUID,
        current_user: User,
        db: Session
    ) -> Wishlist:
        """Add property to user's wishlist."""
        # Check if property exists and is active
        property_obj = db.query(Property).filter(
            Property.id == property_id,
            Property.is_active == True
        ).first()
        
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found or inactive"
            )
        
        # Check if already in wishlist
        existing_wishlist = db.query(Wishlist).filter(
            Wishlist.user_id == current_user.id,
            Wishlist.property_id == property_id
        ).first()
        
        if existing_wishlist:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Property already in wishlist"
            )
        
        # Add to wishlist
        new_wishlist = Wishlist(
            user_id=current_user.id,
            property_id=property_id
        )
        
        db.add(new_wishlist)
        db.commit()
        db.refresh(new_wishlist)
        
        return new_wishlist
    
    @staticmethod
    def remove_from_wishlist(
        property_id: UUID,
        current_user: User,
        db: Session
    ) -> None:
        """Remove property from user's wishlist."""
        wishlist_item = db.query(Wishlist).filter(
            Wishlist.user_id == current_user.id,
            Wishlist.property_id == property_id
        ).first()
        
        if not wishlist_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not in wishlist"
            )
        
        db.delete(wishlist_item)
        db.commit()
    
    @staticmethod
    def get_user_wishlist(current_user: User, db: Session):
        """Get all properties in user's wishlist."""
        wishlists = db.query(Wishlist).filter(
            Wishlist.user_id == current_user.id
        ).order_by(Wishlist.created_at.desc()).all()
        
        return wishlists
