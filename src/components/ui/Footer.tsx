"use client"

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import Link from 'next/link';

export default function Footer() {
  const { theme } = useThemeContext();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: 3,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <Link href="#" passHref>
          <Typography
            variant="body2"
            sx={{
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
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            Contact Us
          </Typography>
        </Link>
      </Box>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
        Copyrights © 2025 Brahma Vastu – All rights reserved.
      </Typography>
    </Box>
  );
}