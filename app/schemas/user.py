from pydantic import BaseModel, EmailStr
from typing import Optional

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    city: Optional[str]
    role: str
    is_verified: bool

    class Config:
        from_attributes = True
