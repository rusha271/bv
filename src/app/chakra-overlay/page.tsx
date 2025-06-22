'use client';

import { useSearchParams } from 'next/navigation';
import { ChakraEditor } from '@/components/ui/ChakraEditor';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Box, Container } from '@mui/material';

export default function ChakraOverlayPage() {
  const searchParams = useSearchParams();
  const floorPlanImageUrl = searchParams.get('image'); // expects a URL

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