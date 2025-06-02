"use client"

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ThemeSwitcherProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

export default function ThemeSwitcher({ toggleTheme, mode }: ThemeSwitcherProps) {
  const { theme } = useThemeContext();
  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      sx={{ color: theme.palette.text.primary }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}