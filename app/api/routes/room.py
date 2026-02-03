from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomResponse
from app.core.deps import require_owner

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
def create_room(
    data: RoomCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_owner)
):
    room = Room(**data.dict(), owner_id=current_user.id)

    db.add(room)
    db.commit()
    db.refresh(room)

    return room

@router.get("/", response_model=list[RoomResponse])
def get_all_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).filter(Room.is_available == True).all()
    return rooms

@router.get("/my", response_model=list[RoomResponse])
def get_my_rooms(
    db: Session = Depends(get_db),
    current_user = Depends(require_owner)
):
    rooms = db.query(Room).filter(Room.owner_id == current_user.id).all()
    return rooms