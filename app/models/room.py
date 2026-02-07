import uuid
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    rent = Column(Float, nullable=False)
    deposit = Column(Float, nullable=False)

    city = Column(String, nullable=False)
    area = Column(String, nullable=False)

    room_type = Column(String, nullable=False)
    furnishing = Column(String, nullable=False)
    preferred_gender = Column(String, nullable=False)

    amenities = Column(JSON, nullable=False)

    house_rules = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    images = relationship("RoomImage", back_populates="room", cascade="all, delete")
