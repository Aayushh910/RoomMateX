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

# Log all incoming requests (method + path)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"→ {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"← {request.method} {request.url.path} - {response.status_code}")
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# CORS middleware - Must be added before routes
# Allow the deployed frontend and local development hosts
allowed_origins = set()
if settings.FRONTEND_URL:
    # Support comma-separated origins and strip trailing slashes
    allowed_origins.update({o.strip().rstrip('/') for o in settings.FRONTEND_URL.split(',') if o.strip()})

allowed_origins.update([
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
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
    return {"status": "ok"}


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