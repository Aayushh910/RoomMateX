from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from app.models.property import Report, Property
from app.models.user import User
from app.schemas.property import ReportCreate
from app.services.base_service import BaseService


class ReportService(BaseService):
    """Service for report operations."""
    
    @staticmethod
    def create_report(
        property_id: UUID,
        report_data: ReportCreate,
        current_user: User,
        db: Session
    ) -> Report:
        """Create a report for a property."""
        # Check if property exists using base service
        property_obj = ReportService.get_or_404(db, Property, property_id, "Property not found")
        
        # Check for duplicate report using base service
        ReportService.check_duplicate(
            db, Report, 
            {"property_id": property_id, "user_id": current_user.id},
            "You have already reported this property"
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
