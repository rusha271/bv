/**
 * API Cache Utility
 * Provides caching functionality for API calls to reduce redundant requests
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  expiry: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Get cached data if it exists and is not expired
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache with TTL
   */
  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const apiCache = new ApiCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);

/**
 * Higher-order function to wrap API calls with caching
 */
export function withCache<T extends any[], R>(
  apiFunction: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttl?: number
) {
  return async (...args: T): Promise<R> => {
    const cacheKey = keyGenerator(...args);
    
    // Try to get from cache first
    const cached = apiCache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, make API call
    const result = await apiFunction(...args);
    
    // Cache the result
    apiCache.set(cacheKey, result, ttl);
    
    return result;
  };
}

/**
 * Cached API call function for Redux thunks
 * This function provides a simple interface for caching API calls
 */
export async function cachedApiCall<T>(
  apiFunction: () => Promise<T>,
  cacheKey: string,
  options?: any,
  config?: { ttl?: number }
): Promise<T> {
  const ttl = config?.ttl || 60 * 60 * 1000; // Default 1 hour
  
  // Try to get from cache first
  const cached = apiCache.get(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // If not in cache, make API call
  const result = await apiFunction();
  
  // Cache the result
  apiCache.set(cacheKey, result, ttl);
  
  return result;
}

/**
 * Session storage cache for client-side persistence
 */
export const sessionCache = {
  get(key: string): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      const now = Date.now();
      
      // Check if expired
      if (parsed.expiry && now > parsed.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return parsed.data;
    } catch {
      return null;
    }
  },

  set(key: string, data: any, ttl: number = 60 * 60 * 1000): void {
    if (typeof window === 'undefined') return;
    
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      };
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data in session storage:', error);
    }
  },

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    
    // Clear only our cache entries (those with our format)
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('api_cache_') || key.endsWith('_cache_time'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }
};

export default apiCache;