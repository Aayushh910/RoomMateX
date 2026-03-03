from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import Type, TypeVar, Optional

T = TypeVar('T')


class BaseService:
    """Base service class with common utility methods."""
    
    @staticmethod
    def get_or_404(db: Session, model: Type[T], entity_id: UUID, error_message: str = "Entity not found") -> T:
        """Get entity by ID or raise 404 error."""
        entity = db.query(model).filter(model.id == entity_id).first()
        if not entity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_message
            )
        return entity
    
    @staticmethod
    def check_ownership(entity, user_id: UUID, error_message: str = "Access denied") -> None:
        """Check if user owns the entity."""
        if hasattr(entity, 'owner_id') and entity.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=error_message
            )
        elif hasattr(entity, 'user_id') and entity.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=error_message
            )
    
    @staticmethod
    def check_duplicate(db: Session, model: Type[T], filters: dict, error_message: str = "Duplicate entry") -> None:
        """Check for duplicate entries."""
        query = db.query(model)
        for field, value in filters.items():
            query = query.filter(getattr(model, field) == value)
        
        if query.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message
            )
    
    @staticmethod
    def validate_active_property(property_obj, allow_owner: bool = False, current_user=None) -> None:
        """Validate that property is active or user is owner."""
        if not property_obj.is_active:
            if not allow_owner or not current_user or property_obj.owner_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Property not found"
                )