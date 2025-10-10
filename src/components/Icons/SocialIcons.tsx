  import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';  
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Share2 } from 'lucide-react';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import ShareModal from '@/components/Modals/ShareModal';

const icons = [
  { 
    icon: <LinkedInIcon />, 
    label: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/karishmakori/?originalSubdomain=in',
    color: 'rgba(0, 119, 181, 0.1)',
    hoverColor: 'rgba(0, 119, 181, 0.2)',
    borderColor: 'rgba(0, 119, 181, 0.2)',
    hoverBorderColor: 'rgba(0, 119, 181, 0.4)',
    textColor: '#0077b5',
    shadowColor: 'rgba(0, 119, 181, 0.3)'
  },
  { 
    icon: <InstagramIcon />, 
    label: 'Instagram', 
    href: 'https://www.instagram.com/brahmavastu.in?igsh=MTZqYWc3eDdzeXBhMg==',
    color: 'rgba(238, 42, 123, 0.1)',
    hoverColor: 'rgba(238, 42, 123, 0.2)',
    borderColor: 'rgba(238, 42, 123, 0.2)',
    hoverBorderColor: 'rgba(238, 42, 123, 0.4)',
    textColor: '#ee2a7b',
    shadowColor: 'rgba(238, 42, 123, 0.3)'
  },
  { 
    icon: <YouTubeIcon/>, 
    label: 'YouTube', 
    href: 'https://www.youtube.com/@Brahmavastu',
    color: 'rgba(255, 0, 0, 0.1)',
    hoverColor: 'rgba(255, 0, 0, 0.2)',
    borderColor: 'rgba(255, 0, 0, 0.2)',
    hoverBorderColor: 'rgba(255, 0, 0, 0.4)',
    textColor: '#ff0000',
    shadowColor: 'rgba(255, 0, 0, 0.3)'
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
  variant = 'classic',
  showLabels = false,
  animated = true
}: SocialIconsProps) {
  const { theme, isDarkMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Responsive sizing - restored to original sizes
  const iconSize = isMobile ? 32 : isTablet ? 40 : 48;
  const containerPadding = isMobile ? 1 : 2;
  const gap = isMobile ? 1 : 2;

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
      borderRadius: isMobile ? 8 : 12,
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
          background: isDarkMode ? iconData.color : iconData.color,
          border: isDarkMode ? `1px solid ${iconData.borderColor}` : `1px solid ${iconData.borderColor}`,
          color: isDarkMode ? iconData.textColor : iconData.textColor,
          '&:hover': animated ? {
            transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px) rotate(5deg)',
            background: isDarkMode ? iconData.hoverColor : iconData.hoverColor,
            boxShadow: isDarkMode
              ? `0 12px 40px ${iconData.shadowColor}`
              : `0 12px 40px ${iconData.shadowColor}`,
            border: isDarkMode ? `1px solid ${iconData.hoverBorderColor}` : `1px solid ${iconData.hoverBorderColor}`,
          } : {},
        };
      default: // modern
        return {
          ...baseStyles,
          background: isDarkMode ? iconData.color : iconData.color,
          border: isDarkMode ? `1px solid ${iconData.borderColor}` : `1px solid ${iconData.borderColor}`,
          color: isDarkMode ? iconData.textColor : iconData.textColor,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
          '&:hover': animated ? {
            transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px)',
            background: isDarkMode ? iconData.hoverColor : iconData.hoverColor,
            boxShadow: `0 16px 48px ${iconData.shadowColor}, 0 0 0 1px rgba(255, 255, 255, 0.2)`,
            border: isDarkMode ? `1px solid ${iconData.hoverBorderColor}` : `1px solid ${iconData.hoverBorderColor}`,
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
        width: isMobile ? '100%' : '50%',
        p: containerPadding,
        borderRadius: isMobile ? 12 : 16,
        minWidth: { xs: "90vw", sm: 480 },
        maxWidth: { xs: "90vw", sm: 480 },
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
          <IconButton
            onClick={() => setShowShareModal(true)}
            onMouseEnter={() => setHoveredIcon('Share')}
            onMouseLeave={() => setHoveredIcon(null)}
            sx={{
              width: iconSize,
              height: iconSize,
              borderRadius: isMobile ? 8 : 12,
              transition: animated ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              position: 'relative' as const,
              overflow: 'hidden' as const,
              background: isDarkMode
                ? 'rgba(255, 0, 0, 0.1)'
                : 'rgba(255, 0, 0, 0.05)',
              border: isDarkMode
                ? '1px solid rgba(255, 0, 0, 0.2)'
                : '1px solid rgba(255, 0, 0, 0.1)',
              color: isDarkMode ? '#ff0000' : '#dc2626',
              '&:hover': animated ? {
                transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px) rotate(5deg)',
                background: isDarkMode
                  ? 'rgba(255, 0, 0, 0.2)'
                  : 'rgba(255, 0, 0, 0.1)',
                boxShadow: isDarkMode
                  ? '0 12px 40px rgba(255, 0, 0, 0.3)'
                  : '0 12px 40px rgba(255, 0, 0, 0.2)',
                border: isDarkMode
                  ? '1px solid rgba(255, 0, 0, 0.4)'
                  : '1px solid rgba(255, 0, 0, 0.3)',
              } : {},
            }}
            size={isMobile ? "medium" : "large"}
            aria-label="Share this page"
          >
            {animated && hoveredIcon === 'Share' && (
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
            <Share2 className="w-5 h-5" />
          </IconButton>
        </Tooltip>
      )}
      
      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={shareTitle}
        description={shareDescription}
        url={shareUrl}
      />
    </Box>
  );
} 