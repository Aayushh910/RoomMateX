"""
Admin Routes - Authentication and admin operations.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from app.services.admin_service import AdminService
from app.dependencies.admin import get_current_admin
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User
from app.models.property import Property, Review, Wishlist

router = APIRouter(prefix="/admin", tags=["Admin"])


# Request/Response Models
class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminData(BaseModel):
    email: str
    role: str
    is_admin: bool


class AdminLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    admin: AdminData


class AdminStatsResponse(BaseModel):
    total_users: int
    total_properties: int
    active_properties: int
    verified_users: int


@router.post("/login", response_model=AdminLoginResponse)
def admin_login(credentials: AdminLoginRequest):
    """
    Admin login endpoint.
    Verifies credentials from environment variables (NOT database).
    
    Returns JWT tokens with admin role if credentials are correct.
    """
    # Verify admin credentials from .env
    if not AdminService.verify_admin_credentials(
        credentials.email, 
        credentials.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Create admin tokens
    tokens = AdminService.create_admin_tokens(credentials.email)
    
    return AdminLoginResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        admin=AdminData(
            email=credentials.email,
            role="admin",
            is_admin=True
        )
    )


@router.get("/verify", response_model=dict)
def verify_admin(admin: dict = Depends(get_current_admin)):
    """
    Verify admin token is valid.
    Protected route - requires admin authentication.
    """
    return {
        "valid": True,
        "admin": admin
    }


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics.
    Protected route - requires admin authentication.
    """
    total_users = db.query(User).count()
    total_properties = db.query(Property).count()
    active_properties = db.query(Property).filter(Property.is_active == True).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()
    
    return AdminStatsResponse(
        total_users=total_users,
        total_properties=total_properties,
        active_properties=active_properties,
        verified_users=verified_users
    )


@router.get("/analytics/overview")
def get_analytics_overview(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive analytics for dashboard visualizations.
    Protected route - requires admin authentication.
    """
    try:
        # Basic stats
        total_users = db.query(User).count()
        verified_users = db.query(User).filter(User.is_verified == True).count()
        unverified_users = total_users - verified_users
        
        total_properties = db.query(Property).count()
        active_properties = db.query(Property).filter(Property.is_active == True).count()
        inactive_properties = total_properties - active_properties
        
        # User role distribution
        room_seekers = db.query(User).filter(User.role == 'room_seeker').count()
        room_owners = db.query(User).filter(User.role == 'room_owner').count()
        
        # Property type distribution
        property_types_raw = db.query(
            Property.property_type,
            func.count(Property.id).label('count')
        ).group_by(Property.property_type).all()
        
        property_types = []
        for pt in property_types_raw:
            # Handle enum or string
            type_name = pt[0].value if hasattr(pt[0], 'value') else str(pt[0])
            property_types.append({
                "name": type_name.replace('_', ' ').title(),
                "value": pt[1]
            })
        
        # City distribution (top 10)
        city_distribution_raw = db.query(
            Property.city,
            func.count(Property.id).label('count')
        ).group_by(Property.city).order_by(func.count(Property.id).desc()).limit(10).all()
        
        city_distribution = [
            {"city": city[0], "properties": city[1]}
            for city in city_distribution_raw
        ]
        
        # Reviews stats
        total_reviews = db.query(Review).count()
        avg_rating_raw = db.query(func.avg(Review.rating)).scalar()
        avg_rating = round(float(avg_rating_raw), 2) if avg_rating_raw else 0.0
        
        # Wishlist stats
        total_wishlists = db.query(Wishlist).count()
        
        # Recent activity (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        # Users registered in last 30 days (grouped by day)
        users_trend_raw = db.query(
            func.date(User.created_at).label('date'),
            func.count(User.id).label('count')
        ).filter(
            User.created_at >= thirty_days_ago
        ).group_by(
            func.date(User.created_at)
        ).order_by(
            func.date(User.created_at)
        ).all()
        
        users_trend = [
            {"date": str(item[0]), "users": item[1]}
            for item in users_trend_raw
        ]
        
        # Properties added in last 30 days (grouped by day)
        properties_trend_raw = db.query(
            func.date(Property.created_at).label('date'),
            func.count(Property.id).label('count')
        ).filter(
            Property.created_at >= thirty_days_ago
        ).group_by(
            func.date(Property.created_at)
        ).order_by(
            func.date(Property.created_at)
        ).all()
        
        properties_trend = [
            {"date": str(item[0]), "properties": item[1]}
            for item in properties_trend_raw
        ]
        
        # Rent price distribution
        rent_ranges = [
            {"range": "0-5000", "min": 0, "max": 5000},
            {"range": "5000-10000", "min": 5000, "max": 10000},
            {"range": "10000-15000", "min": 10000, "max": 15000},
            {"range": "15000-20000", "min": 15000, "max": 20000},
            {"range": "20000+", "min": 20000, "max": 999999}
        ]
        
        rent_distribution = []
        for rent_range in rent_ranges:
            count = db.query(Property).filter(
                Property.monthly_rent >= rent_range["min"],
                Property.monthly_rent < rent_range["max"]
            ).count()
            rent_distribution.append({
                "range": rent_range["range"],
                "count": count
            })
        
        return {
            "summary": {
                "total_users": total_users,
                "verified_users": verified_users,
                "unverified_users": unverified_users,
                "total_properties": total_properties,
                "active_properties": active_properties,
                "inactive_properties": inactive_properties,
                "total_reviews": total_reviews,
                "average_rating": avg_rating,
                "total_wishlists": total_wishlists
            },
            "user_roles": [
                {"name": "Room Seekers", "value": room_seekers},
                {"name": "Room Owners", "value": room_owners}
            ],
            "property_types": property_types,
            "city_distribution": city_distribution,
            "users_trend": users_trend,
            "properties_trend": properties_trend,
            "rent_distribution": rent_distribution,
            "verification_status": [
                {"name": "Verified", "value": verified_users},
                {"name": "Unverified", "value": unverified_users}
            ],
            "property_status": [
                {"name": "Active", "value": active_properties},
                {"name": "Inactive", "value": inactive_properties}
            ]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analytics error: {str(e)}"
        )


@router.get("/users", response_model=dict)
def get_all_users(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
    page: int = 1,
    page_size: int = 20
):
    """
    Get all users with pagination.
    Protected route - requires admin authentication.
    """
    skip = (page - 1) * page_size
    
    users = db.query(User).offset(skip).limit(page_size).all()
    total = db.query(User).count()
    
    return {
        "users": users,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/properties", response_model=dict)
def get_all_properties(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
    page: int = 1,
    page_size: int = 20
):
    """
    Get all properties with pagination.
    Protected route - requires admin authentication.
    """
    skip = (page - 1) * page_size
    
    properties = db.query(Property).offset(skip).limit(page_size).all()
    total = db.query(Property).count()
    
    return {
        "properties": properties,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }
