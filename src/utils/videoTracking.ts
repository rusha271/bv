/**
 * Video View Tracking Utility
 * 
 * Implements smart video view tracking with the following logic:
 * - Videos < 15 seconds: Count view if user watches at least 90%
 * - Videos >= 15 seconds: Count view if user watches at least 30 seconds or 50% (whichever comes first)
 * - Logs view events locally for debugging and analytics
 * - Prevents duplicate view counts per session
 */

export interface VideoTrackingData {
  videoId: number;
  watchTime: number;
  duration: number;
  percentage: number;
  timestamp: number;
  sessionId: string;
}

export interface VideoViewEvent {
  videoId: number;
  watchTime: number;
  duration: number;
  percentage: number;
  timestamp: number;
  sessionId: string;
  userAgent: string;
  referrer: string;
}

class VideoTrackingManager {
  private sessionId: string;
  private trackedVideos: Set<number> = new Set();
  private videoTimers: Map<number, { startTime: number; watchTime: number; duration: number }> = new Map();
  private isTrackingEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadTrackedVideos();
    this.setupBeforeUnloadHandler();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadTrackedVideos(): void {
    try {
      const stored = sessionStorage.getItem('video_tracking_session');
      if (stored) {
        const data = JSON.parse(stored);
        this.sessionId = data.sessionId;
        this.trackedVideos = new Set(data.trackedVideos || []);
      }
    } catch (error) {
      // console.warn('Failed to load video tracking session:', error);
    }
  }

  private saveTrackedVideos(): void {
    try {
      const data = {
        sessionId: this.sessionId,
        trackedVideos: Array.from(this.trackedVideos),
        timestamp: Date.now()
      };
      sessionStorage.setItem('video_tracking_session', JSON.stringify(data));
    } catch (error) {
      //  console.warn('Failed to save video tracking session:', error);
    }
  }

  private setupBeforeUnloadHandler(): void {
    if (typeof window !== 'undefined') {
      // Use passive listeners to prevent blocking
      window.addEventListener('beforeunload', () => {
        // Use requestIdleCallback if available, otherwise use setTimeout
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => this.flushPendingViews());
        } else {
          setTimeout(() => this.flushPendingViews(), 0);
        }
      }, { passive: true });

      // Also handle page visibility change - optimized
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // Use requestIdleCallback for non-critical operations
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.flushPendingViews());
          } else {
            setTimeout(() => this.flushPendingViews(), 0);
          }
        }
      }, { passive: true });
    }
  }

  /**
   * Start tracking a video
   */
  startTracking(videoId: number, duration: number): void {
    if (!this.isTrackingEnabled || this.trackedVideos.has(videoId)) {
      return;
    }

    this.videoTimers.set(videoId, {
      startTime: Date.now(),
      watchTime: 0,
      duration: duration
    });
  }

  /**
   * Update watch time for a video
   */
  updateWatchTime(videoId: number, currentTime: number): void {
    const timer = this.videoTimers.get(videoId);
    if (!timer) return;

    timer.watchTime = currentTime;
  }

  /**
   * Check if a view should be counted based on watch time and duration
   */
  private shouldCountView(watchTime: number, duration: number): boolean {
    const percentage = (watchTime / duration) * 100;

    if (duration < 15) {
      // For videos < 15 seconds, count view if user watches at least 90%
      return percentage >= 90;
    } else {
      // For videos >= 15 seconds, count view if user watches at least 30 seconds or 50%
      return watchTime >= 30 || percentage >= 50;
    }
  }

  /**
   * Record a video view (only for tour videos)
   */
  recordView(videoId: number, watchTime: number, duration: number, category?: string): void {
    if (!this.isTrackingEnabled || this.trackedVideos.has(videoId)) {
      return;
    }

    // Only track tour videos as per backend API changes
    if (category && category !== 'tour') {
      // console.log(`Skipping tracking for non-tour video (category: ${category})`);
      return;
    }

    if (!this.shouldCountView(watchTime, duration)) {
      return;
    }

    this.trackedVideos.add(videoId);
    this.saveTrackedVideos();

    const viewEvent: VideoViewEvent = {
      videoId,
      watchTime,
      duration,
      percentage: (watchTime / duration) * 100,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    this.sendViewEvent(viewEvent);
  }

  /**
   * Send view event - now just logs the event locally
   */
  private sendViewEvent(event: VideoViewEvent): void {
    try {
      // Log the video view event locally instead of sending to endpoint
      // console.log('Video view tracked locally:', event);
    } catch (error) {
      // console.error('Error logging video view event:', error);
    }
  }


  /**
   * Flush any pending view events
   */
  private flushPendingViews(): void {
    // This could be extended to batch multiple pending views
    // For now, we rely on individual view tracking
  }

  /**
   * Stop tracking a video
   */
  stopTracking(videoId: number): void {
    this.videoTimers.delete(videoId);
  }

  /**
   * Check if a video has already been tracked in this session
   */
  isVideoTracked(videoId: number): boolean {
    return this.trackedVideos.has(videoId);
  }

  /**
   * Enable/disable tracking
   */
  setTrackingEnabled(enabled: boolean): void {
    this.isTrackingEnabled = enabled;
  }

  /**
   * Get tracking statistics for debugging
   */
  getTrackingStats(): { sessionId: string; trackedVideos: number[]; activeTimers: number } {
    return {
      sessionId: this.sessionId,
      trackedVideos: Array.from(this.trackedVideos),
      activeTimers: this.videoTimers.size
    };
  }
}

// Create a singleton instance
export const videoTracking = new VideoTrackingManager();

// Export utility functions
export const trackVideoView = (videoId: number, watchTime: number, duration: number, category?: string) => {
  videoTracking.recordView(videoId, watchTime, duration, category);
};

export const startVideoTracking = (videoId: number, duration: number) => {
  videoTracking.startTracking(videoId, duration);
};

export const updateVideoWatchTime = (videoId: number, currentTime: number) => {
  videoTracking.updateWatchTime(videoId, currentTime);
};

export const stopVideoTracking = (videoId: number) => {
  videoTracking.stopTracking(videoId);
};

export const isVideoTracked = (videoId: number): boolean => {
  return videoTracking.isVideoTracked(videoId);
};

export default videoTracking;
