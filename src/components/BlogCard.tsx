"use client";

import React from "react";
import Image from "next/image";
import { useThemeContext } from "@/contexts/ThemeContext";

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

  return (
    <div
      className="rounded-2xl shadow-md transition-all duration-300 overflow-hidden flex flex-col border group"
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
      <div className="p-5 flex-1 flex flex-col">
        <h2
          className="text-lg font-bold mb-2 leading-tight"
          style={{ color: theme.palette.text.primary }}
        >
          {title}
        </h2>
        <p
          className="text-sm mb-1"
          style={{ color: theme.palette.text.secondary }}
        >
          {description}
        </p>
        <p
          className="text-xs mb-4"
          style={{ color: theme.palette.text.secondary }}
        >
          {details}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: theme.palette.text.primary }}
          >
            {category}
          </span>
          <span
            className="text-xs px-2 py-1 rounded font-semibold cursor-default select-none"
            style={{
              background: theme.palette.background.default,
              color: theme.palette.text.secondary,
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