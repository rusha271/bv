/**
 * Lazy Loading Utility
 * 
 * Provides utilities for lazy loading images and videos to improve performance
 * and reduce initial load time.
 */

export interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  fallback?: string;
}

export interface LazyImageOptions extends LazyLoadOptions {
  placeholder?: string;
  errorImage?: string;
  onLoad?: (img: HTMLImageElement) => void;
  onError?: (img: HTMLImageElement) => void;
}

export interface LazyVideoOptions extends LazyLoadOptions {
  poster?: string;
  preload?: 'none' | 'metadata' | 'auto';
  onLoad?: (video: HTMLVideoElement) => void;
  onError?: (video: HTMLVideoElement) => void;
}

class LazyLoadingManager {
  private imageObserver: IntersectionObserver | null = null;
  private videoObserver: IntersectionObserver | null = null;
  private defaultOptions: LazyLoadOptions = {
    rootMargin: '50px',
    threshold: 0.1
  };

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    // Image observer
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImage(img);
          this.imageObserver?.unobserve(img);
        }
      });
    }, this.defaultOptions);

    // Video observer
    this.videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;
          this.loadVideo(video);
          this.videoObserver?.unobserve(video);
        }
      });
    }, this.defaultOptions);
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    const placeholder = img.dataset.placeholder;
    const errorImage = img.dataset.errorImage;
    const onLoad = img.dataset.onLoad;
    const onError = img.dataset.onError;

    if (!src) return;

    // Show placeholder while loading
    if (placeholder && img.src !== placeholder) {
      img.src = placeholder;
    }

    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      
      if (onLoad) {
        try {
          const callback = window[onLoad as any];
          if (typeof callback === 'function') {
            callback(img);
          }
        } catch (error) {
          console.warn('Error calling onLoad callback:', error);
        }
      }
    };

    tempImg.onerror = () => {
      if (errorImage) {
        img.src = errorImage;
      }
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      
      if (onError) {
        try {
          const callback = window[onError as any];
          if (typeof callback === 'function') {
            callback(img);
          }
        } catch (error) {
          console.warn('Error calling onError callback:', error);
        }
      }
    };

    tempImg.src = src;
  }

  private loadVideo(video: HTMLVideoElement): void {
    const src = video.dataset.src;
    const poster = video.dataset.poster;
    const preload = video.dataset.preload || 'metadata';

    if (!src) return;

    // Set poster if provided
    if (poster) {
      video.poster = poster;
    }

    // Set preload attribute
    video.preload = preload as 'none' | 'metadata' | 'auto';

    // Load video source
    const source = video.querySelector('source');
    if (source) {
      source.src = src;
    } else {
      video.src = src;
    }

    video.classList.remove('lazy-loading');
    video.classList.add('lazy-loaded');

    // Load the video
    video.load();
  }

  /**
   * Observe an image for lazy loading
   */
  observeImage(img: HTMLImageElement, options: LazyImageOptions = {}): void {
    if (!this.imageObserver) {
      // Fallback: load immediately if IntersectionObserver is not supported
      this.loadImage(img);
      return;
    }

    const {
      placeholder,
      errorImage,
      onLoad,
      onError,
      ...observerOptions
    } = options;

    // Set up data attributes
    if (placeholder) img.dataset.placeholder = placeholder;
    if (errorImage) img.dataset.errorImage = errorImage;
    if (onLoad) img.dataset.onLoad = 'onLoad';
    if (onError) img.dataset.onError = 'onError';

    // Set initial placeholder
    if (placeholder) {
      img.src = placeholder;
    }

    img.classList.add('lazy-loading');

    // Store callbacks globally for access in observer
    if (onLoad) {
      (window as any).onLoad = onLoad;
    }
    if (onError) {
      (window as any).onError = onError;
    }

    this.imageObserver.observe(img);
  }

  /**
   * Observe a video for lazy loading
   */
  observeVideo(video: HTMLVideoElement, options: LazyVideoOptions = {}): void {
    if (!this.videoObserver) {
      // Fallback: load immediately if IntersectionObserver is not supported
      this.loadVideo(video);
      return;
    }

    const {
      poster,
      preload,
      onLoad,
      onError,
      ...observerOptions
    } = options;

    // Set up data attributes
    if (poster) video.dataset.poster = poster;
    if (preload) video.dataset.preload = preload;
    if (onLoad) video.dataset.onLoad = 'onLoad';
    if (onError) video.dataset.onError = 'onError';

    video.classList.add('lazy-loading');

    // Store callbacks globally for access in observer
    if (onLoad) {
      (window as any).onLoad = onLoad;
    }
    if (onError) {
      (window as any).onError = onError;
    }

    this.videoObserver.observe(video);
  }

  /**
   * Unobserve an element
   */
  unobserve(element: Element): void {
    this.imageObserver?.unobserve(element);
    this.videoObserver?.unobserve(element);
  }

  /**
   * Disconnect observers
   */
  disconnect(): void {
    this.imageObserver?.disconnect();
    this.videoObserver?.disconnect();
  }

  /**
   * Update observer options
   */
  updateOptions(options: Partial<LazyLoadOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
    
    // Recreate observers with new options
    this.disconnect();
    this.initializeObservers();
  }
}

// Create singleton instance
export const lazyLoading = new LazyLoadingManager();

// React hook for lazy loading images (requires React import in component)
export const useLazyImage = (src: string, options: LazyImageOptions = {}) => {
  const imgRef = { current: null as HTMLImageElement | null };

  const observe = () => {
    if (imgRef.current) {
      imgRef.current.dataset.src = src;
      lazyLoading.observeImage(imgRef.current, options);
    }
  };

  const unobserve = () => {
    if (imgRef.current) {
      lazyLoading.unobserve(imgRef.current);
    }
  };

  return { imgRef, observe, unobserve };
};

// React hook for lazy loading videos (requires React import in component)
export const useLazyVideo = (src: string, options: LazyVideoOptions = {}) => {
  const videoRef = { current: null as HTMLVideoElement | null };

  const observe = () => {
    if (videoRef.current) {
      videoRef.current.dataset.src = src;
      lazyLoading.observeVideo(videoRef.current, options);
    }
  };

  const unobserve = () => {
    if (videoRef.current) {
      lazyLoading.unobserve(videoRef.current);
    }
  };

  return { videoRef, observe, unobserve };
};

export default lazyLoading;
