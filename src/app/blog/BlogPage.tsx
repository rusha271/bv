"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/contexts/ThemeContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BookOpen, Video, Headphones, Lightbulb, Sparkles } from 'lucide-react';

// Hook to prevent hydration issues
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
};

const BlogCardsList = dynamic(() => import('@/components/Card/BlogCardsList'), {
  ssr: true,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});
const VideoCardsList = dynamic(() => import('@/components/Card/VideoCardsList'), {
  ssr: true,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});
const BookCardsList = dynamic(() => import('@/components/Card/BookCardsList'), {
  ssr: true,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});
const PodcastCardsList = dynamic(() => import('@/components/Card/PodcastCardsList'), {
  ssr: true,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fadein" style={{ minHeight: 'auto', width: '100%' }}>
      {children}
    </div>
  );
}


function BlogTabs() {
  const { theme } = useThemeContext();
  const [tab, setTab] = useState(0);
  const isClient = useIsClient();

  // Use static responsive values to prevent hydration issues
  const tabFontSize = '1rem';
  const tabPaddingX = 2;

  const tabs = [
    { label: "Videos", icon: Video, index: 0 },
    { label: "Books", icon: BookOpen, index: 1 },
    { label: "Podcasts", icon: Headphones, index: 2 },
    { label: "Tips", icon: Lightbulb, index: 3 }
  ];

  return (
    <Box sx={{ width: '100%', mb: { xs: 0.5, sm: 1 } }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Blog content tabs"
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
          mb: 1,
          minHeight: { xs: 40, sm: 48 },
          '.MuiTabs-flexContainer': {
            justifyContent: { xs: 'flex-start', sm: 'center' },
            gap: 0.25,
          },
          '.MuiTabs-scrollButtons': {
            color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1e40af',
            '&.Mui-disabled': { opacity: 0.3 },
          },
          '.MuiTabs-indicator': {
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
            height: 3,
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(96, 165, 250, 0.3)'
              : '0 2px 8px rgba(30, 64, 175, 0.3)',
          },
        }}
      >
        {tabs.map(({ label, icon: IconComponent, index }) => (
          <Tab 
            key={label}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconComponent size={18} className={theme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                <span>{label}</span>
              </Box>
            }
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }, 
              color: theme.palette.text.primary, 
              minHeight: { xs: 44, sm: 52 }, 
              px: { xs: 1.5, sm: 2, md: 2.5 },
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1e40af',
                transform: 'translateY(-1px)',
              },
              '&.Mui-selected': {
                color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1e40af',
                fontWeight: 700,
              }
            }} 
          />
        ))}
      </Tabs>
      <Box sx={{ 
        mt: 0.5, 
        minHeight: 'auto', 
        px: { xs: 0.5, sm: 1, md: 2 }, 
        overflowX: 'hidden', 
        overflowY: 'auto',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {tab === 0 && (
          <FadeInSection>
            <VideoCardsList />
          </FadeInSection>
        )}
        {tab === 1 && (
          <FadeInSection>
            <BookCardsList />
          </FadeInSection>
        )}
        {tab === 2 && (
          <FadeInSection>
            <PodcastCardsList />
          </FadeInSection>
        )}
        {tab === 3 && (
          <FadeInSection>
            <BlogCardsList />
          </FadeInSection>
        )}
    </Box>
    </Box>
  );
}

export default function BlogPage() {
  const { theme } = useThemeContext();
  const isClient = useIsClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe theme fallback for SSR
  const safeTheme = theme || {
    palette: {
      mode: 'light' as const,
      primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrastText: '#ffffff' },
      secondary: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2', contrastText: '#ffffff' },
      background: { default: '#ffffff', paper: '#ffffff' },
      text: { primary: '#000000', secondary: '#666666' },
      divider: '#e0e0e0'
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        background: safeTheme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Animated gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: safeTheme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
            : 'linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)',
          animation: 'gradientShift 8s ease-in-out infinite',
          '@keyframes gradientShift': {
            '0%, 100%': {
              opacity: 0.3,
              transform: 'scale(1)',
            },
            '50%': {
              opacity: 0.6,
              transform: 'scale(1.1)',
            },
          },
        }}
      />
      
      <Navbar />
      
      {/* Main content container */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: '100vw',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2, md: 3 },
          pt: { xs: '7rem', sm: '8rem', md: '4.9rem' },
          position: 'relative',
          zIndex: 1,
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Box
          sx={{
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.1)'
              : '1px solid rgba(148, 163, 184, 0.2)',
            p: { xs: 1.5, sm: 2, md: 3 },
            width: '100%',
            maxWidth: '100%',
            minHeight: 'calc(100vh - 12rem)',
            overflowX: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: 2,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Sparkles 
                  size={35} 
                  className={safeTheme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} 
                />
              </Box>
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: safeTheme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                  : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                mb: 0.5,
              }}
            >
              Explore Vastu Resources
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              Discover videos, books, podcasts, and tips to enhance your understanding of Vastu
            </Typography>
          </Box>
          
          <BlogTabs />
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}
