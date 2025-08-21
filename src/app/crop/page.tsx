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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function FadeInSection({ children }: { children: React.ReactNode }) {
  return <div className={styles.animateFadein}>{children}</div>;
}

export default function CropPage() {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [cropData, setCropData] = useState<any>(null); // Store cropData to access area and centroid

  useEffect(() => {
    if (!imageUrl) {
      setErrorMessage('No image found. Please upload a floor plan from the home page.');
    }
    console.log('CropPage: imageUrl', imageUrl);
  }, [imageUrl]);

  const handleCrop = useCallback((cropData: any, userInteracted: boolean, croppedImageUrl?: string) => {
    if (cropData && userInteracted && croppedImageUrl) {
      setCroppedUrl(croppedImageUrl);
      setCropData(cropData); // Store cropData
      console.log('CropPage: croppedUrl set to', croppedImageUrl, 'cropData:', cropData);
    } else {
      setCroppedUrl(null);
      setCropData(null);
      console.log('CropPage: croppedUrl reset to null');
    }
  }, []);

  const handleNext = () => {
    if (!imageUrl) {
      setErrorMessage('Please upload an image before proceeding.');
      console.log('handleNext: No imageUrl, showing error');
      return;
    }
    if (!croppedUrl && !cropData) {
      // If no cropping is done, use the original imageUrl
      console.log('handleNext: Using original imageUrl', imageUrl);
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const queryParams = new URLSearchParams({
            image: blobUrl,
            area: '0',
            centroidX: '0',
            centroidY: '0',
          });
          router.push(`/chakra-overlay?${queryParams.toString()}`);
        })
        .catch((error) => {
          console.error('Error creating blob URL:', error);
          setErrorMessage('Error processing the image. Please try again.');
        });
      return;
    }
    if (!croppedUrl) {
      setErrorMessage('Please crop the image before proceeding.');
      console.log('handleNext: No croppedUrl, showing error');
      return;
    }
    console.log('handleNext: Using croppedUrl', croppedUrl);
    fetch(croppedUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const queryParams = new URLSearchParams({
          image: blobUrl,
          area: cropData?.area?.toString() || '0',
          centroidX: cropData?.centroid?.x?.toString() || '0',
          centroidY: cropData?.centroid?.y?.toString() || '0',
        });
        router.push(`/chakra-overlay?${queryParams.toString()}`);
      })
      .catch((error) => {
        console.error('Error creating blob URL:', error);
        setErrorMessage('Error processing the image. Please try again.');
      });
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
              <Typography variant="h4" sx={{ color: theme.palette.error.main, fontWeight: 700, mb: 2, fontSize: sectionTitleSize }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4, fontSize: isMobile ? '1rem' : '1.1rem' }}>
                {errorMessage}
              </Typography>
              <button
                onClick={handleNext}
                className={`${styles.nextButton} ${styles.relativeOverflowHidden} ${styles.groupTransition} ${styles.groupHover} ${imageUrl ? styles.buttonEnabled : styles.buttonDisabled}`}
                style={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: theme.palette.primary.contrastText,
                  padding: buttonPadding,
                  fontSize: buttonFontSize,
                  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)',
                  cursor: imageUrl ? 'pointer' : 'not-allowed',
                  opacity: imageUrl ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (imageUrl) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' ? '0 12px 40px rgba(59, 130, 246, 0.4)' : '0 12px 40px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (imageUrl) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)';
                  }
                }}
              >
                <span className={styles.buttonContent}>✨ Next Step</span>
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

          <Box
            className={styles.imageDisplayContainer}
            sx={{
              width: '100%',
              height: '100%',
              mb: 4,
              background: theme.palette.background.paper,
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
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

          <Box className={styles.actionButtons}>
            <button
              onClick={handleNext}
              className={`${styles.nextButton} ${styles.relativeOverflowHidden} ${styles.groupTransition} ${styles.groupHover} ${styles.buttonEnabled}`}
              style={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: theme.palette.primary.contrastText,
                padding: buttonPadding,
                fontSize: buttonFontSize,
                boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' ? '0 12px 40px rgba(59, 130, 246, 0.4)' : '0 12px 40px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)';
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
          ...(theme.palette.mode === 'dark' && { background: 'linear-gradient(45deg, #18181B, #27272A, #18181B)' }),
        }}
      />
      <Navbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ flexGrow: 1, height: '100%', py: { xs: 6, md: 8 }, mt: { xs: 7, md: 8 }, px: { xs: 2, md: 4 } }}
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
            <Box sx={{ flex: 1, height: '100%' }}>{PageContent()}</Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box
                sx={{ p: 3, borderRadius: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[2] }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
                  Before analyzing the Vastu
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: theme.palette.text.secondary, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Please crop the white space from the floorplan/floor blueprint image border.
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}>
                  Steps to crop the selected image:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" sx={{ mb: 1, color: theme.palette.text.secondary, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    Drag on the image to select the area (preview updates in real-time).
                  </Typography>
                  <Typography component="li" sx={{ mb: 1, color: theme.palette.text.secondary, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    Use undo/redo buttons to adjust your selection.
                  </Typography>
                  <Typography component="li" sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    Click Next button to proceed
                  </Typography>
                </Box>
              </Box>
              <Disclaimer />
            </Box>
          </Box>
          <Box sx={{ width: '100%', mt: 4 }}>
            <Vastu3DAnimation />
          </Box>
          <Box sx={{ width: '100%', mt: 4 }}>
            <ZodiacSignsDisplay />
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}