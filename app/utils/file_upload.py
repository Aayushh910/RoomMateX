import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from typing import List
import shutil

# Allowed image extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGES = 5

# Upload directory
UPLOAD_DIR = Path("uploads/properties")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class FileUploadService:
    """Service for handling file uploads."""
    
    @staticmethod
    def validate_image(file: UploadFile) -> None:
        """Validate image file."""
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Check file size (if available)
        if hasattr(file.file, 'seek'):
            file.file.seek(0, 2)  # Seek to end
            file_size = file.file.tell()
            file.file.seek(0)  # Reset to beginning
            
            if file_size > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024)}MB"
                )
    
    @staticmethod
    async def save_image(file: UploadFile) -> str:
        """
        Save uploaded image and return the file path.
        
        Args:
            file: UploadFile object
            
        Returns:
            str: Relative path to saved file
        """
        # Validate file
        FileUploadService.validate_image(file)
        
        # Generate unique filename
        file_ext = Path(file.filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        # Return relative path
        return f"/uploads/properties/{unique_filename}"
    
    @staticmethod
    async def save_multiple_images(files: List[UploadFile]) -> List[str]:
        """
        Save multiple images and return list of file paths.
        
        Args:
            files: List of UploadFile objects
            
        Returns:
            List[str]: List of relative paths to saved files
        """
        if len(files) > MAX_IMAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {MAX_IMAGES} images allowed"
            )
        
        saved_paths = []
        for file in files:
            if file.filename:  # Skip empty files
                path = await FileUploadService.save_image(file)
                saved_paths.append(path)
        
        return saved_paths
    
    @staticmethod
    def delete_image(image_url: str) -> None:
        """Delete image file from disk."""
        try:
            # Convert URL to file path
            file_path = Path(image_url.lstrip('/'))
            if file_path.exists():
                file_path.unlink()
        except Exception as e:
            # Log error but don't raise exception
            print(f"Failed to delete file {image_url}: {e}")
    
    @staticmethod
    def delete_multiple_images(image_urls: List[str]) -> None:
        """Delete multiple image files."""
        for url in image_urls:
            FileUploadService.delete_image(url)
