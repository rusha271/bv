/**
 * Utility functions for handling image URLs and fallbacks
 */

/**
 * Constructs a proper image URL from various input formats
 * @param imagePath - The image path (can be relative, absolute, or full URL)
 * @param baseURL - Optional base URL (defaults to API URL from env)
 * @returns Properly formatted image URL
 */
export const getImageUrl = (imagePath: string, baseURL?: string): string => {
  if (!imagePath) {
    return '';
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path starting with /, return as is (for local images)
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // For external API paths, construct full URL
  const apiBaseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'https://api.bharmaspace.com';
  return `${apiBaseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

/**
 * Validates if an image URL is accessible
 * @param url - The image URL to validate
 * @returns Promise that resolves to true if image is accessible
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Image validation failed for ${url}:`, error);
    return false;
  }
};

/**
 * Creates a fallback chain for image loading
 * @param primarySrc - Primary image source
 * @param fallbackSrc - Fallback image source
 * @returns Array of image sources to try in order
 */
export const createImageFallbackChain = (primarySrc: string, fallbackSrc: string = '/images/bv.png'): string[] => {
  const sources = [primarySrc];
  
  if (fallbackSrc && fallbackSrc !== primarySrc) {
    sources.push(fallbackSrc);
  }
  
  return sources;
};

/**
 * Handles image loading with retry logic
 * @param src - Image source URL
 * @param maxRetries - Maximum number of retries
 * @param retryDelay - Delay between retries in milliseconds
 * @returns Promise that resolves when image loads successfully
 */
export const loadImageWithRetry = (
  src: string, 
  maxRetries: number = 3, 
  retryDelay: number = 1000
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let retryCount = 0;
    
    const attemptLoad = () => {
      const img = new Image();
      
      img.onload = () => resolve(img);
      img.onerror = () => {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(attemptLoad, retryDelay * retryCount);
        } else {
          reject(new Error(`Failed to load image after ${maxRetries} attempts: ${src}`));
        }
      };
      
      img.src = src;
    };
    
    attemptLoad();
  });
};

/**
 * Preloads an image and returns a promise
 * @param src - Image source URL
 * @returns Promise that resolves when image is loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Creates a data URL for a placeholder image
 * @param width - Image width
 * @param height - Image height
 * @param color - Background color (default: light gray)
 * @returns Data URL for placeholder image
 */
export const createPlaceholderImage = (
  width: number = 100, 
  height: number = 100, 
  color: string = '#f0f0f0'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add a subtle border
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
};