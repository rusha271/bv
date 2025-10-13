"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { Video } from '@/utils/apiService';
import { startVideoTracking, updateVideoWatchTime, trackVideoView, stopVideoTracking } from '@/utils/videoTracking';
import { getImageUrl } from '@/utils/imageUtils';

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isTrackingStarted, setIsTrackingStarted] = useState<boolean>(false);

  // Cleanup tracking when modal closes
  useEffect(() => {
    return () => {
      if (isTrackingStarted && video) {
        stopVideoTracking(video.id);
      }
    };
  }, [video?.id, isTrackingStarted]);

  // Reset tracking state when video changes
  useEffect(() => {
    setIsTrackingStarted(false);
    setVideoDuration(0);
  }, [video?.id]);

  if (!isOpen || !video) return null;

  // Construct full URLs from backend response using utility function
  const videoUrl = getImageUrl(video.url || '');
  const thumbnailUrl = getImageUrl(video.thumbnail_url || video.thumbnail || '');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Video tracking handlers
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      
      // Start tracking when metadata is loaded
      if (!isTrackingStarted && duration > 0) {
        startVideoTracking(video.id, duration);
        setIsTrackingStarted(true);
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && isTrackingStarted) {
      const currentTime = videoRef.current.currentTime;
      updateVideoWatchTime(video.id, currentTime);
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current && isTrackingStarted) {
      const watchTime = videoRef.current.currentTime;
      trackVideoView(video.id, watchTime, videoDuration, video.category);
      stopVideoTracking(video.id);
    }
  };

  const handleVideoPause = () => {
    if (videoRef.current && isTrackingStarted) {
      const watchTime = videoRef.current.currentTime;
      // Check if we should track the view on pause (e.g., if user watched enough)
      const percentage = (watchTime / videoDuration) * 100;
      if (videoDuration < 15 && percentage >= 90) {
        trackVideoView(video.id, watchTime, videoDuration, video.category);
        stopVideoTracking(video.id);
      } else if (videoDuration >= 15 && (watchTime >= 30 || percentage >= 50)) {
        trackVideoView(video.id, watchTime, videoDuration, video.category);
        stopVideoTracking(video.id);
      }
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    if (error) {
      console.error('Video error:', {
        code: error.code,
        message: error.message,
        networkState: video.networkState,
        readyState: video.readyState,
        src: video.src
      });
      
      // Handle specific error cases
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          console.warn('Video loading was aborted');
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          console.warn('Network error occurred while loading video');
          break;
        case MediaError.MEDIA_ERR_DECODE:
          console.warn('Error occurred while decoding video');
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.warn('Video format not supported or blocked');
          break;
        default:
          console.warn('Unknown video error occurred');
      }
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="relative w-full max-w-4xl mx-auto rounded-lg shadow-2xl overflow-hidden"
        style={{
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          maxHeight: isMobile ? '90vh' : '80vh',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: theme.palette.divider }}
        >
          <h2
            className="text-lg font-semibold truncate pr-4"
            style={{ color: theme.palette.text.primary }}
          >
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            style={{ color: theme.palette.text.secondary }}
            aria-label="Close video"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Video Content */}
        <div className="p-4">
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              controls
              className="w-full h-full rounded-lg"
              style={{
                backgroundColor: theme.palette.background.default,
              }}
              poster={thumbnailUrl}
              preload="metadata"
              onLoadedMetadata={handleVideoLoadedMetadata}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
              onPause={handleVideoPause}
              onError={handleVideoError}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="mt-4 space-y-2">
            <p
              className="text-sm leading-relaxed"
              style={{ color: theme.palette.text.secondary }}
            >
              {video.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {video.duration && (
                <span style={{ color: theme.palette.text.secondary }}>
                  Duration: {video.duration}
                </span>
              )}
              {video.category && (
                <span
                  className="px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {video.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between p-4 border-t"
          style={{ borderColor: theme.palette.divider }}
        >
          <div className="text-xs" style={{ color: theme.palette.text.secondary }}>
            {video.created_at && (
              <span>
                Uploaded: {new Date(video.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
