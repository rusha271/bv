/**
 * Utility functions for controlling the page loader
 */

// Manual loader control functions for testing and specific use cases
export const loaderUtils = {
  /**
   * Show the loader manually
   */
  show: () => {
    window.dispatchEvent(new CustomEvent('manualLoaderControl', { 
      detail: { action: 'show' } 
    }));
  },

  /**
   * Hide the loader manually
   */
  hide: () => {
    window.dispatchEvent(new CustomEvent('manualLoaderControl', { 
      detail: { action: 'hide' } 
    }));
  },

  /**
   * Simulate a loading state for a specific duration
   */
  simulateLoading: (duration: number = 2000) => {
    loaderUtils.show();
    setTimeout(() => {
      loaderUtils.hide();
    }, duration);
  }
};

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).loaderUtils = loaderUtils;
}
