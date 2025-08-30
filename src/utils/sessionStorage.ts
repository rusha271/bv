// Session storage keys
const SESSION_KEYS = {
  FLOOR_PLAN_DATA: 'floor_plan_data',
  CROPPED_IMAGE: 'cropped_image',
  ANALYSIS_ID: 'analysis_id',
  CROP_DATA: 'crop_data',
  SESSION_ID: 'session_id'
} as const;

// Types for session data
export interface FloorPlanSessionData {
  sessionId: string;
  originalImage: {
    blobUrl: string;
    file: File;
    analysisId: string;
  };
  croppedImage?: {
    blobUrl: string;
    cropData: any;
  };
  metadata: {
    uploadedAt: string;
    lastModified: string;
    expiresAt: string; // New field for expiration tracking
  };
}

// Session storage utility class
class SessionStorageManager {
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize or get existing session
  getOrCreateSession(): FloorPlanSessionData | null {
    if (typeof window === 'undefined') return null;
    
    const existingData = sessionStorage.getItem(SESSION_KEYS.FLOOR_PLAN_DATA);
    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        
        // Check if session has expired
        if (this.isSessionExpired(parsedData)) {
          this.clearSession();
          return null;
        }
        
        return parsedData;
      } catch {
        // Invalid data, clear and return null
        this.clearSession();
        return null;
      }
    }
    
    return null;
  }

  // Store original floor plan data with 1-hour expiration
  storeOriginalFloorPlan(file: File, analysisId: string, blobUrl: string): FloorPlanSessionData {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    
    const sessionData: FloorPlanSessionData = {
      sessionId: this.generateSessionId(),
      originalImage: {
        blobUrl,
        file,
        analysisId
      },
      metadata: {
        uploadedAt: now.toISOString(),
        lastModified: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      }
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEYS.FLOOR_PLAN_DATA, JSON.stringify(sessionData));
    }

    return sessionData;
  }

  // Store cropped image data
  storeCroppedImage(blobUrl: string, cropData: any): void {
    if (typeof window === 'undefined') return;

    const sessionData = this.getOrCreateSession();
    if (sessionData) {
      sessionData.croppedImage = {
        blobUrl,
        cropData
      };
      sessionData.metadata.lastModified = new Date().toISOString();
      
      sessionStorage.setItem(SESSION_KEYS.FLOOR_PLAN_DATA, JSON.stringify(sessionData));
    }
  }

  // Get current session data
  getSessionData(): FloorPlanSessionData | null {
    return this.getOrCreateSession();
  }

  // Get original image data
  getOriginalImage(): { blobUrl: string; file: File; analysisId: string } | null {
    const sessionData = this.getSessionData();
    return sessionData?.originalImage || null;
  }

  // Get cropped image data
  getCroppedImage(): { blobUrl: string; cropData: any } | null {
    const sessionData = this.getSessionData();
    return sessionData?.croppedImage || null;
  }

  // Check if session exists
  hasSession(): boolean {
    return this.getSessionData() !== null;
  }

  // Clear session data
  clearSession(): void {
    if (typeof window === 'undefined') return;
    
    // Revoke blob URLs to free memory
    const sessionData = this.getSessionData();
    if (sessionData) {
      if (sessionData.originalImage?.blobUrl) {
        URL.revokeObjectURL(sessionData.originalImage.blobUrl);
      }
      if (sessionData.croppedImage?.blobUrl) {
        URL.revokeObjectURL(sessionData.croppedImage.blobUrl);
      }
    }
    
    sessionStorage.removeItem(SESSION_KEYS.FLOOR_PLAN_DATA);
  }

  // Update session metadata
  updateLastModified(): void {
    const sessionData = this.getSessionData();
    if (sessionData) {
      sessionData.metadata.lastModified = new Date().toISOString();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_KEYS.FLOOR_PLAN_DATA, JSON.stringify(sessionData));
      }
    }
  }

  // Get session age in minutes
  getSessionAge(): number {
    const sessionData = this.getSessionData();
    if (!sessionData) return 0;
    
    const uploadedAt = new Date(sessionData.metadata.uploadedAt);
    const now = new Date();
    return Math.floor((now.getTime() - uploadedAt.getTime()) / (1000 * 60));
  }

  // Check if session is expired (1 hour = 60 minutes)
  isSessionExpired(sessionData?: FloorPlanSessionData): boolean {
    const data = sessionData || this.getSessionData();
    if (!data) return true;
    
    const expiresAt = new Date(data.metadata.expiresAt);
    const now = new Date();
    return now.getTime() > expiresAt.getTime();
  }

  // Get time remaining until expiration in minutes
  getTimeRemaining(): number {
    const sessionData = this.getSessionData();
    if (!sessionData) return 0;
    
    const expiresAt = new Date(sessionData.metadata.expiresAt);
    const now = new Date();
    const remainingMs = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(remainingMs / (1000 * 60)));
  }

  // Clean up expired sessions
  cleanupExpiredSessions(): void {
    if (this.isSessionExpired()) {
      this.clearSession();
    }
  }

  // Extend session expiration by 1 hour
  extendSession(): boolean {
    const sessionData = this.getSessionData();
    if (!sessionData) return false;
    
    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    
    sessionData.metadata.lastModified = now.toISOString();
    sessionData.metadata.expiresAt = newExpiresAt.toISOString();
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEYS.FLOOR_PLAN_DATA, JSON.stringify(sessionData));
    }
    
    return true;
  }
}

// Export singleton instance
export const sessionStorageManager = new SessionStorageManager();

// Export keys
export { SESSION_KEYS };
