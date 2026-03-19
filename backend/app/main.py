from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from app.core.config import settings
from app.routes import auth, user, property, wishlist, dashboard, admin, notification, contact

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RoomMateX API",
    description="Backend API for RoomMateX - Room/Roommate Finding Platform",
    version="1.0.0"
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
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
        logger.info("✓ Database tables created successfully")
    except Exception as e:
        logger.warning(f"⚠ Warning: Could not create database tables: {e}")
        logger.warning("⚠ Please ensure PostgreSQL is running and credentials are correct")