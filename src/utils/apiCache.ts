/**
 * API Caching Utility
 * 
 * Provides intelligent caching for API calls to reduce server load and improve performance.
 * Supports different cache strategies and automatic expiration.
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of cached items
  strategy?: 'memory' | 'session' | 'local'; // Cache storage strategy
  keyGenerator?: (url: string, params?: any) => string; // Custom key generator
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class APICacheManager {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private stats: { hits: number; misses: number } = { hits: 0, misses: 0 };
  private defaultOptions: CacheOptions = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    strategy: 'memory'
  };

  /**
   * Generate cache key from URL and parameters
   */
  private generateKey(url: string, params?: any, keyGenerator?: (url: string, params?: any) => string): string {
    if (keyGenerator) {
      return keyGenerator(url, params);
    }

    const baseKey = url;
    if (params) {
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${JSON.stringify(params[key])}`)
        .join('&');
      return `${baseKey}?${sortedParams}`;
    }
    return baseKey;
  }

  /**
   * Check if cache entry is valid
   */
  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Clean expired entries
   */
  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Enforce max size limit
   */
  private enforceMaxSize(maxSize: number): void {
    if (this.memoryCache.size > maxSize) {
      const entries = Array.from(this.memoryCache.entries());
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest entries
      const toRemove = entries.slice(0, this.memoryCache.size - maxSize);
      toRemove.forEach(([key]) => this.memoryCache.delete(key));
    }
  }

  /**
   * Get cached data
   */
  get<T>(url: string, params?: any, options: CacheOptions = {}): T | null {
    const opts = { ...this.defaultOptions, ...options };
    const key = this.generateKey(url, params, opts.keyGenerator);

    // Clean expired entries periodically
    if (Math.random() < 0.1) { // 10% chance
      this.cleanExpired();
    }

    const entry = this.memoryCache.get(key);
    if (entry && this.isValid(entry)) {
      this.stats.hits++;
      return entry.data as T;
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Set cached data
   */
  set<T>(url: string, data: T, params?: any, options: CacheOptions = {}): void {
    const opts = { ...this.defaultOptions, ...options };
    const key = this.generateKey(url, params, opts.keyGenerator);

    // Enforce max size
    if (opts.maxSize) {
      this.enforceMaxSize(opts.maxSize);
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: opts.ttl || this.defaultOptions.ttl!,
      key
    };

    this.memoryCache.set(key, entry);
  }

  /**
   * Delete cached data
   */
  delete(url: string, params?: any, options: CacheOptions = {}): boolean {
    const opts = { ...this.defaultOptions, ...options };
    const key = this.generateKey(url, params, opts.keyGenerator);
    return this.memoryCache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.memoryCache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.memoryCache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0
    };
  }

  /**
   * Check if data exists in cache
   */
  has(url: string, params?: any, options: CacheOptions = {}): boolean {
    const opts = { ...this.defaultOptions, ...options };
    const key = this.generateKey(url, params, opts.keyGenerator);
    const entry = this.memoryCache.get(key);
    return entry ? this.isValid(entry) : false;
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.memoryCache.size;
  }

  /**
   * Update default options
   */
  updateOptions(options: Partial<CacheOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}

// Create singleton instance
export const apiCache = new APICacheManager();

/**
 * Cached API call wrapper
 */
export async function cachedApiCall<T>(
  apiCall: () => Promise<T>,
  url: string,
  params?: any,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cached = apiCache.get<T>(url, params, options);
  if (cached !== null) {
    return cached;
  }

  // Make API call
  const data = await apiCall();
  
  // Cache the result
  apiCache.set(url, data, params, options);
  
  return data;
}

/**
 * React hook for cached API calls (requires React import in component)
 */
export function useCachedApi<T>(
  apiCall: () => Promise<T>,
  url: string,
  params?: any,
  options: CacheOptions = {}
) {
  // This would need to be implemented in the component that uses it
  // with proper React imports
  return {
    data: null as T | null,
    loading: true,
    error: null as string | null,
    refetch: async () => {
      try {
        return await cachedApiCall(apiCall, url, params, options);
      } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch data');
      }
    }
  };
}

export default apiCache;
