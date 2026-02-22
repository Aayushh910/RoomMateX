from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.schemas.property import ReportCreate, MessageResponse
from app.services.report_service import ReportService

router = APIRouter(prefix="/properties", tags=["Reports"])


@router.post("/{property_id}/report", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def report_property(
    property_id: UUID,
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Report a property.
    
    Requires authentication.
    User can only report a property once.
    """
    ReportService.create_report(
        property_id=property_id,
        report_data=report_data,
        current_user=current_user,
        db=db
    )
    
    return MessageResponse(message="Property reported successfully")
