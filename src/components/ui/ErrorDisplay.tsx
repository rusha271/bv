"use client";

import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Button, 
  Box, 
  Typography,
  Paper,
  Stack
} from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ErrorDisplayProps {
  error: string | null;
  title?: string;
  onRetry?: () => void;
  variant?: 'alert' | 'paper' | 'minimal';
  severity?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
  showRetry?: boolean;
  retryText?: string;
  children?: React.ReactNode;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'Something went wrong',
  onRetry,
  variant = 'alert',
  severity = 'error',
  showIcon = true,
  showRetry = true,
  retryText = 'Try Again',
  children
}) => {
  const { theme } = useThemeContext();

  if (!error) return null;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  if (variant === 'alert') {
    return (
      <Alert 
        severity={severity}
        icon={showIcon ? <ErrorIcon /> : undefined}
        action={
          showRetry && onRetry ? (
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
            >
              {retryText}
            </Button>
          ) : undefined
        }
        sx={{
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 2px 8px rgba(255, 255, 255, 0.1)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        {error}
        {children}
      </Alert>
    );
  }

  if (variant === 'paper') {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          textAlign: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          {showIcon && (
            <ErrorIcon 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.error.main,
                opacity: 0.7 
              }} 
            />
          )}
          <Typography variant="h6" color="error" gutterBottom>
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ maxWidth: 400 }}
          >
            {error}
          </Typography>
          {children}
          {showRetry && onRetry && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
              sx={{ mt: 1 }}
            >
              {retryText}
            </Button>
          )}
        </Stack>
      </Paper>
    );
  }

  // minimal variant
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        border: `1px solid ${theme.palette.error.main}`,
        background: theme.palette.error.light,
        color: theme.palette.error.contrastText,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" gutterBottom>
        {error}
      </Typography>
      {children}
      {showRetry && onRetry && (
        <Button
          size="small"
          variant="outlined"
          onClick={handleRetry}
          sx={{ mt: 1, color: 'inherit', borderColor: 'inherit' }}
        >
          {retryText}
        </Button>
      )}
    </Box>
  );
};

export default ErrorDisplay; 