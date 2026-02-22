const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Get full image URL from relative path
 * @param {string} imagePath - Relative image path from backend (e.g., "/uploads/properties/image.jpg")
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }
  
  // If already a full URL (starts with http), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the API base URL
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${path}`;
};

/**
 * Get thumbnail URL (first image) from property
 * @param {object} property - Property object with images array
 * @returns {string} - Full thumbnail URL
 */
export const getThumbnailUrl = (property) => {
  if (property?.images && property.images.length > 0) {
    return getImageUrl(property.images[0]);
  }
  if (property?.thumbnail_image) {
    return getImageUrl(property.thumbnail_image);
  }
  return 'https://via.placeholder.com/400x300?text=No+Image';
};
