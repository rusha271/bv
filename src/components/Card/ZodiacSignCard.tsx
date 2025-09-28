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
      className="w-full rounded-2xl transition-all duration-300 overflow-hidden flex flex-col group"
      style={{
        background: theme.palette.mode === 'dark'
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        color: theme.palette.text.primary,
        transform: "scale(1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = theme.palette.mode === 'dark'
          ? '0 12px 40px rgba(0, 0, 0, 0.4)'
          : '0 12px 40px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.filter = theme.palette.mode === 'dark' ? 'brightness(1.1)' : 'none';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)';
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
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)'
              : 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: theme.palette.mode === 'dark' 
              ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {name}
        </h2>
      </div>

      {/* Details Section */}
      <div className="flex-1" style={{ padding, paddingTop: '0.5rem' }}>
        <div style={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(59, 130, 246, 0.1)'
            : 'rgba(59, 130, 246, 0.05)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.2)'
            : '1px solid rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '8px'
        }}>
          <p
            style={{
              fontSize: detailFontSize,
              marginBottom: "0.5rem",
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>🪐</span>
            <strong style={{ color: theme.palette.text.primary }}>Ruler:</strong> {planet}
          </p>
          <p
            style={{
              fontSize: detailFontSize,
              marginBottom: "0.5rem",
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>🔥</span>
            <strong style={{ color: theme.palette.text.primary }}>Element:</strong> {element}
          </p>
        </div>
        
        <div style={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(139, 92, 246, 0.1)'
            : 'rgba(139, 92, 246, 0.05)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(139, 92, 246, 0.2)'
            : '1px solid rgba(139, 92, 246, 0.1)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '8px'
        }}>
          <div
            style={{
              fontSize: detailFontSize,
              marginBottom: "0.5rem",
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>🕉️</span>
            <div>
              <strong style={{ color: theme.palette.text.primary }}>Mantra:</strong> {mantra}
            </div>
          </div>
        </div>
        
        <div style={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(34, 197, 94, 0.05)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(34, 197, 94, 0.2)'
            : '1px solid rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div
            style={{
              fontSize: detailFontSize,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✨</span>
            <div>
              <strong style={{ color: theme.palette.text.primary }}>Remedy:</strong> {remedy}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZodiacSignCard;