from pydantic import BaseModel, Field
from uuid import UUID
from typing import List


class RoomCreate(BaseModel):
    title: str
    description: str

    rent: float
    deposit: float

    city: str
    area: str

    room_type: str
    furnishing: str
    preferred_gender: str

    amenities: List[str]
    house_rules: str | None = None

    image_urls: List[str] = Field(min_length=3)


class RoomResponse(BaseModel):
    id: UUID
    title: str
    description: str
    rent: float
    deposit: float
    city: str
    area: str
    room_type: str
    furnishing: str
    preferred_gender: str
    amenities: List[str]
    house_rules: str | None
    is_active: bool

    class Config:
        from_attributes = True
