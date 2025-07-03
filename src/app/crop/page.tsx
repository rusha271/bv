// src/pages/cropPage.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ImageCropper from '@/components/ui/ImageCropper';
import Vastu3DAnimation from '@/components/ui/Vastu3DAnimation';
import ZodiacSignsDisplay from '@/components/ui/ZodiacSignsDisplay';
import { Box, Typography, Container } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './cropPage.module.css';
import Disclaimer from '@/components/ui/Disclaimer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.animateFadein}>
      {children}
    </div>
  );
}

export default function CropPage() {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  // Set error if no image URL is provided
  useEffect(() => {
    if (!imageUrl) {
      setErrorMessage('No image found. Please upload a floor plan from the home page.');
    }
    console.log('CropPage: imageUrl', imageUrl);
  }, [imageUrl]);

  const handleCrop = useCallback((cropData: any, userInteracted: boolean) => {
    if (!imageUrl || !cropData || !cropData.width || !cropData.height || !userInteracted) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = cropData.width;
      canvas.height = cropData.height;

      ctx.drawImage(
        img,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        cropData.width,
        cropData.height
      );

      const newCroppedUrl = canvas.toDataURL('image/png');
      setCroppedUrl(newCroppedUrl);
    };
  }, [imageUrl]);

  const handleNext = () => {
    const urlToUse = croppedUrl || imageUrl;
    if (urlToUse) {
      fetch(urlToUse)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          router.push(`/chakra-overlay?image=${encodeURIComponent(blobUrl)}`);
        })
        .catch((error) => {
          console.error('Error creating blob URL:', error);
          setErrorMessage('Error processing the image. Please try again.');
        });
    }
  };

  const sectionTitleSize = isMobile ? '1.5rem' : isTablet ? '2rem' : '2.5rem';
  const buttonFontSize = isMobile ? '0.9rem' : isTablet ? '1rem' : '1.1rem';
  const buttonPadding = isMobile ? '12px 24px' : isTablet ? '14px 28px' : '16px 32px';

  const PageContent = () => {
    if (errorMessage) {
      return (
        <FadeInSection>
          <Box className={styles.errorContainer}>
            <div
              className={styles.errorCard}
              style={{
                color: theme.palette.text.secondary,
                background: theme.palette.background.paper,
                borderColor: theme.palette.divider,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.error.main,
                  fontWeight: 700,
                  mb: 2,
                  fontSize: sectionTitleSize,
                }}
              >
                Oops! Something went wrong
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                }}
              >
                {errorMessage}
              </Typography>
              <button
                onClick={() => router.push('/')}
                className={`${styles.relativeOverflowHidden} ${styles.groupTransition} ${styles.groupHover}`}
                style={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: theme.palette.primary.contrastText,
                  border: 'none',
                  borderRadius: '16px',
                  padding: buttonPadding,
                  fontSize: buttonFontSize,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(59, 130, 246, 0.3)'
                    : '0 8px 32px rgba(59, 130, 246, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.palette.mode === 'dark'
                    ? '0 12px 40px rgba(59, 130, 246, 0.4)'
                    : '0 12px 40px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(59, 130, 246, 0.3)'
                    : '0 8px 32px rgba(59, 130, 246, 0.2)';
                }}
              >
                <span className={styles.buttonContent}>Go to Home</span>
                <div className={styles.shimmerEffect} />
              </button>
            </div>
          </Box>
        </FadeInSection>
      );
    }

    return (
      <FadeInSection>
        <Box sx={{ textAlign: 'center', flexGrow: 1, minHeight: '500px' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.main,
              fontSize: sectionTitleSize,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Crop Your Floor Plan
          </Typography>

          {/* Image Cropper Container */}
          <Box
            className={styles.imageDisplayContainer}
            sx={{
              width: '100%',
              height: '100%',
              mb: 4,
              background: theme.palette.background.paper,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              borderColor: theme.palette.divider,
              '&::before': {
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
              },
            }}
          >
            {imageUrl ? (
              <ImageCropper imageUrl={imageUrl} onCropComplete={handleCrop} />
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No image to display
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Box className={styles.actionButtons}>
            <button
              onClick={handleNext}
              className={`${styles.nextButton} ${styles.relativeOverflowHidden} ${styles.groupTransition} ${styles.groupHover} ${styles.buttonEnabled}`}
              style={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: theme.palette.primary.contrastText,
                padding: buttonPadding,
                fontSize: buttonFontSize,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(59, 130, 246, 0.3)'
                  : '0 8px 32px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.palette.mode === 'dark'
                  ? '0 12px 40px rgba(59, 130, 246, 0.4)'
                  : '0 12px 40px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(59, 130, 246, 0.3)'
                  : '0 8px 32px rgba(59, 130, 246, 0.2)';
              }}
            >
              <span className={styles.buttonContent}>✨ Next Step</span>
              <div className={styles.shimmerEffect} />
            </button>
          </Box>
        </Box>
      </FadeInSection>
    );
  };

  return (
    <div className={`${styles.pageContainer} ${styles.animateGradient}`} style={{ background: theme.palette.background.default }}>
      <div
        className={`${styles.backgroundGradient} ${styles.animateGradient}`}
        style={{
          background: 'linear-gradient(45deg, #E3F2FD, #FFF9C4, #FCE4EC)',
          ...(theme.palette.mode === 'dark' && {
            background: 'linear-gradient(45deg, #18181B, #27272A, #18181B)',
          }),
        }}
      />
      <Navbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          height: '100%',
          py: { xs: 6, md: 8 },
          mt: { xs: 7, md: 8 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          className={styles.contentCard}
          sx={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            p: { xs: 4, md: 6 },
            flexGrow: 1,
            height: '100%',
            '&::before': {
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            },
          }}
        >
          {/* Top section with crop and info boxes */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
            {/* Left side - Crop section */}
            <Box sx={{ flex: 1, height: '100%' }}>{PageContent()}</Box>
            
            {/* Right side - Info boxes */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[2],
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                >
                  Before analyzing the Vastu
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    color: theme.palette.text.secondary,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                  }}
                >
                  Please crop the white space from the floorplan/floor blueprint image border.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  Steps to crop the selected image:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography
                    component="li"
                    sx={{
                      mb: 1,
                      color: theme.palette.text.secondary,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                    }}
                  >
                    Drag on the image to select the area (preview updates in real-time).
                  </Typography>
                  <Typography
                    component="li"
                    sx={{
                      mb: 1,
                      color: theme.palette.text.secondary,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                    }}
                  >
                    Use undo/redo buttons to adjust your selection.
                  </Typography>
                  <Typography
                    component="li"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                    }}
                  >
                    Click Next button to proceed
                  </Typography>
                </Box>
              </Box>
              <Disclaimer />
            </Box>
          </Box>

          {/* Bottom section - Full width 3D animation */}
          <Box sx={{ width: '100%', mt: 4 }}>
            <Vastu3DAnimation />
          </Box>

          {/* Zodiac Signs Display */}
          <Box sx={{ width: '100%', mt: 4 }}>
            <ZodiacSignsDisplay />
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
} 