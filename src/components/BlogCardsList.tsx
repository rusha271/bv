"use client";

import React, { useEffect, useState } from "react";
import { useVastuTips } from "@/contexts/VastuTipsContext";
import BlogCard from "@/components/BlogCard";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useDeviceType } from "@/utils/useDeviceType"; // Import the hook

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
  const [loading, setLoading] = useState(true);
  const vastuTips = useVastuTips();
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
      style={{
        background: theme.palette.background.default,
        justifyItems: 'center', // Center the grid items
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        vastuTips.map((tip) => (
          <BlogCard
            key={tip.id}
            title={tip.title}
            description={tip.description}
            details={tip.details}
            category={tip.category}
            image={tip.image}
          />
        ))
      )}
    </div>
  );
};