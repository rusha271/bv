'use client';
import { useState } from "react";
import { Form } from "@/components/forms/Form";
import { FileUploadInput } from "@/components/forms/FileUploadInput";
import Navbar from "@/components/ui/Navbar";
import SocialIcons from "@/components/Icons/SocialIcons";
import { Box, Typography, Card, Container, Fade, IconButton, Dialog, CircularProgress, DialogContent, Button } from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import * as yup from "yup";
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { sessionStorageManager } from '@/utils/sessionStorage';

const ProductTour = dynamic(() => import('@/components/Tour/ProductTour'), { ssr: false });

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
  const { theme } = useThemeContext();
  const router = useRouter();

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
          
          // Generate a unique ID for the image
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Store the image data locally with 1-hour expiration
          sessionStorageManager.storeOriginalFloorPlan(file, imageId, blobUrl);
          
          // Navigate to crop page
          router.push('/crop');
          setIsProcessing(false);
          setSubmitted(false);
          
        } catch (error) {
          console.error('Error processing image:', error);
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
      console.error('Error in form submission:', error);
      setProcessingError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      setErrorDialogOpen(true);
      setIsProcessing(false);
      setSubmitted(false);
    }
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Box sx={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      <Navbar />
      <ProductTour />
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            filter: "brightness(0.7)",
            bottom: 60,
          }}
          onError={(e) => {
            console.error('Error loading background video:', e);
          }}
        >
          {/* <source src="/videos/169951-842348732_medium.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(25,118,210,0.5) 0%, rgba(0,0,0,0.4) 100%)",
            zIndex: 1,
          }}
        />
      </Box>
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          overflow: "hidden",
        }}
        maxWidth="sm"
      >
        <Fade in timeout={800}>
          <Card
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              boxShadow: 12,
              bgcolor: theme.palette.mode === "dark"
                ? "rgba(20,20,30,0.95)"
                : "rgba(255,255,255,0.92)",
              minWidth: { xs: "90vw", sm: 400 },
              maxWidth: 480,
              backdropFilter: "blur(8px)",
              border: `1.5px solid ${theme.palette.divider}`,
            }}
            className="file-upload-card"
          >
            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              sx={{ textAlign: "center", mb: 2 }}
            >
              Check Vastu from your Floor Plan
            </Typography>
            <Form
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
              defaultValues={{ floorPlan: null }}
              submitButtonText={isProcessing || submitted ? "" : "DivyaVastu"}
              submitButtonProps={{
                sx: {
                  mt: 3,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: 1,
                  py: 1.5,
                  borderRadius: 2,
                  background: theme.palette.mode === "dark"
                    ? "linear-gradient(90deg,#1976d2 0%,#1565c0 100%)"
                    : "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
                  boxShadow: 4,
                  transition: "all 0.2s",
                  '&:hover': {
                    background: theme.palette.mode === "dark"
                      ? "linear-gradient(90deg,#1565c0 0%,#1976d2 100%)"
                      : "linear-gradient(90deg,#64b5f6 0%,#1976d2 100%)",
                    transform: "scale(1.03)",
                  },
                  position: 'relative',
                },
                fullWidth: true,
                size: "large",
                className: "check-vastu-btn",
                disabled: isProcessing || submitted,
                startIcon: (isProcessing || submitted) ? (
                  <CircularProgress 
                    size={20} 
                    sx={{ 
                      color: theme.palette.primary.contrastText,
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
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {isProcessing ? "Processing your floor plan..." : "Preparing crop page..."}
                </Typography>
              </Box>
            )}
          </Card>
        </Fade>
        <Box sx={{ mt: { xs: 3, sm: 4 }, display: 'flex', justifyContent: 'center', width: '100%' }} className="social-icons">
          <SocialIcons />
        </Box>
      </Container>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 10,
          py: 1,
          px: 2,
          bgcolor: 'transparent',
          width: 'auto',
        }}
      >
      <IconButton
        className="video-tour"
        onClick={() => setVideoOpen(true)}
        sx={{
          position: "fixed",          // stick it to viewport
          bottom: 24,                 // distance from bottom
          left: 24,                   // distance from left (changed)
          width: 36,
          height: 36,
          borderRadius: "50%",        // circular
          color: theme.palette.primary.main,
          background: theme.palette.mode === "dark" ? "#23234f" : "#ffffff",
          boxShadow: 3,
          zIndex: 1300,               // keep above other elements
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          '&:hover': {
            background: theme.palette.primary.main,
            color: "#ffffff",
          },
        }}
      >
        <PlayCircleOutlineIcon fontSize="small" />
      </IconButton>
      </Box>
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 10,
          py: 1,
          px: 2,
          bgcolor: "transparent",
          color: "#fff",
          textAlign: "left",
          fontSize: "0.95rem",
          fontWeight: 400,
          letterSpacing: 0.5,
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
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
          py: 1,
          px: 2,
          bgcolor: "transparent",
          color: "#fff",
          textAlign: "right",
          fontSize: "0.95rem",
          fontWeight: 400,
          letterSpacing: 0.5,
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        Copyrights © {new Date().getFullYear()} Brahma Vastu – All rights reserved.
      </Box>
      <Dialog 
        open={videoOpen} 
        onClose={() => setVideoOpen(false)} 
        maxWidth="md"
        fullWidth
      >
        <video 
          controls 
          width="100%"
          onError={(e) => {
            console.error('Error loading video:', e);
            setVideoOpen(false);
          }}
        >
          <source src="/videos/0_Mountains_Landscape_3840x2160.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Dialog>
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
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
            onClick={handleCloseErrorDialog}
            style={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: theme.palette.primary.contrastText,
              border: 'none',
              borderRadius: '16px',
              padding: '12px 30px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(59, 130, 246, 0.3)' 
                : '0 8px 32px rgba(59, 130, 246, 0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.transform = theme.palette.mode === 'dark' 
                ? '0 12px 40px rgba(59, 130, 246, 0.4)' 
                : '0 12px 40px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' 
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
