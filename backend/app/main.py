from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import auth, user, property, wishlist, dashboard, admin, notification, contact

app = FastAPI(
    title="RoomMateX API",
    description="Backend API for RoomMateX - Room/Roommate Finding Platform",
    version="1.0.0"
)

# CORS middleware - Must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL, 
        "http://localhost:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(property.router)
app.include_router(wishlist.router)
app.include_router(dashboard.router)
app.include_router(admin.router)
app.include_router(notification.router)
app.include_router(contact.router)


@app.get("/")
def root():
    return {"message": "RoomMateX API is running successfully! 🚀"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Create database tables on startup (only if database is accessible)
@app.on_event("startup")
async def startup_event():
    try:
        from app.database import engine, Base
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully")
    except Exception as e:
        print(f"⚠ Warning: Could not create database tables: {e}")
        print("⚠ Please ensure PostgreSQL is running and credentials are correct")