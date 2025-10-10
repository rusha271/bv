/**
 * Utility functions for handling social sharing and Web Share API
 */

export interface ShareData {
  title: string;
  text?: string;
  url: string;
  image?: string;
  hashtags?: string[];
}

export interface SocialShareData {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'telegram' | 'email';
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
}

export interface ShareResult {
  success: boolean;
  method: 'web-share' | 'clipboard' | 'social' | 'error';
  message: string;
  platform?: string;
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
export async function shareContent(shareData: ShareData): Promise<ShareResult> {
  try {
    if (isWebShareSupported()) {
      // Use Web Share API with production URL
      const shareUrl = getShareUrl(shareData.url);
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        url: shareUrl,
      });
      
      // Track share event
      trackShareEvent('web-share', shareData.title);
      
      return {
        success: true,
        method: 'web-share',
        message: 'Content shared successfully!',
      };
    } else {
      // Fallback: copy URL to clipboard
      const shareUrl = getShareUrl(shareData.url);
      await navigator.clipboard.writeText(shareUrl);
      
      // Track share event
      trackShareEvent('clipboard', shareData.title);
      
      return {
        success: true,
        method: 'clipboard',
        message: 'URL copied to clipboard!',
      };
    }
  } catch (error) {
    console.error('Error sharing content:', error);
    
    // Final fallback: try to copy to clipboard
    try {
      const shareUrl = getShareUrl(shareData.url);
      await navigator.clipboard.writeText(shareUrl);
      
      return {
        success: true,
        method: 'clipboard',
        message: 'URL copied to clipboard!',
      };
    } catch (clipboardError) {
      console.error('Error copying to clipboard:', clipboardError);
      
      return {
        success: false,
        method: 'error',
        message: 'Failed to share content. Please try again.',
      };
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
  postId: string,
  description?: string
): ShareData {
  return generatePageShareData(title, description, `/blog/${postId}`);
}

/**
 * Generate share data for a video
 */
export function generateVideoShareData(
  title: string,
  videoId: string,
  description?: string
): ShareData {
  return generatePageShareData(title, description, `/video/${videoId}`);
}

/**
 * Share to specific social media platform
 */
export async function shareToSocial(socialData: SocialShareData): Promise<ShareResult> {
  try {
    const shareUrl = getShareUrl(socialData.url);
    let platformUrl = '';
    
    switch (socialData.platform) {
      case 'facebook':
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        const twitterText = `${socialData.title}${socialData.hashtags ? ' ' + socialData.hashtags.map(tag => `#${tag}`).join(' ') : ''}`;
        platformUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        platformUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        const whatsappText = `${socialData.title}${socialData.description ? '\n\n' + socialData.description : ''}\n\n${shareUrl}`;
        platformUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
        break;
      case 'telegram':
        const telegramText = `${socialData.title}${socialData.description ? '\n\n' + socialData.description : ''}\n\n${shareUrl}`;
        platformUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(telegramText)}`;
        break;
      case 'email':
        const emailSubject = socialData.title;
        const emailBody = `${socialData.description || ''}\n\n${shareUrl}`;
        platformUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        break;
      default:
        throw new Error(`Unsupported platform: ${socialData.platform}`);
    }
    
    // Open in new window/tab
    window.open(platformUrl, '_blank', 'width=600,height=400');
    
    // Track share event
    trackShareEvent('social', socialData.title, socialData.platform);
    
    return {
      success: true,
      method: 'social',
      message: `Shared to ${socialData.platform}!`,
      platform: socialData.platform,
    };
  } catch (error) {
    console.error('Error sharing to social media:', error);
    
    return {
      success: false,
      method: 'error',
      message: `Failed to share to ${socialData.platform}. Please try again.`,
      platform: socialData.platform,
    };
  }
}

/**
 * Track share events for analytics
 */
export function trackShareEvent(method: string, title: string, platform?: string) {
  try {
    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: method,
        content_type: 'page',
        item_id: title,
        platform: platform,
      });
    }
    
    // Simple local tracking
    if (typeof window !== 'undefined') {
      const shareData = {
        method,
        title,
        platform,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };
      
      // Store in localStorage for basic tracking
      const existingShares = JSON.parse(localStorage.getItem('share_analytics') || '[]');
      existingShares.push(shareData);
      
      // Keep only last 50 shares
      if (existingShares.length > 50) {
        existingShares.splice(0, existingShares.length - 50);
      }
      
      localStorage.setItem('share_analytics', JSON.stringify(existingShares));
    }
  } catch (error) {
    console.error('Error tracking share event:', error);
  }
}

/**
 * Get share analytics data
 */
export function getShareAnalytics(): any[] {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('share_analytics') || '[]');
    }
    return [];
  } catch (error) {
    console.error('Error getting share analytics:', error);
    return [];
  }
}

/**
 * Show toast notification
 */
export function showShareToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  try {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    toast.textContent = message;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  } catch (error) {
    console.error('Error showing toast:', error);
  }
}
