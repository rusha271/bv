import { useState, useEffect, useCallback } from 'react';
import { sessionStorageManager, FloorPlanSessionData } from '@/utils/sessionStorage';

export function useFloorPlanSession() {
  const [sessionData, setSessionData] = useState<FloorPlanSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load session data
  const loadSession = useCallback(() => {
    try {
      // Clean up expired sessions
      sessionStorageManager.cleanupExpiredSessions();
      
      const data = sessionStorageManager.getSessionData();
      setSessionData(data);
      setError(null);
      
      if (!data) {
        setError('No floor plan session found. Please upload a floor plan first.');
      }
    } catch (err) {
      setError('Failed to load session data');
      console.error('Session load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Store original floor plan
  const storeOriginalFloorPlan = useCallback((file: File, analysisId: string, blobUrl: string) => {
    try {
      const data = sessionStorageManager.storeOriginalFloorPlan(file, analysisId, blobUrl);
      setSessionData(data);
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to store floor plan data');
      console.error('Store error:', err);
      throw err;
    }
  }, []);

  // Store cropped image
  const storeCroppedImage = useCallback((blobUrl: string, cropData: any) => {
    try {
      sessionStorageManager.storeCroppedImage(blobUrl, cropData);
      
      // Update local state
      if (sessionData) {
        const updatedData = {
          ...sessionData,
          croppedImage: { blobUrl, cropData },
          metadata: {
            ...sessionData.metadata,
            lastModified: new Date().toISOString()
          }
        };
        setSessionData(updatedData);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to store cropped image');
      console.error('Crop store error:', err);
      throw err;
    }
  }, [sessionData]);

  // Clear session
  const clearSession = useCallback(() => {
    try {
      sessionStorageManager.clearSession();
      setSessionData(null);
      setError(null);
    } catch (err) {
      console.error('Clear session error:', err);
    }
  }, []);

  // Get current image URL (cropped or original)
  const getCurrentImageUrl = useCallback(() => {
    if (!sessionData) return null;
    return sessionData.croppedImage?.blobUrl || sessionData.originalImage?.blobUrl;
  }, [sessionData]);

  // Check if session is valid
  const isSessionValid = useCallback(() => {
    if (!sessionData) return false;
    return !sessionStorageManager.isSessionExpired();
  }, [sessionData]);

  // Get session age
  const getSessionAge = useCallback(() => {
    return sessionStorageManager.getSessionAge();
  }, []);

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return {
    sessionData,
    isLoading,
    error,
    loadSession,
    storeOriginalFloorPlan,
    storeCroppedImage,
    clearSession,
    getCurrentImageUrl,
    isSessionValid,
    getSessionAge,
    hasSession: !!sessionData
  };
}

export default useFloorPlanSession;
