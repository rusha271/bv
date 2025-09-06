"use client";

import React, { useEffect, useState } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { Video } from '@/utils/apiService';
import VideoModal from '@/components/Video/VideoModal';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { generateBreadcrumbStructuredData } from '@/utils/seoUtils';

interface VideoPageProps {
  video: Video;
}

export default function VideoPage({ video }: VideoPageProps) {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Construct full URLs from backend response
  const videoUrl = video.url?.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${video.url}`
    : video.url;

  const thumbnailUrl = (video.thumbnail_url || video.thumbnail)?.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${video.thumbnail_url || video.thumbnail}`
    : (video.thumbnail_url || video.thumbnail);

  const handleWatchVideo = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Videos', url: '/blog' },
    { name: video.title, url: `/video/${video.id}` }
  ]);

  useEffect(() => {
    // Add breadcrumb structured data to document head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [breadcrumbData]);

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
          minHeight: '80vh',
          marginTop: isMobile ? '4.5rem' : '5.5rem',
          marginBottom: isMobile ? '1.5rem' : '2.5rem',
        }}
      >
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a
                href="/"
                className="hover:underline"
                style={{ color: theme.palette.primary.main }}
              >
                Home
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <a
                href="/blog"
                className="hover:underline"
                style={{ color: theme.palette.primary.main }}
              >
                Videos
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-500 truncate">{video.title}</li>
          </ol>
        </nav>

        {/* Video Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              {thumbnailUrl ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer group" onClick={handleWatchVideo}>
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      <svg
                        className="w-10 h-10 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-sm px-3 py-1 rounded">
                      {video.duration}
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center rounded-lg cursor-pointer"
                  style={{
                    background: theme.palette.background.default,
                    color: theme.palette.text.secondary,
                  }}
                  onClick={handleWatchVideo}
                >
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <p className="text-lg font-medium">Click to Watch Video</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-6">
              <h1
                className="text-2xl lg:text-3xl font-bold mb-4"
                style={{ color: theme.palette.text.primary }}
              >
                {video.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                {video.duration && (
                  <span style={{ color: theme.palette.text.secondary }}>
                    Duration: {video.duration}
                  </span>
                )}
                {video.category && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    }}
                  >
                    {video.category}
                  </span>
                )}
                {video.created_at && (
                  <span style={{ color: theme.palette.text.secondary }}>
                    Uploaded: {new Date(video.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              <p
                className="text-base leading-relaxed"
                style={{ color: theme.palette.text.secondary }}
              >
                {video.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="p-6 rounded-lg border"
              style={{
                background: theme.palette.background.paper,
                borderColor: theme.palette.divider,
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.palette.text.primary }}
              >
                Video Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    Category:
                  </span>
                  <p style={{ color: theme.palette.text.primary }}>
                    {video.category || 'Vastu Shastra'}
                  </p>
                </div>
                
                {video.duration && (
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Duration:
                    </span>
                    <p style={{ color: theme.palette.text.primary }}>
                      {video.duration}
                    </p>
                  </div>
                )}
                
                {video.created_at && (
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Upload Date:
                    </span>
                    <p style={{ color: theme.palette.text.primary }}>
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleWatchVideo}
                className="w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }}
              >
                Watch Video
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Video Modal */}
      <VideoModal
        video={video}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
