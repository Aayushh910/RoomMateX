from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Get the root directory (parent of backend folder)
# This file is at: backend/app/core/config.py
# Root is 3 levels up: backend/app/core -> backend/app -> backend -> root
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent

# Load .env file explicitly
from dotenv import load_dotenv
env_path = ROOT_DIR / ".env"
load_dotenv(dotenv_path=env_path)


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    
    # Email configuration
    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587
    EMAIL_USERNAME: str = "roommatex0help@gmail.com"
    EMAIL_PASSWORD: str = "pwvxuefsxlnqrgpd"
    EMAIL_FROM: str = "RoomMateX <roommatex0help@gmail.com>"
    EMAIL_DEV_MODE: bool = False  # Set to False to actually send emails
    
    # Admin credentials (NOT stored in database)
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    
    class Config:
        env_file = str(env_path)
        env_file_encoding = 'utf-8'
        case_sensitive = True


settings = Settings()
