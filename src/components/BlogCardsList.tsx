"use client";

import React, { useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useDeviceType } from "@/utils/useDeviceType";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTips, clearTipsError } from "@/store/slices/blogSlice";

const LoadingSpinner = () => {
  const { theme } = useThemeContext();
  return (
    <div className="flex justify-center items-center w-full py-16 col-span-full">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4"
        style={{ borderColor: theme.palette.primary.main }}
      ></div>
    </div>
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
