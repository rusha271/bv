import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';  
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
// import ShareIcon from '@mui/icons-material/Share';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { GradientShareButton, FloatingShareButton } from '@/components/ui/ShareButton';

const icons = [
  { 
    icon: <LinkedInIcon />, 
    label: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/karishmakori/?originalSubdomain=in',
    color: 'from-blue-600 to-blue-700',
    hoverColor: 'from-blue-500 to-blue-600'
  },
  { 
    icon: <InstagramIcon />, 
    label: 'Instagram', 
    href: 'https://www.instagram.com/brahmavastu.in?igsh=MTZqYWc3eDdzeXBhMg==',
    color: 'from-pink-500 to-purple-600',
    hoverColor: 'from-pink-400 to-purple-500'
  },
  { 
    icon: <YouTubeIcon/>, 
    label: 'YouTube', 
    href: 'https://www.youtube.com/@Brahmavastu',
    color: 'from-red-500 to-red-600',
    hoverColor: 'from-red-400 to-red-500'
  }
];

interface SocialIconsProps {
  direction?: 'row' | 'column';
  showShareButton?: boolean;
  shareTitle?: string;
  shareDescription?: string;
  shareUrl?: string;
  variant?: 'modern' | 'classic' | 'minimal';
  showLabels?: boolean;
  animated?: boolean;
}

export default function SocialIcons({ 
  direction = 'row',
  showShareButton = true,
  shareTitle = 'Brahma Vastu - Professional Vastu Consultation',
  shareDescription = 'Get instant Vastu analysis of your floor plan, expert tips, and remedies.',
  shareUrl = '',
  variant = 'modern',
  showLabels = false,
  animated = true
}: SocialIconsProps) {
  const { theme, isDarkMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  
  // Responsive sizing
  const iconSize = isMobile ? 40 : isTablet ? 48 : 56;
  const containerPadding = isMobile ? 4 : 6;
  const gap = isMobile ? 3 : 4;

  const getContainerStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          backdropFilter: 'none',
        };
      case 'classic':
        return {
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        };
      default: // modern
        return {
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(24px)',
          border: isDarkMode
            ? '1px solid rgba(148, 163, 184, 0.15)'
            : '1px solid rgba(148, 163, 184, 0.25)',
          boxShadow: isDarkMode
            ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        };
    }
  };

  const getIconStyles = (iconData: typeof icons[0]) => {
    const baseStyles = {
      width: iconSize,
      height: iconSize,
      borderRadius: isMobile ? 12 : 16,
      transition: animated ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    switch (variant) {
      case 'minimal':
        return {
          ...baseStyles,
          background: 'transparent',
          color: isDarkMode ? '#94a3b8' : '#64748b',
          '&:hover': animated ? {
            color: isDarkMode ? '#60a5fa' : '#3b82f6',
            transform: 'scale(1.1)',
          } : {},
        };
      case 'classic':
        return {
          ...baseStyles,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          border: isDarkMode
            ? '1px solid rgba(59, 130, 246, 0.2)'
            : '1px solid rgba(59, 130, 246, 0.1)',
          color: isDarkMode ? '#60a5fa' : '#1e40af',
          '&:hover': animated ? {
            transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px) rotate(5deg)',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            boxShadow: isDarkMode
              ? '0 12px 40px rgba(59, 130, 246, 0.3)'
              : '0 12px 40px rgba(59, 130, 246, 0.2)',
          } : {},
        };
      default: // modern
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${iconData.color})`,
          color: 'white',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
          '&:hover': animated ? {
            transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px)',
            background: `linear-gradient(135deg, ${iconData.hoverColor})`,
            boxShadow: `0 16px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)`,
          } : {},
        };
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', sm: direction },
        gap: gap,
        justifyContent: 'center',
        alignItems: 'center',
        width: isMobile ? '100%' : 'auto',
        p: containerPadding,
        borderRadius: isMobile ? 16 : 24,
        minWidth: { xs: "90vw", sm: 320 },
        maxWidth: { xs: "90vw", sm: 600 },
        ...getContainerStyles(),
      }}
    >
      {icons.map((iconData) => (
        <Tooltip 
          title={showLabels ? iconData.label : ''} 
          placement="top" 
          key={iconData.label}
          arrow
        >
          <IconButton
            href={iconData.href}
            target="_blank"
            rel="noopener"
            onMouseEnter={() => setHoveredIcon(iconData.label)}
            onMouseLeave={() => setHoveredIcon(null)}
            sx={getIconStyles(iconData)}
            size={isMobile ? "medium" : "large"}
            aria-label={iconData.label}
          >
            {animated && hoveredIcon === iconData.label && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.5 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
            )}
            {iconData.icon}
          </IconButton>
        </Tooltip>
      ))}
      
      {showShareButton && (
        <Tooltip title="Share this page" placement="top" arrow>
          <Box
            sx={{
              width: iconSize,
              height: iconSize,
              borderRadius: isMobile ? 12 : 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: animated ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              ...(variant === 'modern' && {
                background: 'linear-gradient(135deg, from-emerald-500 to-teal-600)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                '&:hover': animated ? {
                  transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                } : {},
              }),
            }}
          >
            <FloatingShareButton
              title={shareTitle}
              description={shareDescription}
              url={shareUrl}
              variant="icon"
              size={isMobile ? "sm" : "md"}
              className="!p-0 !bg-transparent !border-0 !shadow-none"
              showAnimation={animated}
            />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
} 