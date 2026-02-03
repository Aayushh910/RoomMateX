from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class RoomCreate(BaseModel):
    title: str
    description: Optional[str] = None
    rent: int
    deposit: Optional[int] = None
    city: str
    area: Optional[str] = None
    room_type: Optional[str] = "private"
    gender_preference: Optional[str] = "any"
    furnished: Optional[bool] = False
    house_rules: Optional[str] = None
    amenities: Optional[Dict] = None


class RoomResponse(RoomCreate):
    id: int
    owner_id: int
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True
