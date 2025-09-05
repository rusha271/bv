'use client';

import React, { useEffect, useState } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { Box, Typography, Container, TextField, MenuItem, Button } from '@mui/material';
import styles from '@/app/crop/cropPage.module.css';

const rashiOptions = [
  'Aries (Mesh)', 'Taurus (Vrishabh)', 'Gemini (Mithun)', 'Cancer (Kark)', 
  'Leo (Singh)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchik)', 
  'Sagittarius (Dhanu)', 'Capricorn (Makar)', 'Aquarius (Kumbh)', 'Pisces (Meen)'
];

function FadeInSection({ children }: { children: React.ReactNode }) {
  return <div className={styles.animateFadein}>{children}</div>;
}

export default function VastuForm() {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    rashi: '',
    address: '',
    contactNumber: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    birthdate: '',
    rashi: '',
    address: '',
    contactNumber: '',
  });

  useEffect(() => {
    // Check login status from localStorage
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() ? '' : 'Name is required',
      birthdate: formData.birthdate ? '' : 'Birthdate is required',
      rashi: formData.rashi ? '' : 'Rashi is required',
      address: formData.address.trim() ? '' : 'Address is required',
      contactNumber: formData.contactNumber.match(/^\d{10}$/) ? '' : 'Enter a valid 10-digit phone number',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Add your form submission logic here (e.g., API call)
    }
  };

  const sectionTitleSize = isMobile ? '0.9rem' : isTablet ? '1rem' : '1.1rem';
  const buttonFontSize = isMobile ? '0.8rem' : isTablet ? '0.9rem' : '1rem';
  const buttonPadding = isMobile ? '8px 16px' : isTablet ? '10px 20px' : '12px 24px';

  return (
    <div className={`${styles.pageContainer} ${styles.animateGradient}`} style={{ background: theme.palette.background.default }}>
      <div
        className={`${styles.backgroundGradient} ${styles.animateGradient}`}
        style={{
          background: 'linear-gradient(45deg, #E3F2FD, #FFF9C4, #FCE4EC)',
          ...(theme.palette.mode === 'dark' && { background: 'linear-gradient(45deg, #18181B, #27272A, #18181B)' }),
        }}
      />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ flexGrow: 1, py: { xs: 6, md: 8 }, mt: { xs: 7, md: 8 }, px: { xs: 2, md: 4 } }}
      >
        <Box
          className={styles.contentCard}
          sx={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            p: { xs: 4, md: 6 },
            boxShadow: theme.shadows[2],
          }}
        >
          <FadeInSection>
            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: theme.palette.primary.main,
                  fontSize: sectionTitleSize,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Enter Your Details
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '600px', mx: 'auto' }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 3 }}
                  InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                  InputProps={{ style: { color: theme.palette.text.primary } }}
                />
                <TextField
                  fullWidth
                  label="Birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleChange}
                  error={!!errors.birthdate}
                  helperText={errors.birthdate}
                  sx={{ mb: 3 }}
                  InputLabelProps={{ shrink: true, style: { color: theme.palette.text.secondary } }}
                  InputProps={{ style: { color: theme.palette.text.primary } }}
                />
                <TextField
                  fullWidth
                  select
                  label="Rashi (Zodiac Sign)"
                  name="rashi"
                  value={formData.rashi}
                  onChange={handleChange}
                  error={!!errors.rashi}
                  helperText={errors.rashi}
                  sx={{ mb: 3 }}
                  InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                  InputProps={{ style: { color: theme.palette.text.primary } }}
                >
                  {rashiOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Home Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  multiline
                  rows={3}
                  sx={{ mb: 3 }}
                  InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                  InputProps={{ style: { color: theme.palette.text.primary } }}
                />
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  sx={{ mb: 3 }}
                  InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                  InputProps={{ style: { color: theme.palette.text.primary } }}
                />
                <Button
                  type="submit"
                  className={`${styles.nextButton} ${styles.relativeOverflowHidden} ${styles.groupTransition} ${styles.groupHover} ${styles.buttonEnabled}`}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: theme.palette.primary.contrastText,
                    padding: buttonPadding,
                    fontSize: buttonFontSize,
                    boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'dark' ? '0 12px 40px rgba(59, 130, 246, 0.4)' : '0 12px 40px rgba(59, 130, 246, 0.3)',
                    },
                  }}
                >
                  <span className={styles.buttonContent}>✨ Submit</span>
                  <div className={styles.shimmerEffect} />
                </Button>
              </Box>
            </Box>
          </FadeInSection>
        </Box>
      </Container>
    </div>
  );
}