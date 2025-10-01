/**
 * Performance optimization utilities
 * Helps prevent performance violations and optimize event handlers
 */

/**
 * Debounce function to limit the rate of function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit the rate of function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Optimized event listener with passive option and debouncing
 */
export function addOptimizedEventListener(
  element: Window | Document | HTMLElement,
  event: string,
  handler: EventListener,
  options: {
    debounceMs?: number;
    throttleMs?: number;
    passive?: boolean;
  } = {}
): () => void {
  const { debounceMs, throttleMs, passive = true } = options;
  
  let optimizedHandler = handler;
  
  if (debounceMs) {
    optimizedHandler = debounce(handler, debounceMs);
  } else if (throttleMs) {
    optimizedHandler = throttle(handler, throttleMs);
  }
  
  element.addEventListener(event, optimizedHandler, { passive });
  
  return () => {
    element.removeEventListener(event, optimizedHandler);
  };
}

/**
 * Batch DOM updates using requestAnimationFrame
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Use requestIdleCallback for non-critical operations
 */
export function scheduleIdleCallback(callback: () => void, fallbackDelay = 0): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, fallbackDelay);
  }
}

/**
 * Optimized resize handler with debouncing
 */
export function createOptimizedResizeHandler(
  handler: () => void,
  debounceMs = 100
): () => void {
  return debounce(handler, debounceMs);
}

/**
 * Prevent forced reflow by batching style reads and writes
 */
export function batchStyleUpdates(
  readOperations: (() => void)[],
  writeOperations: (() => void)[]
): void {
  // Batch all read operations first
  readOperations.forEach(op => op());
  
  // Then batch all write operations
  requestAnimationFrame(() => {
    writeOperations.forEach(op => op());
  });
}

/**
 * Memory-efficient event listener cleanup
 */
export class EventListenerManager {
  private listeners: Array<{
    element: Window | Document | HTMLElement;
    event: string;
    handler: EventListener;
    cleanup: () => void;
  }> = [];

  addListener(
    element: Window | Document | HTMLElement,
    event: string,
    handler: EventListener,
    options: {
      debounceMs?: number;
      throttleMs?: number;
      passive?: boolean;
    } = {}
  ): void {
    const cleanup = addOptimizedEventListener(element, event, handler, options);
    
    this.listeners.push({
      element,
      event,
      handler,
      cleanup
    });
  }

  removeAllListeners(): void {
    this.listeners.forEach(({ cleanup }) => cleanup());
    this.listeners = [];
  }

  removeListener(
    element: Window | Document | HTMLElement,
    event: string,
    handler: EventListener
  ): void {
    const index = this.listeners.findIndex(
      listener => 
        listener.element === element && 
        listener.event === event && 
        listener.handler === handler
    );
    
    if (index !== -1) {
      this.listeners[index].cleanup();
      this.listeners.splice(index, 1);
    }
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private violations: Array<{
    type: string;
    duration: number;
    timestamp: number;
  }> = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  logViolation(type: string, duration: number): void {
    this.violations.push({
      type,
      duration,
      timestamp: Date.now()
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Performance violation: ${type} took ${duration}ms`);
    }
  }

  getViolations(): typeof this.violations {
    return [...this.violations];
  }

  clearViolations(): void {
    this.violations = [];
  }
}
