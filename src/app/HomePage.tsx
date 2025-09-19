'use client';
import { useState, useEffect } from "react";
import { Form } from "@/components/forms/Form";
import { FileUploadInput } from "@/components/forms/FileUploadInput";
// import Navbar from "@/components/ui/Navbar";
// Make SocialIcons client-only to prevent hydration issues
const ClientSocialIcons = dynamic(() => import('@/components/Icons/SocialIcons'), { 
  ssr: false,
  loading: () => null
});
import { Box, Typography, Card, Container, Fade, IconButton, Dialog, CircularProgress, DialogContent, Button } from "@mui/material";
// import { Suspense } from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import * as yup from "yup";
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { sessionStorageManager } from '@/utils/sessionStorage';
import { apiService } from '@/utils/apiService';
import { sessionCache } from '@/utils/apiCache';

const ProductTour = dynamic(() => import('@/components/Tour/ProductTour'), { 
  ssr: false,
  loading: () => null
});

// Make Navbar client-only to prevent hydration issues
const ClientNavbar = dynamic(() => import('@/components/ui/Navbar'), { 
  ssr: false,
  loading: () => (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1100,
      height: '64px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    }} />
  )
});


const validationSchema = yup.object({
  floorPlan: yup
    .mixed()
    .test("fileType", "Only png, jpg, jpeg files are allowed", (value) => {
      if (!value || !(value instanceof FileList) || value.length === 0) return false;
      const file = value[0];
      return ["image/png", "image/jpg", "image/jpeg"].includes(file.type);
    })
    .required("Floor plan is required"),
});

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [tourVideoUrl, setTourVideoUrl] = useState<string>('');
  const { theme } = useThemeContext();
  const router = useRouter();

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

  // Fetch tour video from API with caching (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const fetchTourVideo = async () => {
      try {
        // Check cache first
        const cachedVideoUrl = sessionCache.get('tour_video_url');
        if (cachedVideoUrl) {
          setTourVideoUrl(cachedVideoUrl);
          return;
        }

        const response = await apiService.siteSettings.getLatestByCategory('tour_video');
        const relativeUrl = response.file_url || response.data?.public_url || response.data?.file_path;
        if (relativeUrl) {
          const baseUrl = apiService.getBaseURL();
          const fullVideoUrl = `${baseUrl}${relativeUrl}`;
          setTourVideoUrl(fullVideoUrl);
          // Cache the URL for 1 hour
          sessionCache.set('tour_video_url', fullVideoUrl, 60 * 60 * 1000);
        }
      } catch (error) {
        // console.log('No tour video found, using default:', error);
        // Keep empty string as fallback
      }
    };

    fetchTourVideo();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setSubmitted(true);
      setProcessingError(null);
      setIsProcessing(true);
      setErrorDialogOpen(false);
  
      const file = data.floorPlan[0];
      if (!file) {
        throw new Error("No file selected");
      }
  
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size too large. Please upload an image smaller than 10MB.");
      }
  
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        try {
          if (!e.target?.result) {
            throw new Error("Failed to read file");
          }
  
          // Create a blob URL for the image
          const blob = await fetch(e.target.result as string).then(r => r.blob());
          const blobUrl = URL.createObjectURL(blob);
          
          // Generate a consistent ID for the image (client-side only)
          const imageId = typeof window !== 'undefined' 
            ? `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            : `img_${Date.now()}_static`;
          
          // Store the image data locally with 1-hour expiration (client-side only)
          if (typeof window !== 'undefined') {
            sessionStorageManager.storeOriginalFloorPlan(file, imageId, blobUrl);
          }
          
          // Navigate to crop page
          router.push('/crop');
          setIsProcessing(false);
          setSubmitted(false);
          
        } catch (error) {
          // console.error('Error processing image:', error);
          setProcessingError("Error processing the image. Please try again.");
          setErrorDialogOpen(true);
          setIsProcessing(false);
          setSubmitted(false);
        }
      };
  
      reader.onerror = () => {
        setProcessingError("Error reading the file. Please try again.");
        setErrorDialogOpen(true);
        setIsProcessing(false);
        setSubmitted(false);
      };
  
      reader.readAsDataURL(file);
    } catch (error) {
      // console.error('Error in form submission:', error);
      setProcessingError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      setErrorDialogOpen(true);
      setIsProcessing(false);
      setSubmitted(false);
    }
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  // Use consistent structure to prevent hydration mismatch
  const renderContent = () => {
    return (
      <Card
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          boxShadow: safeTheme.palette.mode === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: safeTheme.palette.mode === "dark"
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          minWidth: { xs: "90vw", sm: 400 },
          maxWidth: { xs: "90vw", sm: 480 },
          backdropFilter: "blur(20px)",
          border: safeTheme.palette.mode === 'dark'
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
        }}
        className="file-upload-card"
      >
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{ 
            textAlign: "center", 
            mb: 2,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            lineHeight: 1.3,
          }}
        >
          Check Vastu from your Floor Plan
        </Typography>
        <Form
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          defaultValues={{ floorPlan: null }}
          submitButtonText={isProcessing || submitted ? "Processing..." : "DivyaVastu"}
          submitButtonProps={{
            sx: {
              mt: 3,
              fontWeight: 700,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              letterSpacing: 0.5,
              py: 1.2,
              borderRadius: 2,
              background: safeTheme.palette.mode === "dark"
                ? "linear-gradient(90deg,#1976d2 0%,#1565c0 100%)"
                : "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
              boxShadow: 4,
              transition: "all 0.2s",
              '&:hover': {
                background: safeTheme.palette.mode === "dark"
                  ? "linear-gradient(90deg,#1565c0 0%,#1976d2 100%)"
                  : "linear-gradient(90deg,#64b5f6 0%,#1976d2 100%)",
                transform: "scale(1.02)",
              },
              position: 'relative',
              '&:disabled': {
                background: safeTheme.palette.mode === "dark"
                  ? "linear-gradient(90deg,#1976d2 0%,#1565c0 100%)"
                  : "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
                opacity: 0.8,
              }
            },
            fullWidth: true,
            size: "large",
            className: "check-vastu-btn",
            disabled: isProcessing || submitted,
            startIcon: (isProcessing || submitted) ? (
              <CircularProgress 
                size={20} 
                sx={{ 
                  color: safeTheme.palette.primary.contrastText,
                  mr: 1
                }} 
              />
            ) : undefined
          }}
        >
          {({ control }: { control: any }) => (
            <FileUploadInput name="floorPlan" control={control} className="file-upload" />
          )}
        </Form>
        {(isProcessing || submitted) && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            mt: 2,
            gap: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} sx={{ color: safeTheme.palette.primary.main }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {isProcessing ? "Processing your floor plan..." : "Preparing crop page..."}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
              {isProcessing ? "Please wait while we process your image..." : "Redirecting to crop page..."}
            </Typography>
          </Box>
        )}
      </Card>
    );
  };



  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ClientNavbar />
      <ProductTour onVideoOpen={() => setVideoOpen(true)} />
    
      {/* Modern Gradient Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
          background: safeTheme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
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
        
        {/* Floating particles effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: safeTheme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)',
            animation: 'float 12s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px) rotate(0deg)',
              },
              '33%': {
                transform: 'translateY(-20px) rotate(1deg)',
              },
              '66%': {
                transform: 'translateY(10px) rotate(-1deg)',
              },
            },
          }}
        />
      </Box>
  
      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        maxWidth="sm"
      >
        {renderContent()}
        
        <Box sx={{ 
          mt: { xs: 3, sm: 4 }, 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          maxWidth: { xs: "90vw", sm: 480 },
         }} className="social-icons">
           <ClientSocialIcons />
         </Box>
      </Container>
  
      {/* Modern Video Tour Button */}
      <IconButton
        className="video-tour"
        onClick={() => {
          setVideoOpen(true);
        }}
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: safeTheme.palette.mode === "dark"
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          border: safeTheme.palette.mode === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.3)'
            : '1px solid rgba(59, 130, 246, 0.2)',
          color: safeTheme.palette.mode === 'dark' ? '#60a5fa' : '#1e40af',
          boxShadow: safeTheme.palette.mode === 'dark'
            ? '0 6px 24px rgba(59, 130, 246, 0.3)'
            : '0 6px 24px rgba(59, 130, 246, 0.2)',
          zIndex: 1300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05) rotate(3deg)',
            boxShadow: safeTheme.palette.mode === 'dark'
              ? '0 8px 32px rgba(59, 130, 246, 0.4)'
              : '0 8px 32px rgba(59, 130, 246, 0.3)',
            background: safeTheme.palette.mode === "dark"
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
          },
        }}
      >
        <PlayCircleOutlineIcon sx={{ fontSize: 20 }} />
      </IconButton>
  
      {/* Modern Footer Sections */}
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 10,
          py: 1.5,
          px: 2.5,
          background: safeTheme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: safeTheme.palette.mode === 'dark'
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
          color: safeTheme.palette.mode === 'dark' ? '#e2e8f0' : '#475569',
          textAlign: "left",
          fontSize: { xs: "0.75rem", sm: "0.8rem" },
          fontWeight: 500,
          letterSpacing: 0.2,
          borderRadius: '0 12px 0 0',
          maxWidth: '45%',
        }}
      >
        Made with ❤️ by Brahma Vastu
      </Box>
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          zIndex: 10,
          py: 1.5,
          px: 2.5,
          background: safeTheme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: safeTheme.palette.mode === 'dark'
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
          color: safeTheme.palette.mode === 'dark' ? '#e2e8f0' : '#475569',
          textAlign: "right",
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
          fontWeight: 500,
          letterSpacing: 0.2,
          borderRadius: '12px 0 0 0',
          maxWidth: '45%',
        }}
      >
        Copyrights © 2025 Brahma Vastu – All rights reserved.
      </Box>
  
      {/* Dialogs stay the same */}
      <Dialog 
        open={videoOpen} 
        onClose={() => setVideoOpen(false)} 
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4, 
            boxShadow: safeTheme.palette.mode === 'dark'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            background: safeTheme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: safeTheme.palette.mode === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.1)'
              : '1px solid rgba(148, 163, 184, 0.2)',
            overflow: 'hidden'
          },
        }}
      >
        <Box sx={{ 
          position: 'relative',
          backgroundColor: '#000',
          aspectRatio: '16/9',
        }}>
          <IconButton
            onClick={() => setVideoOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          {tourVideoUrl ? (
            <video 
              controls 
              width="100%" 
              height="100%"
              style={{ 
                display: 'block',
                objectFit: 'contain'
              }}
              onError={() => setVideoOpen(false)}
            >
              <source src={tourVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: 'white',
              textAlign: 'center',
              p: 3
            }}>
              <Typography variant="h6">
                No tour video available at the moment.
              </Typography>
            </Box>
          )}
        </Box>
      </Dialog>
  
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4, 
            boxShadow: safeTheme.palette.mode === 'dark'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            background: safeTheme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: safeTheme.palette.mode === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.1)'
              : '1px solid rgba(148, 163, 184, 0.2)',
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
            onClick={handleCloseErrorDialog}
            style={{
              background: `linear-gradient(135deg, ${safeTheme.palette.primary.main}, ${safeTheme.palette.primary.dark})`,
              color: safeTheme.palette.primary.contrastText,
              border: 'none',
              borderRadius: '16px',
              padding: '12px 30px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: safeTheme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(59, 130, 246, 0.3)' 
                : '0 8px 32px rgba(59, 130, 246, 0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = safeTheme.palette.mode === 'dark' 
                ? '0 12px 40px rgba(59, 130, 246, 0.4)' 
                : '0 12px 40px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = safeTheme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(59, 130, 246, 0.3)' 
                : '0 8px 32px rgba(59, 130, 246, 0.2)';
            }}
          >
            Got It
          </button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

