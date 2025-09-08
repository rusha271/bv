'use client';

import React, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { Box, useTheme } from '@mui/material';

interface PageLoaderProps {
  loading: boolean;
  color?: string;
  size?: number;
  height?: number;
  width?: number;
  radius?: number;
  margin?: number;
  speedMultiplier?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  loading,
  color,
  size = 15,
  height = 35,
  width = 4,
  radius = 2,
  margin = 2,
  speedMultiplier = 1,
}) => {
  const theme = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!loading || !isClient) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.8)' 
          : 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
    >
      <ScaleLoader
        color={color || theme.palette.primary.main}
        height={height}
        width={width}
        radius={radius}
        margin={margin}
        speedMultiplier={speedMultiplier}
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <Box
        sx={{
          mt: 3,
          color: theme.palette.text.primary,
          fontSize: '1.1rem',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        Loading...
      </Box>
    </Box>
  );
};

export default PageLoader;
