"use client";

import React, { useEffect, useRef } from "react";
import BlogCard from "@/components/Card/BlogCard";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useDeviceType } from "@/utils/useDeviceType";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTips, clearTipsError } from "@/store/slices/blogSlice";
import ErrorDisplay from "@/components/Error/ErrorDisplay";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Lightbulb, Sparkles } from "lucide-react";

const LoadingSpinner = () => {
  const { theme } = useThemeContext();
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        width: '100%',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.5) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.3)'
            : '1px solid rgba(59, 130, 246, 0.2)',
          mb: 2,
        }}
      >
        <Lightbulb 
          size={32} 
          className={theme.palette.mode === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} 
        />
      </Box>
      <CircularProgress 
        size={48}
        sx={{ 
          color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1e40af',
          mb: 2,
        }}
      />
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Loading Vastu Tips...
      </Typography>
    </Box>
  );
};

export default function BlogCardsList() {
  const dispatch = useAppDispatch();
  const { data: tips, loading, error } = useAppSelector((state) => state.blog.tips);
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchTips());
    }
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearTipsError());
    dispatch(fetchTips());
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load tips"
        onRetry={handleRetry}
        variant="paper"
        retryText="Retry"
      />
    );
  }

  // Handle empty state
  if (!tips || tips.length === 0) {
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
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.5) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(59, 130, 246, 0.3)'
              : '1px solid rgba(59, 130, 246, 0.2)',
            mb: 3,
          }}
        >
          <Lightbulb 
            size={48} 
            className={theme.palette.mode === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} 
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
          No Tips Available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          Check back later for new Vastu tips and insights to enhance your understanding.
        </Typography>
      </Box>
    );
  }

  // Determine grid layout based on number of items
  const getGridLayout = () => {
    const itemCount = tips.length;
    
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
          sm: tips.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          lg: tips.length <= 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        },
        gap: 3,
        width: '100%',
        justifyItems: 'center',
        maxWidth: tips.length === 1 ? '400px' : tips.length === 2 ? '800px' : '1200px',
        mx: 'auto',
        px: { xs: 1, sm: 2 },
      }}
    >
      {tips.map((tip) => {
        // Construct full image URL from backend response
        const imageUrl = tip.image_url || tip.image;
        const fullImageUrl = imageUrl?.startsWith('/') 
          ? `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
          : imageUrl;
        
        // Debug logging
        // console.log('Tip data:', {
        //   id: tip.id,
        //   title: tip.title,
        //   originalImageUrl: imageUrl,
        //   fullImageUrl: fullImageUrl,
        //   hasImageUrl: !!tip.image_url,
        //   hasImage: !!tip.image
        // });
        
        return (
          <BlogCard
            key={tip.id}
            title={tip.title}
            description={tip.content}
            details={tip.content}
            category={tip.category}
            image={fullImageUrl || ''}
          />
        );
      })}
    </Box>
  );
};
