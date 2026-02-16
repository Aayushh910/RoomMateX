import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    ROOM_SEEKER = "room_seeker"
    ROOM_OWNER = "room_owner"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    city = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.ROOM_SEEKER)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Profile completion fields
    occupation = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Verification fields
    is_verified = Column(Boolean, default=False, nullable=False)
    otp_code = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)
    
    # Temporary verification flags for sensitive operations
    password_change_verified = Column(Boolean, default=False, nullable=False)
    account_delete_verified = Column(Boolean, default=False, nullable=False)
    verification_expiry = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def is_profile_complete(self) -> bool:
        """Check if user has completed required profile fields."""
        required_fields = [
            self.full_name,
            self.email,
            self.phone_number,
            self.city,
            self.occupation,
            self.age
        ]
        return all(field is not None and str(field).strip() != '' for field in required_fields)
