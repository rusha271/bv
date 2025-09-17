'use client';
import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';

const DisclaimerCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(148, 163, 184, 0.1)'
    : '1px solid rgba(148, 163, 184, 0.2)',
  backdropFilter: 'blur(20px)',
  overflowY: 'auto',
  maxHeight: '400px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 32px 64px -12px rgba(0, 0, 0, 0.6)'
      : '0 32px 64px -12px rgba(0, 0, 0, 0.3)',
  },
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.05)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(148, 163, 184, 0.3)',
    },
  },
}));

const Disclaimer = () => {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();

  const titleSize = isMobile ? '1.1rem' : '1.25rem';
  const textSize = isMobile ? '0.85rem' : '0.95rem';

  return (
    <DisclaimerCard>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ 
        fontSize: titleSize, 
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
          : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 2
      }}>
        ⚖️ Disclaimer
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, fontSize: textSize, color: theme.palette.text.secondary }}>
        The information provided on BrahmaVastu.in is for general informational purposes only. While we strive to ensure that the information presented is accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, fontSize: textSize, color: theme.palette.text.secondary }}>
        <Typography component="strong" fontWeight={600} sx={{ color: theme.palette.text.primary, fontSize: textSize }}>Professional Advice:</Typography> The content on this website should not be considered as professional advice. Users are encouraged to seek professional consultation before making decisions based on the information provided.
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, fontSize: textSize, color: theme.palette.text.secondary }}>
        <Typography component="strong" fontWeight={600} sx={{ color: theme.palette.text.primary, fontSize: textSize }}>No Liability:</Typography> In no event will BrahmaVastu, its affiliates, or its employees be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, arising from the use of this website or reliance on any information provided.
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, fontSize: textSize, color: theme.palette.text.secondary }}>
        <Typography component="strong" fontWeight={600} sx={{ color: theme.palette.text.primary, fontSize: textSize }}>External Links:</Typography> Our website may contain links to external sites. These links are provided for your convenience and do not signify endorsement. We have no control over the content of these sites and assume no responsibility for their accuracy or legality.
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, fontSize: textSize, color: theme.palette.text.secondary }}>
        <Typography component="strong" fontWeight={600} sx={{ color: theme.palette.text.primary, fontSize: textSize }}>Changes to Content:</Typography> BrahmaVastu reserves the right to make changes to the website and its content without notice. We do not guarantee that the website will always be available or that the information will be complete or current.
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, fontSize: textSize, color: theme.palette.text.secondary }}>
        <Typography component="strong" fontWeight={600} sx={{ color: theme.palette.text.primary, fontSize: textSize }}>Governing Law:</Typography> This disclaimer is governed by the laws of India. Any disputes arising from the use of this website will be subject to the exclusive jurisdiction of the courts in India.
      </Typography>
      <Typography variant="body2" sx={{ fontSize: textSize, color: theme.palette.text.secondary, mt: 2 }}>
        By using this website, you acknowledge that you have read this disclaimer and agree to its terms.
      </Typography>
    </DisclaimerCard>
  );
};

export default Disclaimer; 