"use client";

import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';
import PostUploadSection from '@/components/PostUploadSection';
const BlogCardsList = dynamic(() => import('@/components/BlogCardsList'), {
  ssr: true,
  loading: () => <div style={{ height: '200px', textAlign: 'center' }}>Loading...</div>,
});
const VideoCardsList = dynamic(() => import('@/components/VideoCardsList'), {
  ssr: true,
  loading: () => <div style={{ height: '200px', textAlign: 'center' }}>Loading...</div>,
});
const BookCardsList = dynamic(() => import('@/components/BookCardsList'), {
  ssr: true,
  loading: () => <div style={{ height: '200px', textAlign: 'center' }}>Loading...</div>,
});
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fadein" style={{ minHeight: '200px' }}>
      {children}
    </div>
  );
}


function BlogTabs() {
  const { theme } = useThemeContext();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const [tab, setTab] = useState(0);

  const tabFontSize = isMobile ? '0.95rem' : isTablet ? '1.05rem' : '1.15rem';
  const tabPaddingX = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <Box sx={{ width: '100%', mb: { xs: 2, sm: 4 } }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Blog content tabs"
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 16,
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 16px #23234f' : '0 2px 16px #e5e7eb',
          border: `1.5px solid ${theme.palette.divider}`,
          mb: 2,
          minHeight: isMobile ? 44 : 56,
          '.MuiTabs-flexContainer': {
            justifyContent: { xs: 'flex-start', sm: 'center' },
          },
          '.MuiTabs-scrollButtons': {
            color: theme.palette.text.primary,
            '&.Mui-disabled': { opacity: 0.3 },
          },
          '.MuiTabs-indicator': {
            transform: 'scaleX(0.8)',
            transformOrigin: 'center',
            height: 4,
            borderRadius: 2,
          },
        }}
      >
        <Tab label="Videos" sx={{ fontWeight: 700, fontSize: tabFontSize, color: theme.palette.text.primary, minHeight: isMobile ? 44 : 56, px: tabPaddingX }} />
        <Tab label="Books" sx={{ fontWeight: 700, fontSize: tabFontSize, color: theme.palette.text.primary, minHeight: isMobile ? 44 : 56, px: tabPaddingX }} />
        <Tab label="Tips" sx={{ fontWeight: 700, fontSize: tabFontSize, color: theme.palette.text.primary, minHeight: isMobile ? 44 : 56, px: tabPaddingX }} />
        <Tab label="Posts" sx={{ fontWeight: 700, fontSize: tabFontSize, color: theme.palette.text.primary, minHeight: isMobile ? 44 : 56, px: tabPaddingX }} />
      </Tabs>
      <Box sx={{ mt: 2, minHeight: 300, px: { xs: 2, sm: 2, md: 4 }, overflowX: 'hidden' }}>
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
            <BlogCardsList />
          </FadeInSection>
        )}
        {tab === 3 && (
          <FadeInSection>
            <PostUploadSection />
          </FadeInSection>
        )}
      </Box>
    </Box>
  );
}
export default function BlogPage() {
  const { theme } = useThemeContext();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const sectionTitleSize = isMobile ? '1.25rem' : isTablet ? '1.75rem' : '2.25rem';

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: theme.palette.background.default }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900" />
      <Navbar />
      {/* Main content container */}
      <main
        className="flex-1 w-full max-w-6xl mx-auto rounded-xl shadow-md px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 box-border"

        style={{
          background: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          minHeight: '80vh', // Prevent shifting by reserving height
          marginTop: isMobile ? '4.5rem' : '5.5rem',
          marginBottom: isMobile ? '1.5rem' : '2.5rem',
        }}
      >
        <h2
          className="font-bold mb-4 text-center"
          style={{
            color: theme.palette.primary.main,
            fontSize: sectionTitleSize,
            fontFamily: '"Roboto", sans-serif', // Fallback font
          }}
        >
          Explore Vastu Resources
        </h2>
        <BlogTabs />
      </main>
      <Footer />
    </div>
  );
}
