from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.schemas.property import (
    ReviewCreate, ReviewResponse, ReviewListResponse, MessageResponse
)
from app.services.review_service import ReviewService

router = APIRouter(prefix="/properties", tags=["Reviews"])


@router.get("/{property_id}/reviews", response_model=ReviewListResponse)
def get_property_reviews(
    property_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get paginated reviews for a property.
    
    Public endpoint - no authentication required.
    """
    skip = (page - 1) * limit
    
    reviews, total = ReviewService.get_property_reviews(
        property_id=property_id,
        db=db,
        skip=skip,
        limit=limit
    )
    
    total_pages = (total + limit - 1) // limit
    
    return ReviewListResponse(
        data=[ReviewResponse.from_orm(review) for review in reviews],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


@router.post("/{property_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    property_id: UUID,
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a review for a property.
    
    Requires authentication.
    User can only review a property once.
    """
    review = ReviewService.create_review(
        property_id=property_id,
        review_data=review_data,
        current_user=current_user,
        db=db
    )
    
    return ReviewResponse.from_orm(review)
