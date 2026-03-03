from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.property import Report, Property
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/my-reports")
def get_my_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reports submitted by the current user with admin responses.
    Shows both admin_notice (message to reporter) and owner_notice (message to owner).
    """
    # Get all reports by this user
    reports = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.updated_at.desc()).all()
    
    result = []
    for report in reports:
        # Get property details
        property_obj = db.query(Property).filter(Property.id == report.property_id).first()
        
        # Check if there's any admin response
        has_admin_response = bool(report.admin_notice or report.owner_notice)
        
        result.append({
            "id": str(report.id),
            "property_id": str(report.property_id),
            "property_title": property_obj.property_title if property_obj else "Unknown Property",
            "reason": report.reason,
            "status": report.status.value if hasattr(report.status, 'value') else str(report.status),
            "admin_notice": report.admin_notice,  # Message to reporter
            "owner_notice": report.owner_notice,  # Message to owner (for transparency)
            "is_read": report.is_read,  # Read status
            "created_at": report.created_at.isoformat() if report.created_at else None,
            "updated_at": report.updated_at.isoformat() if report.updated_at else None,
            "has_admin_response": has_admin_response,
            "is_new": has_admin_response and not report.is_read  # New if has response and not read
        })
    
    return {
        "reports": result,
        "total": len(result),
        "unread_count": sum(1 for r in result if r["has_admin_response"] and not r["is_read"])
    }


@router.get("/owner-reports")
def get_owner_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reports on properties owned by the current user with admin notices.
    """
    # Get all properties owned by this user
    user_properties = db.query(Property).filter(Property.owner_id == current_user.id).all()
    property_ids = [prop.id for prop in user_properties]
    
    # Get all reports on these properties
    reports = db.query(Report).filter(
        Report.property_id.in_(property_ids)
    ).order_by(Report.updated_at.desc()).all()
    
    result = []
    for report in reports:
        # Get property details
        property_obj = db.query(Property).filter(Property.id == report.property_id).first()
        
        # Get reporter details
        reporter = db.query(User).filter(User.id == report.user_id).first()
        
        # Check if there's an owner notice
        has_owner_notice = bool(report.owner_notice)
        
        result.append({
            "id": str(report.id),
            "property_id": str(report.property_id),
            "property_title": property_obj.property_title if property_obj else "Unknown Property",
            "reason": report.reason,
            "status": report.status.value if hasattr(report.status, 'value') else str(report.status),
            "owner_notice": report.owner_notice,  # Message from admin to owner
            "reporter_name": reporter.full_name if reporter else "Unknown User",
            "owner_is_read": report.owner_is_read,  # Read status for owner
            "created_at": report.created_at.isoformat() if report.created_at else None,
            "updated_at": report.updated_at.isoformat() if report.updated_at else None,
            "has_owner_notice": has_owner_notice,
            "is_new": has_owner_notice and not report.owner_is_read  # New if has owner notice and not read
        })
    
    return {
        "reports": result,
        "total": len(result),
        "unread_count": sum(1 for r in result if r["has_owner_notice"] and not r["owner_is_read"])
    }


@router.get("/unread-count")
def get_unread_notifications_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get count of unread notifications (both as reporter and as owner).
    """
    # Count reports where user is the reporter
    reporter_reports = db.query(Report).filter(
        Report.user_id == current_user.id
    ).all()
    
    reporter_unread = 0
    for report in reporter_reports:
        has_admin_response = bool(report.admin_notice or report.owner_notice)
        if has_admin_response and not report.is_read:
            reporter_unread += 1
    
    # Count reports on user's properties
    user_properties = db.query(Property).filter(Property.owner_id == current_user.id).all()
    property_ids = [prop.id for prop in user_properties]
    
    owner_reports = db.query(Report).filter(
        Report.property_id.in_(property_ids)
    ).all()
    
    owner_unread = 0
    for report in owner_reports:
        has_owner_notice = bool(report.owner_notice)
        if has_owner_notice and not report.owner_is_read:
            owner_unread += 1
    
    return {
        "unread_count": reporter_unread + owner_unread,
        "reporter_unread": reporter_unread,
        "owner_unread": owner_unread
    }


@router.post("/mark-as-read/{report_id}")
def mark_notification_as_read(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a specific notification as read (for reporter).
    """
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    
    if not report:
        return {"success": False, "message": "Report not found"}
    
    report.is_read = True
    db.commit()
    
    return {"success": True, "message": "Notification marked as read"}


@router.post("/mark-owner-as-read/{report_id}")
def mark_owner_notification_as_read(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a specific notification as read (for property owner).
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        return {"success": False, "message": "Report not found"}
    
    # Verify user is the property owner
    property_obj = db.query(Property).filter(
        Property.id == report.property_id,
        Property.owner_id == current_user.id
    ).first()
    
    if not property_obj:
        return {"success": False, "message": "Not authorized"}
    
    report.owner_is_read = True
    db.commit()
    
    return {"success": True, "message": "Notification marked as read"}


@router.post("/mark-all-as-read")
def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark all notifications as read for the current user (as reporter).
    """
    reports = db.query(Report).filter(
        Report.user_id == current_user.id,
        Report.is_read == False
    ).all()
    
    count = 0
    for report in reports:
        # Only mark as read if there's an admin response
        if report.admin_notice or report.owner_notice:
            report.is_read = True
            count += 1
    
    db.commit()
    
    return {
        "success": True,
        "message": f"Marked {count} notifications as read",
        "count": count
    }


@router.post("/mark-all-owner-as-read")
def mark_all_owner_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark all owner notifications as read for the current user.
    """
    # Get all properties owned by this user
    user_properties = db.query(Property).filter(Property.owner_id == current_user.id).all()
    property_ids = [prop.id for prop in user_properties]
    
    # Get all unread reports on these properties
    reports = db.query(Report).filter(
        Report.property_id.in_(property_ids),
        Report.owner_is_read == False
    ).all()
    
    count = 0
    for report in reports:
        # Only mark as read if there's an owner notice
        if report.owner_notice:
            report.owner_is_read = True
            count += 1
    
    db.commit()
    
    return {
        "success": True,
        "message": f"Marked {count} owner notifications as read",
        "count": count
    }
