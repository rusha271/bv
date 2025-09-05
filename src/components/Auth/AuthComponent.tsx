"use client";

import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useDeviceType } from '../../utils/useDeviceType';

interface SocialAuthProps {
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      confirmPassword: string;
      fullName: string;
      phone: string;
    }>
  >;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
}

export const SocialAuth = ({ setFormData, setTabValue }: SocialAuthProps) => {
  const { isMobile } = useDeviceType();

  return (
    <Box sx={{ mt: isMobile ? 3 : 4 }}>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center">
        <button
          type="button"
          disabled
          style={{
            width: isMobile ? '100%' : undefined,
            border: '1px solid #e0e0e0',
            borderRadius: 16,
            padding: '10px 0',
            background: '#fff',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontWeight: 500,
            fontSize: 16,
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
        >
          {/* <img src="/icons/google.svg" alt="Google" style={{ width: 20, height: 20 }} />
          {isMobile ? 'Continue with Google' : 'Google'} */}
        </button>
      </Stack>
    </Box>
  );
};