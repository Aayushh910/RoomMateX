// Centralized API configuration used across the frontend.
// This ensures we can point the application to different backends via Vite env variables.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  // If already an absolute URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
