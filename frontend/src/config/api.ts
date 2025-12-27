// API Configuration
// This file centralizes the API base URL for the entire frontend application
// URLs are loaded from environment variables (.env.development or .env.production)

// Production API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zenyourlife.be/api';

// Production Server URL (without /api) for serving static files like images
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'https://zenyourlife.be';

// Helper function to get full image URL from backend paths
export const getImageUrl = (imagePath: string | undefined): string | null => {
  if (!imagePath) return null;

  // Always convert localhost URLs to production server (for migration/legacy data)
  let processedPath = imagePath;
  if (imagePath.includes('localhost')) {
    processedPath = imagePath
      .replace('http://localhost:5000', SERVER_BASE_URL)
      .replace('http://localhost:3000', SERVER_BASE_URL)
      .replace('localhost:5000', SERVER_BASE_URL)
      .replace('localhost:3000', SERVER_BASE_URL);
  }

  // If already a full production URL, return as-is
  if (processedPath.startsWith('https://zenyourlife.be')) {
    return processedPath;
  }

  // If it's any other full URL, return as-is
  if (processedPath.startsWith('http://') || processedPath.startsWith('https://')) {
    return processedPath;
  }

  // If relative path starting with /, prepend server base URL
  if (processedPath.startsWith('/')) {
    return `${SERVER_BASE_URL}${processedPath}`;
  }

  // For paths without leading slash
  return `${SERVER_BASE_URL}/${processedPath}`;
};

