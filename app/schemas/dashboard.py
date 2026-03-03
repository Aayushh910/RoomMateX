from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class DashboardSummaryResponse(BaseModel):
    """Dashboard summary counts."""
    my_listings_count: int
    wishlist_count: int


def _extract_thumbnail(obj) -> Optional[str]:
    """Helper function to extract thumbnail from property object."""
    return obj.images[0].image_url if obj.images else None


class PropertyBasicResponse(BaseModel):
    """Basic property info for dashboard cards."""
    id: UUID
    property_title: str
    city: str
    monthly_rent: int
    thumbnail_image: Optional[str] = None
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            property_title=obj.property_title,
            city=obj.city,
            monthly_rent=obj.monthly_rent,
            thumbnail_image=_extract_thumbnail(obj)
        )


class MyListingResponse(BaseModel):
    """Property listing for My Listings section."""
    id: UUID
    property_title: str
    city: str
    monthly_rent: int
    thumbnail_image: Optional[str] = None
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            property_title=obj.property_title,
            city=obj.city,
            monthly_rent=obj.monthly_rent,
            thumbnail_image=_extract_thumbnail(obj),
            created_at=obj.created_at,
            is_active=obj.is_active
        )
