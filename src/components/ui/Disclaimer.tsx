'use client';
import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';

const DisclaimerCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(8px)',
  overflowY: 'auto', // Ensure scrollable if content overflows
  maxHeight: '400px', // Example max height, adjust as needed
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.3)',
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
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: titleSize, color: theme.palette.primary.main }}>
        Disclaimer
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