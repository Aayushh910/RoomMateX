from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, func
from typing import List, Dict, Any
from app.models.user import User
from app.models.property import Property, Wishlist


class DashboardService:
    """Service for dashboard operations."""
    
    @staticmethod
    def get_summary(current_user: User, db: Session) -> Dict[str, int]:
        """
        Get dashboard summary counts.
        
        Returns:
        - my_listings_count: Properties owned by user
        - wishlist_count: Properties in user's wishlist
        """
        # Count user's properties
        my_listings_count = db.query(Property).filter(
            Property.owner_id == current_user.id
        ).count()
        
        # Count wishlist items
        wishlist_count = db.query(Wishlist).filter(
            Wishlist.user_id == current_user.id
        ).count()
        
        return {
            "my_listings_count": my_listings_count,
            "wishlist_count": wishlist_count
        }
    
    @staticmethod
    def get_recommended_rooms(current_user: User, db: Session, limit: int = 6) -> List[Property]:
        """
        Get random recommended rooms.
        
        Rules:
        - Active properties only
        - Verified owners only
        - Not user's own properties
        - Random selection
        """
        from app.models.user import User as UserModel
        
        # Get random properties with optimized query
        properties = db.query(Property).join(
            UserModel, Property.owner_id == UserModel.id
        ).filter(
            and_(
                Property.is_active == True,
                UserModel.is_verified == True,
                Property.owner_id != current_user.id
            )
        ).options(
            joinedload(Property.images)
        ).order_by(func.random()).limit(limit).all()
        
        return properties
    
    @staticmethod
    def get_wishlist_rooms(current_user: User, db: Session) -> List[Property]:
        """
        Get all properties in user's wishlist.
        
        Returns properties with basic info and thumbnail.
        """
        # Get wishlist items with property details
        wishlists = db.query(Wishlist).options(
            joinedload(Wishlist.property).joinedload(Property.images)
        ).filter(
            Wishlist.user_id == current_user.id
        ).order_by(Wishlist.created_at.desc()).all()
        
        # Extract properties
        properties = [wishlist.property for wishlist in wishlists if wishlist.property]
        
        return properties
    
    @staticmethod
    def get_my_listings(current_user: User, db: Session) -> List[Property]:
        """
        Get all properties owned by current user.
        
        Returns properties with basic info and thumbnail.
        """
        properties = db.query(Property).options(
            joinedload(Property.images)
        ).filter(
            Property.owner_id == current_user.id
        ).order_by(Property.created_at.desc()).all()
        
        return properties
