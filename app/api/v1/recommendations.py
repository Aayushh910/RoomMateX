from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/seekers")
def recommend_seekers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seekers = (
        db.query(User)
        .filter(
            User.role == "seeker_user",
            User.id != current_user.id
        )
        .order_by(func.random())
        .limit(6)
        .all()
    )

    result = []

    for user in seekers:
        result.append({
            "id": user.id,
            "full_name": user.full_name,
            "city": user.city
        })

    return result
