"use client"

import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Box, Typography, Button, Input, InputLabel } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useThemeContext } from '@/contexts/ThemeContext';

interface FileUploadInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  accept?: string;
  className?: string;
}

export const FileUploadInput = ({ name, control, label = 'Floor Plan', accept = '.png,.jpg,.jpeg', className }: FileUploadInputProps) => {
  const { theme } = useThemeContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box className={className}>
          <InputLabel shrink sx={{ color: theme.palette.text.primary }}>
            {label}
          </InputLabel>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            fullWidth
            sx={{
              mb: 1,
              textTransform: 'none',
              justifyContent: 'flex-start',
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <span style={{ color: theme.palette.text.primary }}>
              {value && value.length > 0 ? value[0]?.name : 'No File Chosen'}
            </span>
            <Input
              type="file"
              inputProps={{ accept }}
              sx={{ display: 'none', color: theme.palette.text.primary }}
              onChange={(e) => onChange((e.target as HTMLInputElement).files)}
            />
          </Button>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Upload a proper floor plan, allowed types are png, jpg, jpeg.
          </Typography>
          {error && (
            <Typography variant="caption" sx={{ color: theme.palette.error.main }} display="block">
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};