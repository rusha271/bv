import React from 'react';
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
import ShareButton from '@/components/ui/ShareButton';

const icons = [
  { icon: <LinkedInIcon />, label: 'Linked In', href: 'https://www.linkedin.com/in/karishmakori/?originalSubdomain=in' },
  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/brahmavastu.in?igsh=MTZqYWc3eDdzeXBhMg==' },
  // { icon: <WhatsAppIcon />, label: 'WhatsApp', href: '9152293717' },
  { icon:<YouTubeIcon/> , label:'YouTube' , href:'https://www.youtube.com/@Brahmavastu'}
];

interface SocialIconsProps {
  direction?: 'row' | 'column';
  showShareButton?: boolean;
  shareTitle?: string;
  shareDescription?: string;
  shareUrl?: string;
}

export default function SocialIcons({ 
  direction = 'row',
  showShareButton = true,
  shareTitle = 'Brahma Vastu - Professional Vastu Consultation',
  shareDescription = 'Get instant Vastu analysis of your floor plan, expert tips, and remedies.',
  shareUrl = ''
}: SocialIconsProps) {
  const { theme, isDarkMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  
  // Responsive sizing
  const iconSize = isMobile ? 32 : isTablet ? 40 : 48;
  const containerPadding = isMobile ? 1 : 2;
  const gap = isMobile ? 1 : 2;
  
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
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: isMobile ? 2 : 4,
        border: isDarkMode
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        minWidth: { xs: "90vw", sm: 480 },
        maxWidth: { xs: "90vw", sm: 480 },
        minHeight: isMobile ? 'auto' : 'auto',
      }}
    >
      {icons.map(({ icon, label, href }) => (
        <Tooltip title={label} placement="top" key={label}>
          <IconButton
            href={href}
            target="_blank"
            rel="noopener"
            sx={{
              width: iconSize,
              height: iconSize,
              borderRadius: isMobile ? 2 : 3,
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
              border: isDarkMode
                ? '1px solid rgba(59, 130, 246, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.1)',
              color: isDarkMode ? '#60a5fa' : '#1e40af',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px) rotate(5deg)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                boxShadow: isDarkMode
                  ? '0 12px 40px rgba(59, 130, 246, 0.3)'
                  : '0 12px 40px rgba(59, 130, 246, 0.2)',
                border: isDarkMode
                  ? '1px solid rgba(59, 130, 246, 0.4)'
                  : '1px solid rgba(59, 130, 246, 0.3)',
              },
            }}
            size={isMobile ? "small" : "large"}
            aria-label={label}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ))}
      
      {showShareButton && (
        <Tooltip title="Share this page" placement="top">
          <Box
            sx={{
              width: iconSize,
              height: iconSize,
              borderRadius: isMobile ? 2 : 3,
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: isDarkMode
                ? '1px solid rgba(34, 197, 94, 0.2)'
                : '1px solid rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: isMobile ? 'scale(1.05) translateY(-2px)' : 'scale(1.1) translateY(-4px) rotate(5deg)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                boxShadow: isDarkMode
                  ? '0 12px 40px rgba(34, 197, 94, 0.3)'
                  : '0 12px 40px rgba(34, 197, 94, 0.2)',
                border: isDarkMode
                  ? '1px solid rgba(34, 197, 94, 0.4)'
                  : '1px solid rgba(34, 197, 94, 0.3)',
              },
            }}
          >
            <ShareButton
              title={shareTitle}
              description={shareDescription}
              url={shareUrl}
              variant="icon"
              size={isMobile ? "sm" : "md"}
              className="!p-0 !bg-transparent !border-0 !shadow-none"
            />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
} 