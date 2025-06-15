"use client";

import React from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useDeviceType } from "@/utils/useDeviceType";

interface ZodiacSignCardProps {
  name: string;
  symbol: string;
  planet: string;
  element: string;
  mantra: string;
  remedy: string;
}

const ZodiacSignCard: React.FC<ZodiacSignCardProps> = ({
  name,
  symbol,
  planet,
  element,
  mantra,
  remedy,
}) => {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();

  // Responsive font sizes and padding
  const symbolFontSize = isMobile ? "2.5rem" : isTablet ? "3rem" : "3.5rem";
  const nameFontSize = isMobile ? "1.25rem" : isTablet ? "1.5rem" : "1.75rem";
  const detailFontSize = isMobile ? "0.875rem" : isTablet ? "1rem" : "1.125rem";
  const padding = isMobile ? "1rem" : isTablet ? "1.25rem" : "1.5rem";

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
      {/* Top Section: Symbol and Name */}
      <div className="text-center" style={{ padding }}>
        <div style={{ fontSize: symbolFontSize, marginBottom: "0.5rem" }}>
          {symbol}
        </div>
        <h2
          style={{
            fontSize: nameFontSize,
            fontWeight: "bold",
            color: theme.palette.text.primary,
          }}
        >
          {name}
        </h2>
      </div>

      {/* Details Section */}
      <div className="flex-1" style={{ padding }}>
        <p
          style={{
            fontSize: detailFontSize,
            marginBottom: "0.5rem",
            color: theme.palette.text.secondary,
          }}
        >
          <strong>Ruler:</strong> {planet}
        </p>
        <p
          style={{
            fontSize: detailFontSize,
            marginBottom: "0.5rem",
            color: theme.palette.text.secondary,
          }}
        >
          <strong>Element:</strong> {element}
        </p>
        <p
          style={{
            fontSize: detailFontSize,
            marginBottom: "0.5rem",
            color: theme.palette.text.secondary,
          }}
        >
          <strong>Mantra:</strong> {mantra}
        </p>
        <p
          style={{
            fontSize: detailFontSize,
            color: theme.palette.text.secondary,
          }}
        >
          <strong>Remedy:</strong> {remedy}
        </p>
      </div>
    </div>
  );
};

export default ZodiacSignCard;