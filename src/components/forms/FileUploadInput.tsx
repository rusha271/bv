"use client"

import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Box, Typography, Button, Input, InputLabel } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { Upload, FileImage } from 'lucide-react';

interface FileUploadInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  accept?: string;
  className?: string;
}

export const FileUploadInput = ({ name, control, label = 'Floor Plan', accept = '.png,.jpg,.jpeg', className }: FileUploadInputProps) => {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box className={className}>
          <InputLabel 
            shrink 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 600,
              mb: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {label}
          </InputLabel>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              mb: 1,
              textTransform: 'none',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              py: { xs: 2, sm: 2.5 },
              px: { xs: 1.5, sm: 2 },
              borderRadius: { xs: 2, sm: 3 },
              border: isDarkMode
                ? '2px dashed rgba(148, 163, 184, 0.3)'
                : '2px dashed rgba(148, 163, 184, 0.4)',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%)',
              color: theme.palette.text.primary,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                border: isDarkMode
                  ? '2px dashed rgba(59, 130, 246, 0.6)'
                  : '2px dashed rgba(59, 130, 246, 0.8)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
                transform: { xs: 'translateY(-1px)', sm: 'translateY(-2px)' },
                boxShadow: isDarkMode
                  ? '0 8px 25px rgba(59, 130, 246, 0.2)'
                  : '0 8px 25px rgba(59, 130, 246, 0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              {value && value.length > 0 ? (
                <FileImage 
                  size={18} 
                  className={isDarkMode ? 'text-green-400' : 'text-green-600'} 
                />
              ) : (
                <Upload 
                  size={18} 
                  className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} 
                />
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary, fontSize: { xs: "0.85rem", sm: "0.9rem" } }}>
                  {value && value.length > 0 ? value[0]?.name : 'Choose Floor Plan'}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                  {value && value.length > 0 ? 'Click to change file' : 'Drag & drop or click to browse'}
                </Typography>
              </Box>
            </Box>
            <Input
              type="file"
              inputProps={{ accept }}
              sx={{ display: 'none' }}
              onChange={(e) => onChange((e.target as HTMLInputElement).files)}
            />
          </Button>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              display: 'block',
              textAlign: 'center',
              mt: 1,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Supported formats: PNG, JPG, JPEG (Max 10MB)
          </Typography>
          {error && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.error.main,
                display: 'block',
                textAlign: 'center',
                mt: 1,
                fontWeight: 500,
              }}
            >
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};