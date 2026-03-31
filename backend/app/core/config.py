from pydantic_settings import BaseSettings
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Server
    # Set this to the deployed frontend domain so backend CORS allows requests from the production UI.
    FRONTEND_URL: str = "https://room-matex.vercel.app"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000

    # Email (SMTP - Kept for backward compatibility)
    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587
    EMAIL_USERNAME: str = ""
    EMAIL_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    EMAIL_DEV_MODE: bool = False
    
    # Legacy email env vars (for backward compatibility)
    EMAIL_HOST_USER: str = ""
    EMAIL_HOST_PASSWORD: str = ""

    # SendGrid (NEW - Recommended)
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = ""
    
    # Admin
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    # Cloudinary (REQUIRED)
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    def __init__(self, **data):
        super().__init__(**data)
        # Handle backward compatibility: if new names not set, fall back to legacy names
        if not self.EMAIL_USERNAME and self.EMAIL_HOST_USER:
            self.EMAIL_USERNAME = self.EMAIL_HOST_USER
        if not self.EMAIL_PASSWORD and self.EMAIL_HOST_PASSWORD:
            self.EMAIL_PASSWORD = self.EMAIL_HOST_PASSWORD

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"  # Ignore extra environment variables


settings = Settings()

# Log configuration on startup (without exposing secrets)
import logging
logger = logging.getLogger(__name__)

def log_email_config():
    """Log email configuration for debugging (without exposing secrets)."""
    logger.info("=" * 70)
    logger.info("📧 EMAIL CONFIGURATION")
    logger.info("=" * 70)
    logger.info(f"EMAIL_DEV_MODE: {settings.EMAIL_DEV_MODE}")
    
    if settings.SENDGRID_API_KEY:
        # Show only first 10 chars of API key for security
        masked_key = settings.SENDGRID_API_KEY[:10] + "..." if len(settings.SENDGRID_API_KEY) > 10 else "***"
        logger.info(f"SENDGRID_API_KEY: {masked_key} (configured ✓)")
        
        # Validate API key format
        if not settings.SENDGRID_API_KEY.startswith("SG."):
            logger.warning("⚠️ WARNING: SENDGRID_API_KEY should start with 'SG.'")
    else:
        logger.warning("⚠️ SENDGRID_API_KEY: Not configured")
    
    if settings.SENDGRID_FROM_EMAIL:
        logger.info(f"SENDGRID_FROM_EMAIL: {settings.SENDGRID_FROM_EMAIL} (configured ✓)")
    else:
        logger.warning("⚠️ SENDGRID_FROM_EMAIL: Not configured")
    
    if settings.EMAIL_DEV_MODE:
        logger.info("🔧 Development Mode: Emails will be logged, not sent")
    else:
        logger.info("🚀 Production Mode: Emails will be sent via SendGrid")
    
    logger.info("=" * 70)

# Call on module load
log_email_config()