'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPodcasts, clearPodcastsError } from '@/store/slices/blogSlice';
import { Podcast } from '@/utils/apiService';
import ErrorDisplay from '@/components/Error/ErrorDisplay';
import { CircularProgress, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Headphones, Play, Pause, Clock } from 'lucide-react';
import { apiService } from '@/utils/apiService';

interface PodcastCardProps {
  podcast: Podcast;
}

function PodcastCard({ podcast }: PodcastCardProps) {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const [playingPodcast, setPlayingPodcast] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/images/bv.png'; // Default image
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const baseURL = apiService.getBaseURL();
    return imagePath.startsWith('/') ? `${baseURL}${imagePath}` : `${baseURL}/${imagePath}`;
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return 'Unknown';
    return duration;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePlayPause = () => {
    if (playingPodcast === podcast.id) {
      // Pause current podcast
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }
      setPlayingPodcast(null);
    } else {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }

      // Play new podcast
      const audio = new Audio(podcast.audio_url);
      audio.play();
      setAudioElement(audio);
      setPlayingPodcast(podcast.id);

      // Handle audio end
      audio.onended = () => {
        setPlayingPodcast(null);
        setAudioElement(null);
      };

      // Handle audio error
      audio.onerror = () => {
        setPlayingPodcast(null);
        setAudioElement(null);
      };
    }
  };

  return (
    <div
      className="w-full rounded-2xl shadow-md transition-all duration-300 overflow-hidden flex flex-col border group cursor-pointer"
      style={{
        background: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        transform: "scale(1)",
      }}
      onClick={handlePlayPause}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.boxShadow =
          isDarkMode
            ? "0 10px 30px rgba(255, 255, 255, 0.15)"
            : "0 10px 30px rgba(0, 0, 0, 0.2)";
        e.currentTarget.style.filter =
          isDarkMode ? "brightness(1.1)" : "none";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          isDarkMode
            ? "0 4px 15px rgba(255, 255, 255, 0.05)"
            : "0 4px 15px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.filter = "none";
      }}
    >
      {/* Image Section */}
      <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '200px', maxHeight: '400px' }}>
        {podcast.thumbnail_url ? (
          <img
            src={getImageUrl(podcast.thumbnail_url)}
            alt={podcast.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            style={{
              background: theme.palette.background.default,
            }}
            onError={(e) => {
              console.error('Failed to load podcast thumbnail:', podcast.thumbnail_url);
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
              <VolumeUpIcon sx={{ fontSize: 48, mb: 1 }} />
              <span className="text-sm">No Thumbnail</span>
            </div>
          </div>
        )}
        
        {/* Play/Pause Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            {playingPodcast === podcast.id ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </div>
        </div>
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
          {podcast.title}
        </h2>
        
        <p
          className="mb-4"
          style={{ 
            color: theme.palette.text.secondary, 
            fontSize: isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem' 
          }}
        >
          {podcast.description}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <AccessTimeIcon 
              sx={{ 
                fontSize: isMobile ? 16 : 18,
                color: theme.palette.text.secondary 
              }} 
            />
            <span
              className="text-xs"
              style={{ 
                color: theme.palette.text.secondary,
                fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem'
              }}
            >
              {formatDuration(podcast.duration)}
            </span>
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
            {formatDate(podcast.created_at)}
          </span>
        </div>

        {/* Play Status */}
        {playingPodcast === podcast.id && (
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.palette.primary.main }}
            />
            <span
              className="text-xs font-semibold"
              style={{ 
                color: theme.palette.primary.main,
                fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem'
              }}
            >
              Now Playing
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PodcastCardsList() {
  const dispatch = useAppDispatch();
  const { data: podcasts, loading, error } = useAppSelector((state) => state.blog.podcasts);
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchPodcasts());
    }
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearPodcastsError());
    dispatch(fetchPodcasts());
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
          <Headphones 
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
          Loading Vastu Podcasts...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load podcasts"
        onRetry={handleRetry}
        variant="paper"
        retryText="Retry"
      />
    );
  }

  // Handle empty state
  if (!podcasts || podcasts.length === 0) {
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
          <Headphones 
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
          No Podcasts Available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          Check back later for new Vastu podcast episodes and audio content.
        </Typography>
      </Box>
    );
  }

  // Determine grid layout based on number of items
  const getGridLayout = () => {
    const itemCount = podcasts.length;
    
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
          sm: podcasts.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          lg: podcasts.length <= 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        },
        gap: 3,
        width: '100%',
        justifyItems: 'center',
        maxWidth: podcasts.length === 1 ? '400px' : podcasts.length === 2 ? '800px' : '1200px',
        mx: 'auto',
        px: { xs: 1, sm: 2 },
      }}
    >
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </Box>
  );
}
