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


# OPTIONS handler for CORS preflight
@router.options("/login")
async def options_admin_login():
    """Handle CORS preflight for admin login"""
    return {}


@router.options("/verify")
async def options_verify():
    """Handle CORS preflight for verify"""
    return {}


@router.options("/stats")
async def options_stats():
    """Handle CORS preflight for stats"""
    return {}


@router.options("/analytics/overview")
async def options_analytics():
    """Handle CORS preflight for analytics"""
    return {}


@router.options("/users")
async def options_users():
    """Handle CORS preflight for users"""
    return {}


@router.options("/users/{user_id}")
async def options_user_actions():
    """Handle CORS preflight for user actions (view, block, delete)"""
    return {}


@router.options("/properties")
async def options_properties():
    """Handle CORS preflight for properties"""
    return {}


@router.options("/reports")
async def options_reports():
    """Handle CORS preflight for reports"""
    return {}


@router.options("/reports/{report_id}/status")
async def options_report_status():
    """Handle CORS preflight for report status"""
    return {}


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
        from app.models.property import Report, ReportStatus
        
        # Basic stats
        total_users = db.query(User).count()
        verified_users = db.query(User).filter(User.is_verified == True).count()
        unverified_users = total_users - verified_users
        
        total_properties = db.query(Property).count()
        active_properties = db.query(Property).filter(Property.is_active == True).count()
        inactive_properties = total_properties - active_properties
        
        # Report stats
        total_reports = db.query(Report).count()
        pending_reports = db.query(Report).filter(Report.status == ReportStatus.pending).count()
        fixed_reports = db.query(Report).filter(Report.status == ReportStatus.fixed).count()
        rejected_reports = db.query(Report).filter(Report.status == ReportStatus.rejected).count()
        
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
                "total_wishlists": total_wishlists,
                "total_reports": total_reports,
                "pending_reports": pending_reports,
                "fixed_reports": fixed_reports,
                "rejected_reports": rejected_reports
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
            ],
            "report_status": [
                {"name": "Pending", "value": pending_reports},
                {"name": "Fixed", "value": fixed_reports},
                {"name": "Rejected", "value": rejected_reports}
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
    page_size: int = 20,
    search: str = None,
    role: str = None,
    is_verified: bool = None,
    city: str = None
):
    """
    Get all users with pagination and filters.
    Protected route - requires admin authentication.
    """
    skip = (page - 1) * page_size
    
    # Build query with filters
    query = db.query(User)
    
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) | 
            (User.email.ilike(f"%{search}%")) |
            (User.phone_number.ilike(f"%{search}%"))
        )
    
    if role:
        query = query.filter(User.role == role)
    
    if is_verified is not None:
        query = query.filter(User.is_verified == is_verified)
    
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))
    
    total = query.count()
    users_query = query.offset(skip).limit(page_size).all()
    
    # Convert users to dictionaries
    users = []
    for user in users_query:
        users.append({
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "city": user.city,
            "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
            "is_verified": user.is_verified,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "profile_photo": user.profile_photo
        })
    
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
    page_size: int = 20,
    search: str = None,
    city: str = None,
    property_type: str = None,
    is_active: bool = None,
    min_rent: int = None,
    max_rent: int = None
):
    """
    Get all properties with pagination and filters.
    Protected route - requires admin authentication.
    """
    skip = (page - 1) * page_size
    
    # Build query with filters
    query = db.query(Property)
    
    if search:
        query = query.filter(
            (Property.property_title.ilike(f"%{search}%")) | 
            (Property.area_locality.ilike(f"%{search}%"))
        )
    
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    
    if property_type:
        query = query.filter(Property.property_type == property_type)
    
    if is_active is not None:
        query = query.filter(Property.is_active == is_active)
    
    if min_rent is not None:
        query = query.filter(Property.monthly_rent >= min_rent)
    
    if max_rent is not None:
        query = query.filter(Property.monthly_rent <= max_rent)
    
    total = query.count()
    properties_query = query.offset(skip).limit(page_size).all()
    
    # Convert properties to dictionaries
    properties = []
    for prop in properties_query:
        properties.append({
            "id": str(prop.id),
            "property_title": prop.property_title,
            "property_type": prop.property_type.value if hasattr(prop.property_type, 'value') else str(prop.property_type),
            "city": prop.city,
            "area_locality": prop.area_locality,
            "monthly_rent": prop.monthly_rent,
            "deposit": prop.deposit,
            "is_active": prop.is_active,
            "available_from": prop.available_from.isoformat() if prop.available_from else None,
            "created_at": prop.created_at.isoformat() if prop.created_at else None,
            "owner_id": str(prop.owner_id)
        })
    
    return {
        "properties": properties,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/reports", response_model=dict)
def get_all_reports(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
    page: int = 1,
    page_size: int = 20,
    search: str = None,
    status: str = None,
    date_from: str = None,
    date_to: str = None
):
    """
    Get all property reports with pagination and filters.
    Protected route - requires admin authentication.
    
    Filters:
    - search: Search in property title, user name, or user email
    - status: Filter by report status (pending, fixed, rejected)
    - date_from: Filter reports from this date (YYYY-MM-DD)
    - date_to: Filter reports until this date (YYYY-MM-DD)
    """
    from app.models.property import Report, ReportStatus
    from datetime import datetime
    
    skip = (page - 1) * page_size
    
    # Build query with filters
    query = db.query(Report)
    
    # Apply status filter
    if status:
        try:
            query = query.filter(Report.status == ReportStatus(status))
        except ValueError:
            pass  # Invalid status, ignore filter
    
    # Apply date filters
    if date_from:
        try:
            from_date = datetime.strptime(date_from, '%Y-%m-%d')
            query = query.filter(Report.created_at >= from_date)
        except ValueError:
            pass  # Invalid date format, ignore filter
    
    if date_to:
        try:
            to_date = datetime.strptime(date_to, '%Y-%m-%d')
            # Add one day to include the entire end date
            to_date = to_date.replace(hour=23, minute=59, second=59)
            query = query.filter(Report.created_at <= to_date)
        except ValueError:
            pass  # Invalid date format, ignore filter
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    reports_query = query.order_by(Report.created_at.desc()).offset(skip).limit(page_size).all()
    
    # Convert reports to dictionaries
    reports = []
    for report in reports_query:
        # Get property and user details
        property_data = db.query(Property).filter(Property.id == report.property_id).first()
        user_data = db.query(User).filter(User.id == report.user_id).first()
        
        # Apply search filter (after fetching related data)
        if search:
            search_lower = search.lower()
            property_title = property_data.property_title.lower() if property_data else ""
            user_name = user_data.full_name.lower() if user_data else ""
            user_email = user_data.email.lower() if user_data else ""
            
            if not (search_lower in property_title or search_lower in user_name or search_lower in user_email):
                continue
        
        reports.append({
            "id": str(report.id),
            "property_id": str(report.property_id),
            "property_title": property_data.property_title if property_data else "Unknown",
            "user_id": str(report.user_id),
            "user_name": user_data.full_name if user_data else "Unknown",
            "user_email": user_data.email if user_data else "Unknown",
            "reason": report.reason,
            "status": report.status.value if hasattr(report.status, 'value') else str(report.status),
            "admin_notice": report.admin_notice,
            "owner_notice": report.owner_notice if hasattr(report, 'owner_notice') else None,
            "created_at": report.created_at.isoformat() if report.created_at else None,
            "updated_at": report.updated_at.isoformat() if hasattr(report, 'updated_at') and report.updated_at else None
        })
    
    # Adjust total if search filter was applied
    if search:
        total = len(reports)
    
    return {
        "reports": reports,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total > 0 else 0
    }


# User Actions
@router.put("/users/{user_id}/block")
def block_user(
    user_id: str,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Block/unblock a user."""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.is_active = not user.is_active
        db.commit()
        
        return {
            "success": True,
            "message": f"User {'blocked' if not user.is_active else 'unblocked'} successfully",
            "is_active": user.is_active
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Permanently delete a user and all associated data from the database.
    This action cannot be undone.
    """
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's properties for cleanup
        user_properties = db.query(Property).filter(Property.owner_id == user_id).all()
        
        # Delete all user's properties and their associated data
        for property_obj in user_properties:
            # Delete property images, amenities, house rules, reviews, reports, wishlists
            from app.models.property import PropertyImage, PropertyAmenity, HouseRule, Review, Report, Wishlist
            
            # Delete property images
            db.query(PropertyImage).filter(PropertyImage.property_id == property_obj.id).delete()
            
            # Delete property amenities
            db.query(PropertyAmenity).filter(PropertyAmenity.property_id == property_obj.id).delete()
            
            # Delete house rules
            db.query(HouseRule).filter(HouseRule.property_id == property_obj.id).delete()
            
            # Delete reviews for this property
            db.query(Review).filter(Review.property_id == property_obj.id).delete()
            
            # Delete reports for this property
            db.query(Report).filter(Report.property_id == property_obj.id).delete()
            
            # Delete wishlists for this property
            db.query(Wishlist).filter(Wishlist.property_id == property_obj.id).delete()
            
            # Delete the property itself
            db.delete(property_obj)
        
        # Delete user's reviews on other properties
        from app.models.property import Review, Report, Wishlist
        db.query(Review).filter(Review.user_id == user_id).delete()
        
        # Delete user's reports
        db.query(Report).filter(Report.user_id == user_id).delete()
        
        # Delete user's wishlists
        db.query(Wishlist).filter(Wishlist.user_id == user_id).delete()
        
        # Finally, delete the user
        db.delete(user)
        db.commit()
        
        return {
            "success": True,
            "message": f"User '{user.full_name}' and all associated data deleted successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")


@router.get("/users/{user_id}")
def get_user_details(
    user_id: str,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get detailed user information."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's properties count
    properties_count = db.query(Property).filter(Property.owner_id == user_id).count()
    
    return {
        "id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "city": user.city,
        "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
        "is_verified": user.is_verified,
        "is_active": user.is_active,
        "occupation": user.occupation,
        "age": user.age,
        "bio": user.bio,
        "profile_photo": user.profile_photo,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "properties_count": properties_count
    }


# Property Actions
@router.put("/properties/{property_id}/toggle-active")
def toggle_property_active(
    property_id: str,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Activate/deactivate a property."""
    try:
        property_obj = db.query(Property).filter(Property.id == property_id).first()
        if not property_obj:
            raise HTTPException(status_code=404, detail="Property not found")
        
        property_obj.is_active = not property_obj.is_active
        db.commit()
        
        return {
            "success": True,
            "message": f"Property {'activated' if property_obj.is_active else 'deactivated'} successfully",
            "is_active": property_obj.is_active
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/properties/{property_id}")
def get_property_details(
    property_id: str,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get detailed property information."""
    from app.models.property import PropertyImage, PropertyAmenity, HouseRule
    
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Get owner details
    owner = db.query(User).filter(User.id == property_obj.owner_id).first()
    
    # Get images
    images = db.query(PropertyImage).filter(PropertyImage.property_id == property_id).all()
    
    # Get amenities
    amenities = db.query(PropertyAmenity).filter(PropertyAmenity.property_id == property_id).all()
    
    # Get house rules
    rules = db.query(HouseRule).filter(HouseRule.property_id == property_id).all()
    
    return {
        "id": str(property_obj.id),
        "property_title": property_obj.property_title,
        "property_type": property_obj.property_type.value if hasattr(property_obj.property_type, 'value') else str(property_obj.property_type),
        "city": property_obj.city,
        "area_locality": property_obj.area_locality,
        "description": property_obj.description,
        "monthly_rent": property_obj.monthly_rent,
        "deposit": property_obj.deposit,
        "available_from": property_obj.available_from.isoformat() if property_obj.available_from else None,
        "preferred_tenant": property_obj.preferred_tenant.value if hasattr(property_obj.preferred_tenant, 'value') else str(property_obj.preferred_tenant),
        "is_active": property_obj.is_active,
        "created_at": property_obj.created_at.isoformat() if property_obj.created_at else None,
        "owner": {
            "id": str(owner.id),
            "full_name": owner.full_name,
            "email": owner.email,
            "phone_number": owner.phone_number
        } if owner else None,
        "images": [img.image_url for img in images],
        "amenities": [amenity.amenity_name for amenity in amenities],
        "house_rules": [rule.rule_text for rule in rules]
    }


@router.post("/properties/{property_id}/notify-owner")
def notify_property_owner(
    property_id: str,
    message: dict,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Send a notification to the property owner about a report.
    Also saves the message to the report's owner_notice field.
    Protected route - requires admin authentication.
    """
    from app.models.property import Report
    from datetime import datetime
    
    try:
        # Get property and owner details
        property_obj = db.query(Property).filter(Property.id == property_id).first()
        if not property_obj:
            raise HTTPException(status_code=404, detail="Property not found")
        
        owner = db.query(User).filter(User.id == property_obj.owner_id).first()
        if not owner:
            raise HTTPException(status_code=404, detail="Property owner not found")
        
        # Find the most recent report for this property and update owner_notice
        report = db.query(Report).filter(
            Report.property_id == property_id
        ).order_by(Report.created_at.desc()).first()
        
        if report:
            report.owner_notice = message.get('message', '')
            report.updated_at = datetime.utcnow()
            db.commit()
        
        # Email notification would be implemented here in production
        
        return {
            "success": True,
            "message": "Notification sent to property owner",
            "owner_email": owner.email,
            "owner_name": owner.full_name
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to send notification: {str(e)}")


# Report Actions
@router.put("/reports/{report_id}/status")
def update_report_status(
    report_id: str,
    status: str,
    admin_notice: str = None,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update report status (pending, fixed, rejected) and optionally add admin notice."""
    from app.models.property import Report, ReportStatus
    from datetime import datetime
    
    try:
        # Validate status
        if status not in ['pending', 'fixed', 'rejected']:
            raise HTTPException(status_code=400, detail="Invalid status. Must be 'pending', 'fixed', or 'rejected'")
        
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Update status
        report.status = ReportStatus(status)
        
        # Update admin notice if provided
        if admin_notice is not None:
            report.admin_notice = admin_notice
        
        # Update timestamp
        if hasattr(report, 'updated_at'):
            report.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Report status updated to {status}",
            "status": status,
            "admin_notice": report.admin_notice
        }
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Invalid status value: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

