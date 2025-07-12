"use client";

import React, { useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useDeviceType } from "@/utils/useDeviceType";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTips, clearTipsError } from "@/store/slices/blogSlice";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
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

  useEffect(() => {
    if (!tips || tips.length === 0) {
      dispatch(fetchTips());
    }
  }, [dispatch, tips]);

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

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
      style={{
        background: theme.palette.background.default,
        justifyItems: 'center',
      }}
    >
      {tips && tips.map((tip) => (
        <BlogCard
          key={tip.id}
          title={tip.title}
          description={tip.content}
          details={tip.content}
          category={tip.category}
          image={tip.image}
        />
      ))}
    </div>
  );
};
