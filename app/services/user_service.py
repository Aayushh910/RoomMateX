from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.property import (
    Property, PropertyImage, PropertyAmenity, HouseRule,
    Review, Wishlist, Report
)
from app.utils.file_upload import FileUploadService


class UserService:
    """Service for user operations."""
    
    @staticmethod
    def delete_user_account(current_user: User, db: Session) -> None:
        """
        Permanently delete user account and all related data.
        
        Deletes:
        - User's properties (with images, amenities, house rules)
        - User's reviews
        - User's wishlist entries
        - User's contact requests (sent and received)
        - User's reports
        - User's recently viewed records
        - User account
        
        Uses transaction to ensure data consistency.
        Rolls back on any error.
        """
        try:
            # 1. Delete all properties owned by user
            user_properties = db.query(Property).filter(
                Property.owner_id == current_user.id
            ).all()
            
            # Collect all image URLs for deletion from disk
            all_image_urls = []
            for property_obj in user_properties:
                image_urls = [img.image_url for img in property_obj.images]
                all_image_urls.extend(image_urls)
            
            # Delete properties (cascade will handle images, amenities, house_rules, reviews, wishlists, contacts, reports)
            for property_obj in user_properties:
                db.delete(property_obj)
            
            # 2. Delete reviews written by user (on other properties)
            db.query(Review).filter(Review.user_id == current_user.id).delete()
            
            # 3. Delete wishlist entries by user
            db.query(Wishlist).filter(Wishlist.user_id == current_user.id).delete()
            
            # 4. Delete reports submitted by user
            db.query(Report).filter(Report.user_id == current_user.id).delete()
            
            # 5. Delete the user account
            db.delete(current_user)
            
            # Commit all changes
            db.commit()
            
            # Delete images from disk (after successful commit)
            if all_image_urls:
                FileUploadService.delete_multiple_images(all_image_urls)
            
        except Exception as e:
            # Rollback on any error
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete account: {str(e)}"
            )
