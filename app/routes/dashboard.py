from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.schemas.dashboard import (
    DashboardSummaryResponse,
    PropertyBasicResponse,
    MyListingResponse
)
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dashboard summary counts.
    
    Requires authentication.
    
    Returns:
    - my_listings_count: Number of properties owned by user
    - wishlist_count: Number of properties in wishlist
    - recently_viewed_count: Number of recently viewed properties
    """
    summary = DashboardService.get_summary(current_user, db)
    return DashboardSummaryResponse(**summary)


@router.get("/recommended", response_model=List[PropertyBasicResponse])
def get_recommended_rooms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get 6 random recommended rooms.
    
    Requires authentication.
    
    Rules:
    - Active properties only
    - Verified owners only
    - Not user's own properties
    - Random selection
    """
    properties = DashboardService.get_recommended_rooms(current_user, db, limit=6)
    return [PropertyBasicResponse.from_orm(prop) for prop in properties]


@router.get("/wishlist", response_model=List[PropertyBasicResponse])
def get_wishlist_rooms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all properties in user's wishlist.
    
    Requires authentication.
    
    Returns properties with basic info and thumbnail.
    """
    properties = DashboardService.get_wishlist_rooms(current_user, db)
    return [PropertyBasicResponse.from_orm(prop) for prop in properties]


@router.get("/my-listings", response_model=List[MyListingResponse])
def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all properties owned by current user.
    
    Requires authentication.
    
    Returns properties with basic info, thumbnail, and creation date.
    """
    properties = DashboardService.get_my_listings(current_user, db)
    return [MyListingResponse.from_orm(prop) for prop in properties]
