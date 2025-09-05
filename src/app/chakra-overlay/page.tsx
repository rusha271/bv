'use client';

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Box, Container, Typography } from '@mui/material';
import { sessionStorageManager } from '@/utils/sessionStorage';
import { CircularProgress, Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';
import { useLazyLoad } from '@/hooks/useLazyLoad';

const ChakraEditor = dynamic(() => import('@/components/Image Crop/ChakraEditor'), { ssr: false });

export default function ChakraOverlayPage() {
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use the custom lazy loading hook
  const chakraSection = useLazyLoad();

  useEffect(() => {
    // Clean up expired sessions
    sessionStorageManager.cleanupExpiredSessions();
    
    // Get session data
    const sessionData = sessionStorageManager.getSessionData();
    if (!sessionData) {
      setError('No floor plan session found. Please upload a floor plan first.');
      return;
    }
  
    // Use cropped image if available, otherwise use original image
    const imageUrl = sessionData.croppedImage?.blobUrl || sessionData.originalImage?.blobUrl;
    if (!imageUrl) {
      setError('No image found in session. Please upload a floor plan first.');
      return;
    }
    
    console.log('ChakraOverlay: Using image:', {
      hasCroppedImage: !!sessionData.croppedImage?.blobUrl,
      hasOriginalImage: !!sessionData.originalImage?.blobUrl,
      imageUrl: imageUrl.substring(0, 50) + '...'
    });
  
    setFloorPlanImageUrl(imageUrl);
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Navbar />
        <Container
          component="main"
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            mt: { xs: 8, sm: 10 },
            mb: { xs: 3, sm: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Session Error
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Navbar />
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          mt: { xs: 8, sm: 10 },
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Box ref={chakraSection.ref}>
          {chakraSection.isVisible ? (
            <ChakraEditor floorPlanImageUrl={floorPlanImageUrl} />
          ) : (
            <Box sx={{ 
              width: '100%', 
              height: '600px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: (theme) => theme.palette.background.paper,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexDirection: 'column'
            }}>
              <CircularProgress 
                size={48}
                sx={{ color: (theme) => theme.palette.primary.main, mb: 2 }}
              />
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                Loading Chakra Editor...
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}