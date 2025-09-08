// "use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType'; // Import the hook
import Link from 'next/link';

export default function Footer() {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();

  // Responsive font sizes and padding
  const linkFontSize = isMobile ? '0.75rem' : isTablet ? '0.875rem' : '1rem';
  const copyrightFontSize = isMobile ? '0.65rem' : isTablet ? '0.75rem' : '0.875rem';
  const paddingY = isMobile ? 2 : isTablet ? 3 : 3;
  const gap = isMobile ? 1 : isTablet ? 1.5 : 2;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: paddingY,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: gap, mb: 2 }}>
        <Link href="#" passHref>
          <Typography
            variant="body2"
            sx={{
              fontSize: linkFontSize,
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            Privacy Policy
          </Typography>
        </Link>
        <Link href="#" passHref>
          <Typography
            variant="body2"
            sx={{
              fontSize: linkFontSize,
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            Terms of Service
          </Typography>
        </Link>
        <Link href="#" passHref>
          <Typography
            variant="body2"
            sx={{
              fontSize: linkFontSize,
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            Contact Us
          </Typography>
        </Link>
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontSize: copyrightFontSize,
          color: theme.palette.text.secondary,
          mt: 1,
        }}
      >
        Copyrights © {new Date().getFullYear()} Brahma Vastu – All rights reserved.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: copyrightFontSize,
          color: theme.palette.text.secondary,
          mt: 1,
        }}
      >
        Made with ❤️ by Brahma Vastu
      </Typography>
    </Box>
  );
}