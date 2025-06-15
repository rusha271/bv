"use client";

import React from "react";
import Image from "next/image";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useDeviceType } from "@/utils/useDeviceType"; // Import the hook

interface BlogCardProps {
  title: string;
  description: string;
  details: string;
  category: string;
  image: string;
  label?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  details,
  category,
  image,
  label = "VASTU TIP",
}) => {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType(); // Use the device type hook

  // Responsive font sizes and padding
  const titleFontSize = isMobile ? '1rem' : isTablet ? '1.1rem' : '1.25rem';
  const descriptionFontSize = isMobile ? '0.85rem' : isTablet ? '0.9rem' : '1rem';
  const detailsFontSize = isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem';
  const categoryFontSize = isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem';
  const labelFontSize = isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem';
  const padding = isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem';

  return (
    <div
      className="w-full rounded-2xl shadow-md transition-all duration-300 overflow-hidden flex flex-col border group"
      style={{
        background: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        transform: "scale(1)",
      }}
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
      <div className="relative w-full aspect-[4/2]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-115 transition-transform duration-500 ease-in-out"
          style={{
            background: theme.palette.background.default,
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col" style={{ padding }}>
        <h2
          className="font-bold mb-2 leading-tight"
          style={{ color: theme.palette.text.primary, fontSize: titleFontSize }}
        >
          {title}
        </h2>
        <p
          className="mb-1"
          style={{ color: theme.palette.text.secondary, fontSize: descriptionFontSize }}
        >
          {description}
        </p>
        <p
          className="mb-4"
          style={{ color: theme.palette.text.secondary, fontSize: detailsFontSize }}
        >
          {details}
        </p>

        {/* Bottom Section (Category and Label) */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex gap-1">
            {category.split(',').map((cat, index) => (
              <span
                key={index}
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: theme.palette.text.primary, fontSize: categoryFontSize }}
              >
                {cat.trim()}
              </span>
            ))}
          </div>
          <span
            className="text-xs px-2 py-1 rounded font-semibold cursor-default select-none"
            style={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontSize: labelFontSize,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;