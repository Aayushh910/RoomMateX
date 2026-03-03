from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, func
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional
from uuid import UUID
from app.models.property import Property, PropertyImage, PropertyAmenity, HouseRule
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyUpdate
from app.utils.file_upload import FileUploadService
from app.services.base_service import BaseService


class PropertyService(BaseService):
    """Service for property operations."""
    
    @staticmethod
    async def create_property(
        property_data: PropertyCreate,
        images: List[UploadFile],
        owner: User,
        db: Session
    ) -> Property:
        """Create a new property listing."""
        # Check if user is verified
        if not owner.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email verification required to create property listing"
            )
        
        # Save images
        image_urls = []
        if images:
            image_urls = await FileUploadService.save_multiple_images(images)
        
        try:
            # Create property
            new_property = Property(
                owner_id=owner.id,
                property_title=property_data.property_title,
                property_type=property_data.property_type,
                city=property_data.city,
                area_locality=property_data.area_locality,
                description=property_data.description,
                monthly_rent=property_data.monthly_rent,
                deposit=property_data.deposit,
                available_from=property_data.available_from,
                preferred_tenant=property_data.preferred_tenant
            )
            
            db.add(new_property)
            db.flush()  # Get property ID
            
            # Add images
            for image_url in image_urls:
                property_image = PropertyImage(
                    property_id=new_property.id,
                    image_url=image_url
                )
                db.add(property_image)
            
            # Add amenities
            for amenity in property_data.amenities:
                property_amenity = PropertyAmenity(
                    property_id=new_property.id,
                    amenity_name=amenity
                )
                db.add(property_amenity)
            
            # Add house rules
            for rule in property_data.house_rules:
                house_rule = HouseRule(
                    property_id=new_property.id,
                    rule_text=rule
                )
                db.add(house_rule)
            
            db.commit()
            db.refresh(new_property)
            
            return new_property
            
        except Exception as e:
            db.rollback()
            # Clean up uploaded images
            FileUploadService.delete_multiple_images(image_urls)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create property: {str(e)}"
            )
    
    @staticmethod
    def get_properties(
        db: Session,
        skip: int = 0,
        limit: int = 9,
        city: Optional[str] = None,
        property_type: Optional[str] = None,
        min_rent: Optional[int] = None,
        max_rent: Optional[int] = None,
        amenities: Optional[List[str]] = None,
        sort_by: Optional[str] = "newest"
    ) -> tuple[List[Property], int]:
        """
        Get all properties with advanced filters and pagination.
        
        Filters:
        - Only active properties (is_active=True)
        - Only properties from verified owners (owner.is_verified=True)
        - City, property_type, rent range
        - Amenities (must match ALL selected amenities)
        
        Sorting:
        - newest: Most recent first (default)
        - rent_asc: Lowest rent first
        - rent_desc: Highest rent first
        """
        # Base query with join to User table for owner verification
        query = db.query(Property).join(User, Property.owner_id == User.id).filter(
            and_(
                Property.is_active == True,
                User.is_verified == True
            )
        ).options(
            joinedload(Property.owner),
            joinedload(Property.images),
            joinedload(Property.amenities)
        )
        
        # Apply filters
        if city:
            query = query.filter(Property.city.ilike(f"%{city}%"))
        
        if property_type:
            query = query.filter(Property.property_type == property_type)
        
        if min_rent is not None:
            query = query.filter(Property.monthly_rent >= min_rent)
        
        if max_rent is not None:
            query = query.filter(Property.monthly_rent <= max_rent)
        
        # Amenities filter - must match ALL selected amenities
        if amenities and len(amenities) > 0:
            # Subquery to count matching amenities for each property
            amenity_count_subquery = (
                db.query(PropertyAmenity.property_id)
                .filter(PropertyAmenity.amenity_name.in_(amenities))
                .group_by(PropertyAmenity.property_id)
                .having(func.count(PropertyAmenity.amenity_name) == len(amenities))
                .subquery()
            )
            
            query = query.filter(Property.id.in_(
                db.query(amenity_count_subquery.c.property_id)
            ))
        
        # Apply sorting
        if sort_by == "rent_asc":
            query = query.order_by(Property.monthly_rent.asc())
        elif sort_by == "rent_desc":
            query = query.order_by(Property.monthly_rent.desc())
        else:  # newest (default)
            query = query.order_by(Property.created_at.desc())
        
        # Get total count (before pagination)
        total = query.distinct().count()
        
        # Apply pagination and get distinct results
        properties = query.distinct().offset(skip).limit(limit).all()
        
        return properties, total
    
    @staticmethod
    def get_property_by_id(property_id: UUID, db: Session) -> Property:
        """Get property by ID with detailed information."""
        property_obj = db.query(Property).options(
            joinedload(Property.images),
            joinedload(Property.amenities),
            joinedload(Property.house_rules),
            joinedload(Property.owner)
        ).filter(Property.id == property_id).first()
        
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        return property_obj
    
    @staticmethod
    def get_property_details(property_id: UUID, db: Session, current_user: Optional[User] = None) -> tuple[Property, float, int]:
        """Get property details with rating and review count."""
        from app.models.property import Review
        from sqlalchemy import func
        
        # Use base service method
        property_obj = PropertyService.get_or_404(db, Property, property_id, "Property not found")
        
        # Check if property is accessible
        PropertyService.validate_active_property(property_obj, allow_owner=True, current_user=current_user)
        
        # Calculate average rating and total reviews
        rating_data = db.query(
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('total_reviews')
        ).filter(Review.property_id == property_id).first()
        
        avg_rating = float(rating_data.avg_rating) if rating_data.avg_rating else 0.0
        total_reviews = rating_data.total_reviews if rating_data.total_reviews else 0
        
        return property_obj, avg_rating, total_reviews
    
    @staticmethod
    def get_user_properties(owner_id: UUID, db: Session) -> List[Property]:
        """Get all properties owned by a user."""
        return db.query(Property).filter(Property.owner_id == owner_id).order_by(Property.created_at.desc()).all()
    
    @staticmethod
    async def update_property(
        property_id: UUID,
        property_data: PropertyUpdate,
        images: Optional[List[UploadFile]],
        current_user: User,
        db: Session
    ) -> Property:
        """Update property."""
        property_obj = PropertyService.get_property_by_id(property_id, db)
        
        # Check ownership using base service
        PropertyService.check_ownership(property_obj, current_user.id, "You can only update your own properties")
        
        # Update fields
        update_data = property_data.dict(exclude_unset=True)
        amenities = update_data.pop('amenities', None)
        house_rules = update_data.pop('house_rules', None)
        
        # Don't update is_active if it's None (keep existing value)
        if 'is_active' in update_data and update_data['is_active'] is None:
            update_data.pop('is_active')
        
        for field, value in update_data.items():
            setattr(property_obj, field, value)
        
        # Update amenities if provided
        if amenities is not None:
            # Delete old amenities
            db.query(PropertyAmenity).filter(PropertyAmenity.property_id == property_id).delete()
            
            # Add new amenities
            for amenity in amenities:
                property_amenity = PropertyAmenity(
                    property_id=property_id,
                    amenity_name=amenity
                )
                db.add(property_amenity)
        
        # Update house rules if provided
        if house_rules is not None:
            # Delete old house rules
            db.query(HouseRule).filter(HouseRule.property_id == property_id).delete()
            
            # Add new house rules
            for rule in house_rules:
                house_rule = HouseRule(
                    property_id=property_id,
                    rule_text=rule
                )
                db.add(house_rule)
        
        # Add new images if provided
        if images:
            image_urls = await FileUploadService.save_multiple_images(images)
            for image_url in image_urls:
                property_image = PropertyImage(
                    property_id=property_id,
                    image_url=image_url
                )
                db.add(property_image)
        
        db.commit()
        db.refresh(property_obj)
        
        return property_obj
    
    @staticmethod
    def delete_property(property_id: UUID, current_user: User, db: Session) -> None:
        """
        Completely delete property from database.
        
        This removes the property and all related data permanently.
        """
        property_obj = PropertyService.get_property_by_id(property_id, db)
        
        # Check ownership using base service
        PropertyService.check_ownership(property_obj, current_user.id, "You can only delete your own properties")
        
        try:
            # Collect image URLs for Cloudinary deletion before deleting the property
            image_urls = []
            if hasattr(property_obj, 'images') and property_obj.images:
                image_urls = [img.image_url for img in property_obj.images if img.image_url]
            
            # Delete the property (cascade will handle related records)
            db.delete(property_obj)
            db.commit()
            
            # Delete images from Cloudinary after successful database deletion
            if image_urls:
                try:
                    FileUploadService.delete_multiple_images(image_urls)
                except Exception as cloudinary_error:
                    # Log the error but don't fail the entire operation since DB deletion succeeded
                    print(f"Warning: Failed to delete some images from Cloudinary: {cloudinary_error}")
                
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete property: {str(e)}"
            )
