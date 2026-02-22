from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class DashboardSummaryResponse(BaseModel):
    """Dashboard summary counts."""
    my_listings_count: int
    wishlist_count: int
    recently_viewed_count: int


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
        # Get first image as thumbnail
        thumbnail = obj.images[0].image_url if obj.images else None
        
        data = {
            "id": obj.id,
            "property_title": obj.property_title,
            "city": obj.city,
            "monthly_rent": obj.monthly_rent,
            "thumbnail_image": thumbnail
        }
        return cls(**data)


class MyListingResponse(BaseModel):
    """Property listing for My Listings section."""
    id: UUID
    property_title: str
    city: str
    monthly_rent: int
    thumbnail_image: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        # Get first image as thumbnail
        thumbnail = obj.images[0].image_url if obj.images else None
        
        data = {
            "id": obj.id,
            "property_title": obj.property_title,
            "city": obj.city,
            "monthly_rent": obj.monthly_rent,
            "thumbnail_image": thumbnail,
            "created_at": obj.created_at
        }
        return cls(**data)
