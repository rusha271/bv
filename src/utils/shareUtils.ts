/**
 * Utility functions for handling social sharing and Web Share API
 */

export interface ShareData {
  title: string;
  text?: string;
  url: string;
}

/**
 * Get the correct site URL based on environment
 */
export function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin but replace localhost with production URL if needed
    const currentUrl = window.location.origin;
    if (currentUrl.includes('localhost:3000')) {
      return 'https://bharmaspace.com';
    }
    return currentUrl;
  }
  
  // Server-side: use environment variable
  return process.env.NODE_ENV === 'production' 
    ? 'https://bharmaspace.com' 
    : 'http://localhost:3000';
}

/**
 * Get the correct URL for sharing (always use production URL for sharing)
 */
export function getShareUrl(path: string = ''): string {
  const baseUrl = 'https://bharmaspace.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Share content using Web Share API or fallback to copying URL
 */
export async function shareContent(shareData: ShareData): Promise<boolean> {
  try {
    if (isWebShareSupported()) {
      // Use Web Share API with production URL
      const shareUrl = getShareUrl(shareData.url);
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        url: shareUrl,
      });
      return true;
    } else {
      // Fallback: copy URL to clipboard
      const shareUrl = getShareUrl(shareData.url);
      await navigator.clipboard.writeText(shareUrl);
      
      // Show a toast or notification that URL was copied
      if (typeof window !== 'undefined' && 'Notification' in window) {
        // You can integrate with your toast system here
        console.log('URL copied to clipboard:', shareUrl);
      }
      return false; // Indicates fallback was used
    }
  } catch (error) {
    console.error('Error sharing content:', error);
    
    // Final fallback: try to copy to clipboard
    try {
      const shareUrl = getShareUrl(shareData.url);
      await navigator.clipboard.writeText(shareUrl);
      return false;
    } catch (clipboardError) {
      console.error('Error copying to clipboard:', clipboardError);
      return false;
    }
  }
}

/**
 * Generate share data for a page
 */
export function generatePageShareData(
  title: string,
  description?: string,
  path: string = ''
): ShareData {
  return {
    title: `${title} | Brahma Vastu`,
    text: description || 'Check out this Vastu resource from Brahma Vastu',
    url: path,
  };
}

/**
 * Generate share data for a blog post
 */
export function generateBlogShareData(
  title: string,
  description?: string,
  postId: string
): ShareData {
  return generatePageShareData(title, description, `/blog/${postId}`);
}

/**
 * Generate share data for a video
 */
export function generateVideoShareData(
  title: string,
  description?: string,
  videoId: string
): ShareData {
  return generatePageShareData(title, description, `/video/${videoId}`);
}
