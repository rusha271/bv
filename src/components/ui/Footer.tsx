"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useModalContext } from '@/contexts/ModalContext';
import { Heart, Shield, FileText, Mail } from 'lucide-react';

interface FooterProps {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onContactClick?: () => void;
}

export default function Footer({ onPrivacyClick, onTermsClick, onContactClick }: FooterProps) {
  const { theme } = useThemeContext();
  const { openPrivacyModal, openTermsModal, openContactModal } = useModalContext();
  const muiTheme = useTheme();
  const [isClient, setIsClient] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));

  // Responsive font sizes and padding - use consistent values on server
  const linkFontSize = isClient && isMobile ? '0.75rem' : isClient && isTablet ? '0.875rem' : '1rem';
  const copyrightFontSize = isClient && isMobile ? '0.65rem' : isClient && isTablet ? '0.75rem' : '0.875rem';
  const paddingY = isClient && isMobile ? 2 : isClient && isTablet ? 3 : 3;
  const gap = isClient && isMobile ? 1 : isClient && isTablet ? 1.5 : 2;

  const footerLinks = [
    { label: 'Privacy Policy', icon: Shield, onClick: onPrivacyClick || openPrivacyModal },
    { label: 'Terms of Service', icon: FileText, onClick: onTermsClick || openTermsModal },
    { label: 'Contact Us', icon: Mail, onClick: onContactClick || openContactModal },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: theme.palette.mode === 'dark'
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
        color: theme.palette.text.primary,
        py: paddingY,
        px: 3,
        mt: 'auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: gap, mb: 3, flexWrap: 'wrap' }}>
        {footerLinks.map(({ label, icon: IconComponent, onClick }) => (
          <Box
            key={label}
            component="button"
            onClick={onClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              border: 'none',
              background: 'transparent',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(59, 130, 246, 0.05)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <IconComponent 
              size={16} 
              className={theme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} 
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: linkFontSize,
                color: theme.palette.text.secondary,
                fontWeight: 500,
                '&:hover': { 
                  color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1e40af',
                },
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: copyrightFontSize,
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          Copyrights © {new Date().getFullYear()} Brahma Vastu – All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Heart 
            size={16} 
            className={theme.palette.mode === 'dark' ? 'text-red-400' : 'text-red-500'} 
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: copyrightFontSize,
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Made with love by Brahma Vastu Team
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}