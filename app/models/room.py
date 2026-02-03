from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Pricing
    rent = Column(Integer, nullable=False)
    deposit = Column(Integer, nullable=True)

    # Location
    city = Column(String, nullable=False)
    area = Column(String, nullable=True)

    # Details
    room_type = Column(String, default="private")  # private/shared
    gender_preference = Column(String, default="any")
    furnished = Column(Boolean, default=False)

    # Extra
    house_rules = Column(Text, nullable=True)
    amenities = Column(JSON, nullable=True)  # JSON field

    # Ownership
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", backref="rooms")

    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
