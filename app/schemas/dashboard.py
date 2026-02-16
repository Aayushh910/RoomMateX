from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class DashboardSummaryResponse(BaseModel):
    """Dashboard summary counts."""
    my_listings_count: int
    wishlist_count: int
    recently_viewed_count: int
    my_requests_count: int


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


class ContactRequestResponse(BaseModel):
    """Contact request for My Requests section."""
    id: UUID
    property_title: str
    sender_name: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj, current_user_role: str):
        # Get property title
        property_title = obj.property.property_title if obj.property else "Unknown Property"
        
        # Get sender name (only for room owners viewing received requests)
        sender_name = None
        if current_user_role == "room_owner" and obj.sender:
            sender_name = obj.sender.full_name
        
        data = {
            "id": obj.id,
            "property_title": property_title,
            "sender_name": sender_name,
            "message": obj.message,
            "created_at": obj.created_at
        }
        return cls(**data)
