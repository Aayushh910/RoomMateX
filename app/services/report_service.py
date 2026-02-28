from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from app.models.property import Report, Property
from app.models.user import User
from app.schemas.property import ReportCreate


class ReportService:
    """Service for report operations."""
    
    @staticmethod
    def create_report(
        property_id: UUID,
        report_data: ReportCreate,
        current_user: User,
        db: Session
    ) -> Report:
        """Create a report for a property."""
        # Check if property exists
        property_obj = db.query(Property).filter(Property.id == property_id).first()
        
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        # Check if user already reported this property
        existing_report = db.query(Report).filter(
            Report.property_id == property_id,
            Report.user_id == current_user.id
        ).first()
        
        if existing_report:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reported this property"
            )
        
        # Create report
        new_report = Report(
            property_id=property_id,
            user_id=current_user.id,
            reason=report_data.reason
        )
        
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        return new_report
