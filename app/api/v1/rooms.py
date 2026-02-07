from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import Optional
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import JSONB
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.room import Room
from app.models.room_image import RoomImage
from app.models.recently_viewed import RecentlyViewed
from app.schemas.room import RoomCreate, RoomResponse

router = APIRouter(prefix="/rooms", tags=["Rooms"])


# CREATE ROOM
@router.post("", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admins cannot list rooms")

    new_room = Room(
        owner_id=current_user.id,
        title=room.title,
        description=room.description,
        rent=room.rent,
        deposit=room.deposit,
        city=room.city,
        area=room.area,
        room_type=room.room_type,
        furnishing=room.furnishing,
        preferred_gender=room.preferred_gender,
        amenities=room.amenities,
        house_rules=room.house_rules,
        is_active=True
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    for url in room.image_urls:
        image = RoomImage(
            room_id=new_room.id,
            image_url=url
        )
        db.add(image)

    db.commit()

    return new_room


# FIND ROOMS (FILTER + PAGINATION)
@router.get("")
def list_rooms(
    city: Optional[str] = None,
    min_rent: Optional[float] = None,
    max_rent: Optional[float] = None,
    room_type: Optional[str] = None,
    amenities: Optional[str] = None,  # comma separated
    page: int = 1,
    limit: int = 9,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy import cast
    from sqlalchemy.dialects.postgresql import JSONB

    query = db.query(Room).filter(Room.is_active == True)

    # City filter
    if city:
        query = query.filter(Room.city == city)

    # Rent filters
    if min_rent is not None:
        query = query.filter(Room.rent >= min_rent)

    if max_rent is not None:
        query = query.filter(Room.rent <= max_rent)

    # Room type filter
    if room_type:
        query = query.filter(Room.room_type == room_type)

    # Strict Amenities filter (must match ALL selected)
    if amenities:
        amenities_list = [a.strip() for a in amenities.split(",")]

        for amenity in amenities_list:
            query = query.filter(
                cast(Room.amenities, JSONB).contains([amenity])
            )

    # Sort newest first
    query = query.order_by(desc(Room.created_at))

    # Pagination
    offset = (page - 1) * limit
    rooms = query.offset(offset).limit(limit).all()

    result = []

    for room in rooms:
        result.append({
            "id": room.id,
            "title": room.title,
            "rent": room.rent,
            "city": room.city,
            "area": room.area,
            "room_type": room.room_type,
            "furnishing": room.furnishing,
            "preferred_gender": room.preferred_gender,
            "image_url": room.images[0].image_url if room.images else None
        })

    return result



# ROOM DETAIL (AUTO TRACK RECENTLY VIEWED)
@router.get("/{room_id}")
def get_room_detail(
    room_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    room = db.query(Room).filter(Room.id == room_id).first()

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Track Recently Viewed
    existing_view = db.query(RecentlyViewed).filter(
        RecentlyViewed.user_id == current_user.id,
        RecentlyViewed.room_id == room_id
    ).first()

    if existing_view:
        existing_view.viewed_at = func.now()
    else:
        view_entry = RecentlyViewed(
            user_id=current_user.id,
            room_id=room_id
        )
        db.add(view_entry)

    db.commit()

    return {
        "id": room.id,
        "title": room.title,
        "description": room.description,
        "rent": room.rent,
        "deposit": room.deposit,
        "city": room.city,
        "area": room.area,
        "room_type": room.room_type,
        "furnishing": room.furnishing,
        "preferred_gender": room.preferred_gender,
        "amenities": room.amenities,
        "house_rules": room.house_rules,
        "is_active": room.is_active,
        "images": [img.image_url for img in room.images]
    }



# RECENTLY VIEWED COUNT

@router.get("/recently-viewed/count")
def recently_viewed_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = db.query(RecentlyViewed).filter(
        RecentlyViewed.user_id == current_user.id
    ).count()

    return {"recently_viewed_count": count}



# RECENTLY VIEWED LIST (LATEST 5)
@router.get("/recently-viewed")
def recently_viewed_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    views = (
        db.query(RecentlyViewed)
        .filter(RecentlyViewed.user_id == current_user.id)
        .order_by(desc(RecentlyViewed.viewed_at))
        .limit(5)
        .all()
    )

    result = []

    for view in views:
        room = db.query(Room).filter(Room.id == view.room_id).first()

        if room:
            result.append({
                "id": room.id,
                "title": room.title,
                "rent": room.rent,
                "city": room.city,
                "area": room.area,
                "image_url": room.images[0].image_url if room.images else None,
                "viewed_at": view.viewed_at
            })

    return result
