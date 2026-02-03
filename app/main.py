from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import user
from app.api.routes import auth,room

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RoomMateX API")

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(room.router, prefix="/api/rooms", tags=["Rooms"])

@app.get("/")
def root():
    return {"status": "RoomMateX backend running"}
