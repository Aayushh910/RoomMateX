import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from typing import List, Optional
import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Allowed image extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGES = 5

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


class FileUploadService:
    """Service for handling file uploads with Cloudinary ONLY."""
    
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
    async def save_image(file: UploadFile, folder: str = "properties") -> str:
        """
        Save uploaded image to Cloudinary.
        
        Args:
            file: UploadFile object
            folder: Folder name for organizing images (properties, profiles, etc.)
            
        Returns:
            str: Cloudinary secure URL
        """
        # Validate file
        FileUploadService.validate_image(file)
        
        try:
            # Read file content
            file_content = await file.read()
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file_content,
                folder=f"roomatex/{folder}",
                resource_type="image",
                transformation=[
                    {'quality': 'auto', 'fetch_format': 'auto'}
                ]
            )
            
            # Reset file pointer for potential reuse
            await file.seek(0)
            
            return result['secure_url']
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload to Cloudinary: {str(e)}"
            )
    
    @staticmethod
    async def save_multiple_images(files: List[UploadFile], folder: str = "properties") -> List[str]:
        """
        Save multiple images to Cloudinary.
        
        Args:
            files: List of UploadFile objects
            folder: Folder name for organizing images
            
        Returns:
            List[str]: List of Cloudinary URLs
        """
        if len(files) > MAX_IMAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {MAX_IMAGES} images allowed"
            )
        
        saved_paths = []
        for file in files:
            if file.filename:  # Skip empty files
                path = await FileUploadService.save_image(file, folder)
                saved_paths.append(path)
        
        return saved_paths
    
    @staticmethod
    def delete_image(image_url: str) -> None:
        """Delete image from Cloudinary."""
        try:
            if not image_url or not image_url.startswith('http'):
                return
                
            # Extract public_id from Cloudinary URL
            # URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            parts = image_url.split('/')
            
            # Find the upload index
            upload_index = -1
            for i, part in enumerate(parts):
                if part == 'upload':
                    upload_index = i
                    break
            
            if upload_index == -1:
                print(f"Could not find 'upload' in URL: {image_url}")
                return
            
            # Get everything after upload/ (skip version if present)
            remaining_parts = parts[upload_index + 1:]
            
            # Skip version number if it starts with 'v' followed by digits
            if remaining_parts and remaining_parts[0].startswith('v') and remaining_parts[0][1:].isdigit():
                remaining_parts = remaining_parts[1:]
            
            if not remaining_parts:
                print(f"No public_id found in URL: {image_url}")
                return
            
            # Join remaining parts and remove file extension
            public_id = '/'.join(remaining_parts)
            if '.' in public_id:
                public_id = public_id.rsplit('.', 1)[0]
            
            print(f"Deleting Cloudinary image with public_id: {public_id}")
            
            # Delete from Cloudinary
            result = cloudinary.uploader.destroy(public_id)
            print(f"Cloudinary delete result: {result}")
            
        except Exception as e:
            # Log error but don't raise exception to avoid breaking the main operation
            print(f"Failed to delete image {image_url}: {e}")
            import traceback
            traceback.print_exc()
    
    @staticmethod
    def delete_multiple_images(image_urls: List[str]) -> None:
        """Delete multiple image files from Cloudinary."""
        for url in image_urls:
            FileUploadService.delete_image(url)
