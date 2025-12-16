// API Configuration
// This file centralizes the API base URL for the entire frontend application
// URLs are loaded from environment variables (.env.development or .env.production)

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zenyourlife.synquic.in/api';

// Server base URL (without /api) for serving static files like images
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'https://zenyourlife.synquic.in';

// Helper function to get full image URL from backend paths
export const getImageUrl = (imagePath: string | undefined): string | null => {
  if (!imagePath) return null;

  // Replace localhost URLs with production server
  if (imagePath.includes('localhost:5000')) {
    return imagePath.replace('http://localhost:5000', SERVER_BASE_URL);
  }

  // If already a full URL (not localhost), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // If relative path, prepend server base URL
  if (imagePath.startsWith('/')) {
    return `${SERVER_BASE_URL}${imagePath}`;
  }
  // For paths without leading slash
  return `${SERVER_BASE_URL}/${imagePath}`;
};

