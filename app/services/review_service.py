from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from typing import List, Tuple
from uuid import UUID
from app.models.property import Review, Property
from app.models.user import User
from app.schemas.property import ReviewCreate
from app.services.base_service import BaseService


class ReviewService(BaseService):
    """Service for review operations."""
    
    @staticmethod
    def get_property_reviews(
        property_id: UUID,
        db: Session,
        skip: int = 0,
        limit: int = 5
    ) -> Tuple[List[Review], int]:
        """Get paginated reviews for a property."""
        # Check if property exists using base service
        ReviewService.get_or_404(db, Property, property_id, "Property not found")
        
        # Get total count
        total = db.query(Review).filter(Review.property_id == property_id).count()
        
        # Get reviews with user info (eager load user)
        reviews = db.query(Review).options(
            joinedload(Review.user)
        ).filter(
            Review.property_id == property_id
        ).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
        
        return reviews, total
    
    @staticmethod
    def create_review(
        property_id: UUID,
        review_data: ReviewCreate,
        current_user: User,
        db: Session
    ) -> Review:
        """Create a new review for a property."""
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
        
        # Check for duplicate review using base service
        ReviewService.check_duplicate(
            db, Review,
            {"property_id": property_id, "user_id": current_user.id},
            "You have already reviewed this property"
        )
        
        # Create review
        new_review = Review(
            property_id=property_id,
            user_id=current_user.id,
            rating=review_data.rating,
            comment=review_data.comment
        )
        
        db.add(new_review)
        db.commit()
        db.refresh(new_review)
        
        return new_review
