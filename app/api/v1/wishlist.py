from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.room import Room
from app.models.wishlist import Wishlist

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


# ❤️ Add to Wishlist
@router.post("/{room_id}")
def add_to_wishlist(
    room_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.room_id == room_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already in wishlist")

    wishlist_item = Wishlist(
        user_id=current_user.id,
        room_id=room_id
    )

    db.add(wishlist_item)
    db.commit()

    return {"message": "Added to wishlist"}


# ❌ Remove from Wishlist
@router.delete("/{room_id}")
def remove_from_wishlist(
    room_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.room_id == room_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Not in wishlist")

    db.delete(item)
    db.commit()

    return {"message": "Removed from wishlist"}


# 📋 Get My Wishlist
@router.get("")
def get_my_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id
    ).all()

    result = []

    for item in items:
        room = db.query(Room).filter(Room.id == item.room_id).first()

        if room:
            result.append({
                "id": room.id,
                "title": room.title,
                "rent": room.rent,
                "city": room.city,
                "area": room.area,
                "image_url": room.images[0].image_url if room.images else None
            })

    return result


# 🔢 Wishlist Count
@router.get("/count")
def wishlist_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id
    ).count()

    return {"wishlist_count": count}
