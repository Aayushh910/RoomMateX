from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from app.models.property import PropertyType, PreferredTenant


# Amenities list
VALID_AMENITIES = [
    "wifi", "ac", "parking", "security", "gym", "swimming_pool",
    "power_backup", "elevator", "meals", "laundry", "water_supply", "playground"
]


class PropertyImageResponse(BaseModel):
    id: UUID
    image_url: str
    
    class Config:
        from_attributes = True


class PropertyAmenityResponse(BaseModel):
    amenity_name: str
    
    class Config:
        from_attributes = True


class PropertyCreate(BaseModel):
    # Step 1: Basic Info
    property_title: str = Field(..., min_length=5, max_length=200)
    property_type: PropertyType
    city: str = Field(..., min_length=2, max_length=100)
    area_locality: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    
    # Step 2: Pricing & Availability
    monthly_rent: int = Field(..., gt=0)
    deposit: int = Field(..., ge=0)
    available_from: date
    
    # Step 3: Tenant Preference & Amenities
    preferred_tenant: PreferredTenant = PreferredTenant.ANY
    amenities: List[str] = Field(default_factory=list)
    house_rules: List[str] = Field(default_factory=list)
    
    @validator('amenities')
    def validate_amenities(cls, v):
        for amenity in v:
            if amenity not in VALID_AMENITIES:
                raise ValueError(f'Invalid amenity: {amenity}. Must be one of {VALID_AMENITIES}')
        return v
    
    @validator('available_from')
    def validate_date(cls, v):
        if v < date.today():
            raise ValueError('available_from must be today or a future date')
        return v


class PropertyUpdate(BaseModel):
    property_title: Optional[str] = Field(None, min_length=5, max_length=200)
    property_type: Optional[PropertyType] = None
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    area_locality: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    monthly_rent: Optional[int] = Field(None, gt=0)
    deposit: Optional[int] = Field(None, ge=0)
    available_from: Optional[date] = None
    preferred_tenant: Optional[PreferredTenant] = None
    amenities: Optional[List[str]] = None
    house_rules: Optional[List[str]] = None
    is_active: Optional[bool] = None
    
    @validator('amenities')
    def validate_amenities(cls, v):
        if v is not None:
            for amenity in v:
                if amenity not in VALID_AMENITIES:
                    raise ValueError(f'Invalid amenity: {amenity}')
        return v


class PropertyResponse(BaseModel):
    id: UUID
    owner_id: UUID
    property_title: str
    property_type: PropertyType
    city: str
    area_locality: str
    monthly_rent: int
    deposit: int
    available_from: date
    preferred_tenant: PreferredTenant
    is_active: bool
    created_at: datetime
    updated_at: datetime
    images: List[PropertyImageResponse] = []
    amenities: List[str] = []
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        # Convert amenities from relationship to list of strings
        amenities_list = [amenity.amenity_name for amenity in obj.amenities]
        
        data = {
            "id": obj.id,
            "owner_id": obj.owner_id,
            "property_title": obj.property_title,
            "property_type": obj.property_type,
            "city": obj.city,
            "area_locality": obj.area_locality,
            "monthly_rent": obj.monthly_rent,
            "deposit": obj.deposit,
            "available_from": obj.available_from,
            "preferred_tenant": obj.preferred_tenant,
            "is_active": obj.is_active,
            "created_at": obj.created_at,
            "updated_at": obj.updated_at,
            "images": obj.images,
            "amenities": amenities_list
        }
        return cls(**data)


class PropertyFindRoomsResponse(BaseModel):
    """Response schema for Find Rooms page - optimized format."""
    id: UUID
    owner_id: UUID
    owner_verified: bool
    property_title: str
    property_type: PropertyType
    city: str
    area_locality: str
    monthly_rent: int
    deposit: int
    available_from: date
    preferred_tenant: PreferredTenant
    is_active: bool
    created_at: datetime
    images: List[str] = []  # Just URLs, not objects
    amenities: List[str] = []
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        # Convert amenities from relationship to list of strings
        amenities_list = [amenity.amenity_name for amenity in obj.amenities]
        
        # Convert images to list of URL strings
        image_urls = [img.image_url for img in obj.images]
        
        # Get owner verification status
        owner_verified = obj.owner.is_verified if obj.owner else False
        
        data = {
            "id": obj.id,
            "owner_id": obj.owner_id,
            "owner_verified": owner_verified,
            "property_title": obj.property_title,
            "property_type": obj.property_type,
            "city": obj.city,
            "area_locality": obj.area_locality,
            "monthly_rent": obj.monthly_rent,
            "deposit": obj.deposit,
            "available_from": obj.available_from,
            "preferred_tenant": obj.preferred_tenant,
            "is_active": obj.is_active,
            "created_at": obj.created_at,
            "images": image_urls,
            "amenities": amenities_list
        }
        return cls(**data)


class PropertyListResponse(BaseModel):
    properties: List[PropertyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PropertyFindRoomsListResponse(BaseModel):
    """Response for Find Rooms page with optimized format."""
    data: List[PropertyFindRoomsResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class MessageResponse(BaseModel):
    message: str



# Review Schemas
class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=1000)


class ReviewResponse(BaseModel):
    id: UUID
    user_name: str
    rating: int
    comment: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        data = {
            "id": obj.id,
            "user_name": obj.user.full_name if obj.user else "Unknown",
            "rating": obj.rating,
            "comment": obj.comment,
            "created_at": obj.created_at
        }
        return cls(**data)


class ReviewListResponse(BaseModel):
    data: List[ReviewResponse]
    total: int
    page: int
    limit: int
    total_pages: int


# Wishlist Schemas
class WishlistResponse(BaseModel):
    id: UUID
    property_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


# Contact Request Schemas
class ContactRequestCreate(BaseModel):
    message: Optional[str] = Field(None, max_length=500)


class ContactRequestResponse(BaseModel):
    id: UUID
    property_id: UUID
    sender_id: UUID
    owner_id: UUID
    message: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Report Schemas
class ReportCreate(BaseModel):
    reason: str = Field(..., min_length=10, max_length=500)


class ReportResponse(BaseModel):
    id: UUID
    property_id: UUID
    user_id: UUID
    reason: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Property Details Response (Enhanced)
class OwnerResponse(BaseModel):
    id: UUID
    full_name: str
    role: str
    is_verified: bool
    
    class Config:
        from_attributes = True


class PropertyDetailsResponse(BaseModel):
    id: UUID
    property_title: str
    property_type: PropertyType
    city: str
    area_locality: str
    description: Optional[str]
    monthly_rent: int
    deposit: int
    available_from: date
    preferred_tenant: PreferredTenant
    is_active: bool
    created_at: datetime
    images: List[str] = []
    amenities: List[str] = []
    house_rules: List[str] = []
    owner: OwnerResponse
    rating: float
    total_reviews: int
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj, avg_rating: float = 0.0, total_reviews: int = 0):
        # Convert amenities to list of strings
        amenities_list = [amenity.amenity_name for amenity in obj.amenities]
        
        # Convert images to list of URL strings
        image_urls = [img.image_url for img in obj.images]
        
        # Convert house rules to list of strings
        house_rules_list = [rule.rule_text for rule in obj.house_rules]
        
        # Owner data
        owner_data = OwnerResponse(
            id=obj.owner.id,
            full_name=obj.owner.full_name,
            role=obj.owner.role.value,
            is_verified=obj.owner.is_verified
        )
        
        data = {
            "id": obj.id,
            "property_title": obj.property_title,
            "property_type": obj.property_type,
            "city": obj.city,
            "area_locality": obj.area_locality,
            "description": obj.description,
            "monthly_rent": obj.monthly_rent,
            "deposit": obj.deposit,
            "available_from": obj.available_from,
            "preferred_tenant": obj.preferred_tenant,
            "is_active": obj.is_active,
            "created_at": obj.created_at,
            "images": image_urls,
            "amenities": amenities_list,
            "house_rules": house_rules_list,
            "owner": owner_data,
            "rating": round(avg_rating, 1),
            "total_reviews": total_reviews
        }
        return cls(**data)
