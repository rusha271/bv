"use client";

import React, { useEffect, useRef } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchVideos, clearVideosError } from '@/store/slices/blogSlice';
import { Video } from '@/utils/apiService';

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();

  const handleVideoClick = () => {
    window.open(video.url, '_blank');
  };

  return (
    <div
      className="rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      style={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
      onClick={handleVideoClick}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3
          className="font-bold text-lg mb-2 line-clamp-2"
          style={{ color: theme.palette.text.primary }}
        >
          {video.title}
        </h3>
        <p
          className="text-sm mb-3 line-clamp-3"
          style={{ color: theme.palette.text.secondary }}
        >
          {video.description}
        </p>
        <div className="flex justify-between items-center">
          <span
            className="text-xs"
            style={{ color: theme.palette.text.secondary }}
          >
            {video.views.toLocaleString()} views
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: theme.palette.primary.main }}
          >
            Watch Now
          </span>
        </div>
      </div>
    </div>
  );
}

export default function VideoCardsList() {
  const dispatch = useAppDispatch();
  const { data: videos, loading, error } = useAppSelector((state) => state.blog.videos);
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchVideos());
    }
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearVideosError());
    dispatch(fetchVideos());
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4" style={{ color: theme.palette.text.secondary }}>
          Loading videos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p style={{ color: theme.palette.error.main }}>{error}</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`grid gap-6 ${
          isMobile
            ? 'grid-cols-1'
            : isTablet
            ? 'grid-cols-2'
            : 'grid-cols-3'
        }`}
      >
        {videos && videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
