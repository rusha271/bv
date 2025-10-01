'use client';
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface ThemeSwitcherProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  size = 'medium', 
  showTooltip = true 
}) => {
  const { isDarkMode, toggleTheme } = useGlobalTheme();

  const button = (
    <IconButton
      onClick={toggleTheme}
      size={size}
      sx={{
        backgroundColor: isDarkMode 
          ? 'rgba(148, 163, 184, 0.1)' 
          : 'rgba(148, 163, 184, 0.05)',
        border: isDarkMode
          ? '1px solid rgba(148, 163, 184, 0.2)'
          : '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: isDarkMode 
            ? 'rgba(148, 163, 184, 0.2)' 
            : 'rgba(148, 163, 184, 0.1)',
          transform: 'translateY(-1px)',
          boxShadow: isDarkMode
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {isDarkMode ? (
        <LightModeIcon sx={{ color: '#fbbf24' }} />
      ) : (
        <DarkModeIcon sx={{ color: '#64748b' }} />
      )}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ThemeSwitcher;