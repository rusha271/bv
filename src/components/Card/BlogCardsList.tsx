"use client";

import React, { useEffect, useRef } from "react";
import BlogCard from "@/components/Card/BlogCard";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useDeviceType } from "@/utils/useDeviceType";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTips, clearTipsError } from "@/store/slices/blogSlice";
import ErrorDisplay from "@/components/Error/ErrorDisplay";
import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner = () => {
  const { theme } = useThemeContext();
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      py={4}
      width="100%"
    >
      <CircularProgress 
        size={48}
        sx={{ color: theme.palette.primary.main }}
      />
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
      <div 
        className="flex flex-col items-center justify-center py-12 px-4"
        style={{
          background: theme.palette.background.default,
          minHeight: '200px',
        }}
      >
        <div 
          className="text-center"
          style={{ color: theme.palette.text.secondary }}
        >
          <h3 className="text-lg font-medium mb-2">No Tips Available</h3>
          <p className="text-sm">Check back later for new Vastu tips and insights.</p>
        </div>
      </div>
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
    <div
      className={`grid ${getGridLayout()} gap-6`}
      style={{
        background: theme.palette.background.default,
        justifyItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {tips.map((tip) => {
        // Construct full image URL from backend response
        const imageUrl = tip.image_url || tip.image;
        const fullImageUrl = imageUrl?.startsWith('/') 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${imageUrl}`
          : imageUrl;
        
        // Debug logging
        console.log('Tip data:', {
          id: tip.id,
          title: tip.title,
          originalImageUrl: imageUrl,
          fullImageUrl: fullImageUrl,
          hasImageUrl: !!tip.image_url,
          hasImage: !!tip.image
        });
        
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
    </div>
  );
};
