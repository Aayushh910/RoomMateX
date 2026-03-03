from fastapi import APIRouter, Depends, status, UploadFile, File, Form, Query, Header, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import json

from app.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.dependencies.auth import verify_user_access, get_current_user_optional
from app.schemas.property import (
    PropertyCreate, PropertyUpdate, PropertyResponse,
    PropertyListResponse, PropertyFindRoomsResponse, 
    PropertyFindRoomsListResponse, MessageResponse,
    PropertyDetailsResponse, ReviewCreate, ReviewResponse,
    ReviewListResponse, ReportCreate
)
from app.services.property_service import PropertyService
from app.services.review_service import ReviewService
from app.services.report_service import ReportService
from app.models.property import PropertyType, PreferredTenant

router = APIRouter(prefix="/properties", tags=["Properties"])


@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    # Form fields
    property_title: str = Form(...),
    property_type: PropertyType = Form(...),
    city: str = Form(...),
    area_locality: str = Form(...),
    description: Optional[str] = Form(None),
    monthly_rent: int = Form(...),
    deposit: int = Form(...),
    available_from: str = Form(...),  # Date as string
    preferred_tenant: PreferredTenant = Form(PreferredTenant.ANY),
    amenities: str = Form("[]"),  # JSON string of amenities
    house_rules: str = Form("[]"),  # JSON string of house rules
    
    # Images
    images: List[UploadFile] = File(default=[]),
    
    # Dependencies
    current_user: User = Depends(verify_user_access),
    db: Session = Depends(get_db)
):
    """
    Create a new property listing.
    
    Requirements:
    - User must be verified (is_verified = True)
    - Accepts multipart/form-data
    - Supports up to 5 images
    - Returns property with images, amenities, and house rules
    """
    # Parse amenities from JSON string
    try:
        amenities_list = json.loads(amenities) if amenities else []
        house_rules_list = json.loads(house_rules) if house_rules else []
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Invalid amenities or house_rules format"}
        )
    
    # Create property data object
    property_data = PropertyCreate(
        property_title=property_title,
        property_type=property_type,
        city=city,
        area_locality=area_locality,
        description=description,
        monthly_rent=monthly_rent,
        deposit=deposit,
        available_from=available_from,
        preferred_tenant=preferred_tenant,
        amenities=amenities_list,
        house_rules=house_rules_list
    )
    
    # Create property
    property_obj = await PropertyService.create_property(
        property_data=property_data,
        images=images,
        owner=current_user,
        db=db
    )
    
    return PropertyResponse.from_orm(property_obj)


@router.get("/", response_model=PropertyFindRoomsListResponse)
def get_properties(
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=100),
    city: Optional[str] = Query(None),
    property_type: Optional[PropertyType] = Query(None),
    min_rent: Optional[int] = Query(None, ge=0),
    max_rent: Optional[int] = Query(None, ge=0),
    amenities: Optional[str] = Query(None, description="Comma-separated amenities (must match ALL)"),
    sort_by: Optional[str] = Query("newest", pattern="^(newest|rent_asc|rent_desc)$"),
    db: Session = Depends(get_db)
):
    """
    Get all properties with advanced filters and pagination.
    
    Public endpoint - no authentication required.
    
    Filters:
    - city: Filter by city name (partial match)
    - property_type: Filter by property type
    - min_rent: Minimum monthly rent
    - max_rent: Maximum monthly rent
    - amenities: Comma-separated amenities (must match ALL selected)
    
    Sorting:
    - newest: Most recent first (default)
    - rent_asc: Lowest rent first
    - rent_desc: Highest rent first
    
    Only shows:
    - Active properties (is_active=True)
    - Properties from verified owners (owner.is_verified=True)
    """
    skip = (page - 1) * page_size
    
    # Parse amenities from comma-separated string
    amenities_list = None
    if amenities:
        amenities_list = [a.strip() for a in amenities.split(",") if a.strip()]
    
    properties, total = PropertyService.get_properties(
        db=db,
        skip=skip,
        limit=page_size,
        city=city,
        property_type=property_type.value if property_type else None,
        min_rent=min_rent,
        max_rent=max_rent,
        amenities=amenities_list,
        sort_by=sort_by
    )
    
    total_pages = (total + page_size - 1) // page_size
    
    return PropertyFindRoomsListResponse(
        data=[PropertyFindRoomsResponse.from_orm(prop) for prop in properties],
        total=total,
        page=page,
        limit=page_size,
        total_pages=total_pages
    )


@router.get("/me", response_model=List[PropertyResponse])
def get_my_properties(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all properties owned by current user.
    
    Requires authentication.
    """
    properties = PropertyService.get_user_properties(current_user.id, db)
    return [PropertyResponse.from_orm(prop) for prop in properties]


@router.get("/{property_id}", response_model=PropertyDetailsResponse)
def get_property(
    property_id: UUID,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get detailed property information.
    
    Public endpoint - authentication optional.
    
    Returns:
    - Full property details
    - Owner information
    - Images, amenities, house rules
    - Average rating and total reviews
    
    Access rules:
    - Property owners can always view their own properties (even if inactive)
    - Other users can only view active properties from verified owners
    """
    # Pass current_user to service so it can check ownership
    property_obj, avg_rating, total_reviews = PropertyService.get_property_details(
        property_id, db, current_user
    )
    
    # Additional check: if not owner, verify owner is verified
    is_owner = current_user and str(property_obj.owner_id) == str(current_user.id)
    if not is_owner:
        # Get owner to check verification
        owner = db.query(User).filter(User.id == property_obj.owner_id).first()
        if not owner or not owner.is_verified:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
    
    return PropertyDetailsResponse.from_orm(property_obj, avg_rating, total_reviews)


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: UUID,
    
    # Optional form fields
    property_title: Optional[str] = Form(None),
    property_type: Optional[PropertyType] = Form(None),
    city: Optional[str] = Form(None),
    area_locality: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    monthly_rent: Optional[int] = Form(None),
    deposit: Optional[int] = Form(None),
    available_from: Optional[str] = Form(None),
    preferred_tenant: Optional[PreferredTenant] = Form(None),
    amenities: Optional[str] = Form(None),
    house_rules: Optional[str] = Form(None),
    is_active: Optional[bool] = Form(None),
    
    # Optional new images
    images: List[UploadFile] = File(default=[]),
    
    # Dependencies
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update property.
    
    Requirements:
    - User must be the owner
    - All fields are optional
    - Can add new images
    """
    # Parse amenities and house_rules if provided
    amenities_list = None
    house_rules_list = None
    
    if amenities:
        try:
            amenities_list = json.loads(amenities)
        except json.JSONDecodeError:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Invalid amenities format"}
            )
    
    if house_rules:
        try:
            house_rules_list = json.loads(house_rules)
        except json.JSONDecodeError:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Invalid house_rules format"}
            )
    
    # Create update data object
    update_data = PropertyUpdate(
        property_title=property_title,
        property_type=property_type,
        city=city,
        area_locality=area_locality,
        description=description,
        monthly_rent=monthly_rent,
        deposit=deposit,
        available_from=available_from,
        preferred_tenant=preferred_tenant,
        amenities=amenities_list,
        house_rules=house_rules_list,
        is_active=is_active
    )
    
    # Update property
    property_obj = await PropertyService.update_property(
        property_id=property_id,
        property_data=update_data,
        images=images if images else None,
        current_user=current_user,
        db=db
    )
    
    return PropertyResponse.from_orm(property_obj)


@router.delete("/{property_id}", response_model=MessageResponse)
def delete_property(
    property_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete property from database.
    
    Requirements:
    - User must be the owner
    - Deletes property and all related data permanently
    - Removes images from Cloudinary
    """
    PropertyService.delete_property(property_id, current_user, db)
    
    return MessageResponse(message="Property deleted successfully")


@router.put("/{property_id}/toggle-active")
def toggle_property_active(
    property_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggle property active/inactive status.
    
    Requirements:
    - User must be the owner of the property
    - Toggles the is_active field
    """
    from app.models.property import Property
    from fastapi import HTTPException
    
    # Get property
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Verify ownership
    if str(property_obj.owner_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to modify this property")
    
    # Toggle active status
    property_obj.is_active = not property_obj.is_active
    db.commit()
    db.refresh(property_obj)
    
    return {
        "success": True,
        "message": f"Property {'activated' if property_obj.is_active else 'deactivated'} successfully",
        "is_active": property_obj.is_active
    }


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
    reviews, total = ReviewService.get_property_reviews(property_id, db, skip, limit)
    
    # Transform reviews to include user name
    review_responses = []
    for review in reviews:
        review_responses.append(ReviewResponse(
            id=review.id,
            user_name=review.user.full_name,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at
        ))
    
    # Calculate total pages
    total_pages = (total + limit - 1) // limit
    
    return ReviewListResponse(
        data=review_responses,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


@router.post("/{property_id}/reviews", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    property_id: UUID,
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a review for a property.
    
    Requires authentication.
    """
    ReviewService.create_review(property_id, review_data, current_user, db)
    return MessageResponse(message="Review created successfully")


@router.post("/{property_id}/report", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def report_property(
    property_id: UUID,
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Report a property listing.
    
    Requires authentication.
    """
    ReportService.create_report(property_id, report_data, current_user, db)
    return MessageResponse(message="Property reported successfully")
