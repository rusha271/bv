"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchVideos, clearVideosError } from '@/store/slices/blogSlice';
import { Video } from '@/utils/apiService';
import VideoModal from '@/components/Video/VideoModal';
import { lazyLoading } from '@/utils/lazyLoading';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Video as VideoIcon, Play, Clock } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Construct full URLs from backend response
  const videoUrl = video.url?.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${video.url}`
    : video.url;

  const thumbnailUrl = (video.thumbnail_url || video.thumbnail)?.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${video.thumbnail_url || video.thumbnail}`
    : (video.thumbnail_url || video.thumbnail);

  const handleVideoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Set up lazy loading for thumbnail
  useEffect(() => {
    if (imgRef.current && thumbnailUrl) {
      lazyLoading.observeImage(imgRef.current, {
        placeholder: '/images/placeholder-video.jpg', // You can add a placeholder image
        errorImage: '/images/error-video.jpg', // You can add an error image
        onLoad: (img) => {
          img.classList.add('loaded');
        },
        onError: (img) => {
          img.classList.add('error');
        }
      });
    }

    return () => {
      if (imgRef.current) {
        lazyLoading.unobserve(imgRef.current);
      }
    };
  }, [thumbnailUrl]);

  return (
    <>
      <div
        className="w-full rounded-2xl shadow-md transition-all duration-300 overflow-hidden flex flex-col border group cursor-pointer"
        style={{
          background: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          transform: "scale(1)",
        }}
        onClick={handleVideoClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow =
            theme.palette.mode === "dark"
              ? "0 10px 30px rgba(255, 255, 255, 0.15)"
              : "0 10px 30px rgba(0, 0, 0, 0.2)";
          e.currentTarget.style.filter =
            theme.palette.mode === "dark" ? "brightness(1.1)" : "none";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            theme.palette.mode === "dark"
              ? "0 4px 15px rgba(255, 255, 255, 0.05)"
              : "0 4px 15px rgba(0, 0, 0, 0.1)";
          e.currentTarget.style.filter = "none";
        }}
      >
        {/* Image Section */}
        <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '200px', maxHeight: '400px' }}>
          {thumbnailUrl ? (
            <img
              ref={imgRef}
              data-src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out lazy-loading"
              style={{
                background: theme.palette.background.default,
              }}
              onError={(e) => {
                // console.error('Failed to load thumbnail:', thumbnailUrl);
                // console.error('Error event:', e);
              }}
              onLoad={() => {
                // console.log('Thumbnail loaded successfully:', thumbnailUrl);
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{
                background: theme.palette.background.default,
                color: theme.palette.text.secondary,
              }}
            >
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="text-sm">No Thumbnail</span>
              </div>
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              <svg
                className="w-8 h-8 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>

          {/* Tour Video Badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              }}
            >
              🏠 Tour Video
            </span>
          </div>

          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          )}
        </div>
        {/* Content Section */}
        <div className="flex-1 flex flex-col" style={{ padding: isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem' }}>
          <h2
            className="font-bold mb-2 leading-tight"
            style={{ 
              color: theme.palette.text.primary, 
              fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.25rem' 
            }}
          >
            {video.title}
          </h2>
          <p
            className="mb-1"
            style={{ 
              color: theme.palette.text.secondary, 
              fontSize: isMobile ? '0.85rem' : isTablet ? '0.9rem' : '1rem' 
            }}
          >
            {video.description}
          </p>

          {/* Bottom Section */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex gap-1">
              {video.category && (
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ 
                    color: theme.palette.text.primary, 
                    fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem' 
                  }}
                >
                  {video.category}
                </span>
              )}
            </div>
            <span
              className="text-xs px-2 py-1 rounded font-semibold cursor-default select-none"
              style={{
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              WATCH NOW
            </span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        video={video}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default function VideoCardsList() {
  const dispatch = useAppDispatch();
  const { data: videos, loading, error } = useAppSelector((state) => state.blog.videos);
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
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
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
          width: '100%',
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.5) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: isDarkMode
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            border: isDarkMode
              ? '1px solid rgba(59, 130, 246, 0.3)'
              : '1px solid rgba(59, 130, 246, 0.2)',
            mb: 2,
          }}
        >
          <VideoIcon 
            size={32} 
            className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} 
          />
        </Box>
        <CircularProgress 
          size={48}
          sx={{ 
            color: isDarkMode ? '#60a5fa' : '#1e40af',
            mb: 2,
          }}
        />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Loading Tour Videos...
        </Typography>
      </Box>
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

  // Handle empty state
  if (!videos || videos.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 3,
          minHeight: '200px',
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.5) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: isDarkMode
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            border: isDarkMode
              ? '1px solid rgba(59, 130, 246, 0.3)'
              : '1px solid rgba(59, 130, 246, 0.2)',
            mb: 3,
          }}
        >
          <VideoIcon 
            size={48} 
            className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} 
          />
        </Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: theme.palette.text.primary,
            mb: 2,
            textAlign: 'center',
          }}
        >
          No Tour Videos Available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          Check back later for new Vastu tour videos and property walkthroughs.
        </Typography>
      </Box>
    );
  }

  // Determine grid layout based on number of items
  const getGridLayout = () => {
    const itemCount = videos.length;
    
    if (itemCount === 1) {
      return 'grid-cols-1 max-w-md mx-auto';
    } else if (itemCount === 2) {
      return 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto';
    } else if (itemCount === 3) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: videos.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          lg: videos.length <= 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        },
        gap: 3,
        width: '100%',
        justifyItems: 'center',
        maxWidth: videos.length === 1 ? '400px' : videos.length === 2 ? '800px' : '1200px',
        mx: 'auto',
        px: { xs: 1, sm: 2 },
      }}
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </Box>
  );
}
