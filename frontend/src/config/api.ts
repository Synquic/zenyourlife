// API Configuration
// This file centralizes the API base URL for the entire frontend application
// URLs are loaded from environment variables (.env.development or .env.production)

// Production API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zenyourlife.be/api';

// Production Server URL (without /api) for serving static files like images
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'https://zenyourlife.be';

// Helper function to get full image URL from backend paths
// Includes cache-busting to prevent browsers from showing stale cached images
export const getImageUrl = (imagePath: string | undefined, cacheBust?: string | number): string | null => {
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

  let url: string;

  // If already a full production URL, use as-is
  if (processedPath.startsWith('https://zenyourlife.be')) {
    url = processedPath;
  } else if (processedPath.startsWith('http://') || processedPath.startsWith('https://')) {
    // If it's any other full URL, use as-is
    url = processedPath;
  } else if (processedPath.startsWith('/')) {
    // If relative path starting with /, prepend server base URL
    url = `${SERVER_BASE_URL}${processedPath}`;
  } else {
    // For paths without leading slash
    url = `${SERVER_BASE_URL}/${processedPath}`;
  }

  // Add cache-busting query param for uploaded images
  if (url.includes('/uploads/')) {
    const v = cacheBust || Date.now();
    url += `?v=${v}`;
  }

  return url;
};

