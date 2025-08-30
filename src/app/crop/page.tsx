// src/pages/cropPage.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ImageCropper from '@/components/ui/ImageCropper';
import { Box, Typography, Container, Skeleton , CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import styles from './cropPage.module.css';
import Disclaimer from '@/components/ui/Disclaimer';
import { sessionStorageManager } from '@/utils/sessionStorage';
import { Dialog, DialogContent } from '@mui/material'; // Add Dialog and DialogContent if not already imported

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Lazy load components
const Vastu3DAnimation = React.lazy(() => import('@/components/ui/Vastu3DAnimation'));
const ZodiacSignsDisplay = React.lazy(() => import('@/components/ui/ZodiacSignsDisplay'));

function FadeInSection({ children }: { children: React.ReactNode }) {
  return <div className={styles.animateFadein}>{children}</div>;
}

// Lazy loading hook
function useLazyLoad() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return { ref, isVisible, isLoaded, handleLoad };
}

export default function CropPage() {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [cropData, setCropData] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [hasCropped, setHasCropped] = useState(false);

  // Lazy loading hooks for different sections
  const vastuSection = useLazyLoad();
  const zodiacSection = useLazyLoad();
  const cropSection = useLazyLoad();

  useEffect(() => {
    // Clean up expired sessions
    sessionStorageManager.cleanupExpiredSessions();
    
    // Get session data
    const data = sessionStorageManager.getSessionData();
    if (!data || !data.originalImage) {
      setErrorMessage('No floor plan session found. Please upload a floor plan from the home page.');
      return;
    }
    
    setSessionData(data);
    console.log('CropPage: Session data loaded', data);
  }, []);

  const handleCrop = useCallback((cropData: any, userInteracted: boolean, croppedImageUrl?: string) => {
    console.log('CropPage: handleCrop called with:', { cropData, userInteracted, croppedImageUrl });
    
    if (cropData && userInteracted && croppedImageUrl) {
      setCroppedUrl(croppedImageUrl);
      setCropData(cropData); // Store cropData
      setHasCropped(true);
      console.log('CropPage: croppedUrl set to', croppedImageUrl.substring(0, 50) + '...', 'cropData:', cropData);
    } else {
      setCroppedUrl(null);
      setCropData(null);
      setHasCropped(false);
      console.log('CropPage: croppedUrl reset to null');
    }
  }, []);

  const handleNext = async () => {
    try {
      setIsProcessing(true);
      setProcessingError(null);
      setErrorDialogOpen(false);
  
      console.log('handleNext: Starting with croppedUrl:', croppedUrl ? 'exists' : 'null', 'cropData:', cropData);
  
      if (!sessionData?.originalImage) {
        throw new Error('Please upload an image before proceeding.');
      }
      
      // Check if user has cropped the image
      if (croppedUrl && cropData) {
        // User has cropped the image, use the cropped version
        console.log('handleNext: Using cropped image', croppedUrl.substring(0, 50) + '...');
        
        // Convert cropped URL to blob and store
        const response = await fetch(croppedUrl);
        const croppedBlob = await response.blob();
        
        const croppedBlobUrl = URL.createObjectURL(croppedBlob);
        
        console.log('handleNext: Cropped blob created, size:', croppedBlob.size);
        
        // Store the cropped image in session
        sessionStorageManager.storeCroppedImage(croppedBlobUrl, cropData);
        
        router.push('/chakra-overlay');
        return;
      }
      
      // If no cropping is done, use the original image
      console.log('handleNext: Using original image (no crop)');
      const originalBlobUrl = sessionData.originalImage.blobUrl;
      
      // Convert blob URL to blob for storage
      const response = await fetch(originalBlobUrl);
      const blob = await response.blob();
      const newBlobUrl = URL.createObjectURL(blob);
      
      console.log('handleNext: Original blob created, size:', blob.size);
      
      // Store original image as cropped (no crop applied)
      sessionStorageManager.storeCroppedImage(newBlobUrl, {
        area: 0,
        centroid: { x: 0, y: 0 }
      });
      
      router.push('/chakra-overlay');
      
    } catch (error) {
      console.error('Error processing crop:', error);
      setProcessingError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      setErrorDialogOpen(true);
    } finally {
      setIsProcessing(false);
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
              <Typography variant="h4" sx={{ color: theme.palette.error.main, fontWeight: 700, mb: 2, fontSize: sectionTitleSize }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4, fontSize: isMobile ? '1rem' : '1.1rem' }}>
                {errorMessage}
              </Typography>
              <button
                onClick={handleNext}
                className={`${styles.nextButton} ${styles.relativeOverflowHidden} ${styles.groupTransition} ${styles.groupHover} ${sessionData ? styles.buttonEnabled : styles.buttonDisabled}`}
                style={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: theme.palette.primary.contrastText,
                  padding: buttonPadding,
                  fontSize: buttonFontSize,
                  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)',
                  cursor: sessionData ? 'pointer' : 'not-allowed',
                  opacity: sessionData ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (sessionData) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' ? '0 12px 40px rgba(59, 130, 246, 0.4)' : '0 12px 40px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sessionData) {
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
            {sessionData?.originalImage ? (
              <ImageCropper imageUrl={sessionData.originalImage.blobUrl} onCropComplete={handleCrop} />
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No image to display
              </Typography>
            )}
          </Box>

          {/* Status indicator */}
          {hasCropped && (
            <Box sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 2, 
              background: theme.palette.success.light + '20', 
              border: `1px solid ${theme.palette.success.main}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                ✅ Image cropped successfully! Ready to proceed.
              </Typography>
            </Box>
          )}

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
              <span className={styles.buttonContent}>
                {hasCropped ? '✨ Proceed with Cropped Image' : '✨ Next Step'}
              </span>
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
            <Box ref={cropSection.ref} sx={{ flex: 1, height: '100%' }}>  
              {cropSection.isVisible ? (
                PageContent()
              ) : (
                <Box sx={{ 
                  width: '100%', 
                  height: '500px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: theme.palette.background.paper,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height="100%" 
                    animation="wave"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
              )}
            </Box>
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
          
          {/* Lazy loaded Vastu3DAnimation */}
          <Box ref={vastuSection.ref} sx={{ width: '100%', mt: 4 }}>
            {vastuSection.isVisible ? (
              <React.Suspense fallback={
                <Box sx={{ 
                  width: '100%', 
                  height: '300px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: theme.palette.background.paper,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  flexDirection: 'column'
                }}>
                  <CircularProgress 
                    size={48}
                    sx={{ color: theme.palette.primary.main, mb: 2 }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    Loading Vastu animation...
                  </Typography>
                </Box>
              }>
                <Vastu3DAnimation />
              </React.Suspense>
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                flexDirection: 'column'
              }}>
                <CircularProgress 
                  size={48}
                  sx={{ color: theme.palette.primary.main, mb: 2 }}
                />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  Loading Vastu animation...
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Lazy loaded ZodiacSignsDisplay */}
          <Box ref={zodiacSection.ref} sx={{ width: '100%', mt: 4 }}>
            {zodiacSection.isVisible ? (
              <React.Suspense fallback={
                <Box sx={{ 
                  width: '100%', 
                  height: '400px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: theme.palette.background.paper,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  flexDirection: 'column'
                }}>
                  <CircularProgress 
                    size={48}
                    sx={{ color: theme.palette.primary.main, mb: 2 }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    Loading zodiac signs...
                  </Typography>
                </Box>
              }>
                <ZodiacSignsDisplay />
              </React.Suspense>
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                flexDirection: 'column'
              }}>
                <CircularProgress 
                  size={48}
                  sx={{ color: theme.palette.primary.main, mb: 2 }}
                />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  Loading zodiac signs...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
      <Footer />
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4, 
            boxShadow: 12, 
            background: theme.palette.background.paper 
          },
        }}
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} color="error.main" mb={2}>
            Processing Error
          </Typography>
          <Typography variant="body1" color="text.secondary" whiteSpace="pre-line" sx={{ mb: 3 }}>
            {processingError}
          </Typography>
          <button
            onClick={handleNext}
            disabled={isProcessing}
            className={`${styles.nextButton} ${styles.relativeOverflowHidden} ${styles.groupTransition} ${styles.groupHover} ${isProcessing ? styles.buttonDisabled : styles.buttonEnabled}`}
            style={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: theme.palette.primary.contrastText,
              padding: buttonPadding,
              fontSize: buttonFontSize,
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)',
              opacity: isProcessing ? 0.6 : 1,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' ? '0 12px 40px rgba(59, 130, 246, 0.4)' : '0 12px 40px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' ? '0 8px 32px rgba(59, 130, 246, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.2)';
              }
            }}
          >
            <span className={styles.buttonContent}>
              {isProcessing ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                  Processing...
                </>
              ) : (
                '✨ Next Step'
              )}
            </span>
            <div className={styles.shimmerEffect} />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}