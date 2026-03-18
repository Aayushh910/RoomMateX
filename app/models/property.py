import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Enum as SQLEnum, Date, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class PropertyType(str, enum.Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    PG = "pg"
    VILLA = "villa"


class PreferredTenant(str, enum.Enum):
    ANY = "any"
    MALE = "male"
    FEMALE = "female"
    FAMILY = "family"
    STUDENT = "student"


class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Basic Info
    property_title = Column(String, nullable=False)
    property_type = Column(SQLEnum(PropertyType), nullable=False)
    city = Column(String, nullable=False, index=True)
    area_locality = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Pricing & Availability
    monthly_rent = Column(Integer, nullable=False, index=True)
    deposit = Column(Integer, nullable=False)
    available_from = Column(Date, nullable=False)
    
    # Tenant Preference
    preferred_tenant = Column(SQLEnum(PreferredTenant), nullable=False, default=PreferredTenant.ANY)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    owner = relationship("User", backref="properties")
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan", order_by="PropertyImage.created_at")
    amenities = relationship("PropertyAmenity", back_populates="property", cascade="all, delete-orphan")
    house_rules = relationship("HouseRule", back_populates="property", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="property", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="property", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="property", cascade="all, delete-orphan")


class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship
    property = relationship("Property", back_populates="images")


class PropertyAmenity(Base):
    __tablename__ = "property_amenities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    amenity_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship
    property = relationship("Property", back_populates="amenities")


class HouseRule(Base):
    __tablename__ = "house_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    rule_text = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship
    property = relationship("Property", back_populates="house_rules")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("Property", back_populates="reviews")
    user = relationship("User", backref="reviews")


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("Property", back_populates="wishlists")
    user = relationship("User", backref="wishlists")


class ReportStatus(str, enum.Enum):
    """Report status enum"""
    pending = "pending"
    fixed = "fixed"
    rejected = "rejected"


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(SQLEnum(ReportStatus), nullable=False, default=ReportStatus.pending)
    admin_notice = Column(Text, nullable=True)  # Notice from admin to reporter
    owner_notice = Column(Text, nullable=True)  # Notice from admin to property owner
    is_read = Column(Boolean, default=False, nullable=False)  # Whether reporter has read the notification
    owner_is_read = Column(Boolean, default=False, nullable=False)  # Whether owner has read the notification
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("Property", back_populates="reports")
    user = relationship("User", backref="reports")
