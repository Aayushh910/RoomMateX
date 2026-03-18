from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.models.user import UserRole


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: str = Field(..., min_length=10, max_length=15)  # Fixed: matches database schema
    email: EmailStr
    password: str = Field(..., min_length=6)
    city: str = Field(..., min_length=2, max_length=100)
    role: UserRole
    
    @validator('phone_number')  # Fixed: matches field name
    def validate_phone(cls, v):
        if not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Phone number must contain only digits, spaces, hyphens, or plus sign')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    role: UserRole
    city: str
    phone_number: str  # Fixed: matches database schema
    is_active: bool
    is_verified: bool
    occupation: Optional[str] = None
    age: Optional[int] = None
    bio: Optional[str] = None
    profile_photo: Optional[str] = None
    gender_preference: Optional[str] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    lifestyle: Optional[str] = None
    interests: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    occupation: Optional[str] = Field(None, max_length=100)
    age: Optional[int] = Field(None, ge=18, le=100)
    bio: Optional[str] = Field(None, max_length=500)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    phone_number: Optional[str] = Field(None, min_length=10, max_length=15)  # Fixed: matches database schema
    gender_preference: Optional[str] = Field(None, max_length=20)
    budget_min: Optional[int] = Field(None, ge=0)
    budget_max: Optional[int] = Field(None, ge=0)
    lifestyle: Optional[str] = None  # JSON string
    interests: Optional[str] = None  # JSON string
    
    @validator('phone_number')  # Fixed: matches field name
    def validate_phone(cls, v):
        if v and not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Phone number must contain only digits, spaces, hyphens, or plus sign')
        return v


class UserRegisterResponse(BaseModel):
    message: str
    user: UserResponse


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class OTPRequest(BaseModel):
    otp: str = Field(..., min_length=6, max_length=6)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=6)


class MessageResponse(BaseModel):
    message: str
