from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from app.api.v1.auth import router as auth_router
from app.api.v1.rooms import router as rooms_router
from app.api.v1.users import router as users_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.wishlist import router as wishlist_router


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(rooms_router, prefix="/api/v1")
app.include_router(recommendations_router, prefix="/api/v1")
app.include_router(wishlist_router,prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "RoomMateX Backend Running 🚀"}

