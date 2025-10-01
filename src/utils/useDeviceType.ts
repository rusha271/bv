"use client";
import { useMediaQuery } from '@mui/material';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';

export const useDeviceType = () => {
  const { theme } = useGlobalTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return { isMobile, isTablet, isDesktop };
}; 