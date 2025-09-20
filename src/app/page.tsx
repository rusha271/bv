'use client';
import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const HomePageClient = dynamic(() => import('./HomePageClient'), {
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)'
      }}
    >
      <CircularProgress size={60} sx={{ color: '#1976d2' }} />
    </Box>
  )
});

// Note: Metadata export is not supported in Client Components
// Metadata has been moved to layout.tsx

export default function Home() {
  return <HomePageClient />;
}