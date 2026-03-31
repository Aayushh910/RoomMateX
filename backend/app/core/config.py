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