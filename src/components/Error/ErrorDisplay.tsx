import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ErrorDisplayProps {
  error: string;
  title?: string;
  onRetry?: () => void;
  variant?: 'paper' | 'alert';
  retryText?: string;
}

export default function ErrorDisplay({ 
  error, 
  title = 'Error', 
  onRetry, 
  variant = 'alert',
  retryText = 'Retry'
}: ErrorDisplayProps) {
  const { theme } = useThemeContext();

  if (variant === 'alert') {
    return (
      <Box textAlign="center" py={4}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
        {onRetry && (
          <Button
            variant="contained"
            onClick={onRetry}
            sx={{
              background: theme.palette.primary.main,
              '&:hover': {
                background: theme.palette.primary.dark,
              },
            }}
          >
            {retryText}
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box 
      textAlign="center" 
      py={4}
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        p: 3,
      }}
    >
      <Typography variant="h6" fontWeight={600} color="error.main" mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {error}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{
            background: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          {retryText}
        </Button>
      )}
    </Box>
  );
} 