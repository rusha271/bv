'use client';

import { useEffect, useState } from 'react';
import { ChakraEditor } from '@/components/ui/ChakraEditor';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Box, Container, Typography } from '@mui/material';
import { sessionStorageManager } from '@/utils/sessionStorage';

export default function ChakraOverlayPage() {
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up expired sessions
    sessionStorageManager.cleanupExpiredSessions();
    
    // Get session data
    const sessionData = sessionStorageManager.getSessionData();
    if (!sessionData) {
      setError('No floor plan session found. Please upload a floor plan first.');
      return;
    }

    // Use cropped image if available, otherwise use original
    const imageUrl = sessionData.croppedImage?.blobUrl || sessionData.originalImage?.blobUrl;
    if (!imageUrl) {
      setError('No image found in session. Please upload a floor plan first.');
      return;
    }

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChakraEditor floorPlanImageUrl={floorPlanImageUrl} />
      </Container>
      <Footer />
    </Box>
  );
}