'use client';
import { useState } from "react";
import { Form } from "@/components/forms/Form";
import { FileUploadInput } from "@/components/forms/FileUploadInput";
import Navbar from "@/components/ui/Navbar";
import SocialIcons from "@/components/ui/SocialIcons";
import { Box, Typography, Card, Container, Fade, IconButton, Dialog } from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import * as yup from "yup";
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/contexts/ThemeContext';

const ProductTour = dynamic(() => import('@/components/ui/ProductTour'), { ssr: false });

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

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const { theme } = useThemeContext();

  const handleSubmit = (data: any) => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <Box sx={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      <Navbar />
      <ProductTour />
      {/* Background Video */}
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
          }}
        >
          <source src="/videos/169951-842348732_medium.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay */}
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
      {/* Hero Card */}
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
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(20,20,30,0.95)"
                  : "rgba(255,255,255,0.92)",
              minWidth: { xs: "90vw", sm: 400 },
              maxWidth: 480,
              backdropFilter: "blur(8px)",
              border: (theme) => `1.5px solid ${theme.palette.divider}`,
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
              submitButtonText={submitted ? "Checking..." : "DivyaVastu"}
              submitButtonProps={{
                sx: {
                  mt: 3,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: 1,
                  py: 1.5,
                  borderRadius: 2,
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(90deg,#1976d2 0%,#1565c0 100%)"
                      : "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
                  boxShadow: 4,
                  transition: "all 0.2s",
                  '&:hover': {
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "linear-gradient(90deg,#1565c0 0%,#1976d2 100%)"
                        : "linear-gradient(90deg,#64b5f6 0%,#1976d2 100%)",
                    transform: "scale(1.03)",
                  },
                },
                fullWidth: true,
                size: "large",
                className: "check-vastu-btn",
              }}
            >
              {({ control }: { control: any }) => (
                <FileUploadInput name="floorPlan" control={control} className="file-upload" />
              )}
            </Form>
          </Card>
        </Fade>
        {/* Social Icons below card */}
        <Box sx={{ mt: { xs: 3, sm: 4 }, display: 'flex', justifyContent: 'center', width: '100%' }} className="social-icons">
          <SocialIcons />
        </Box>
      </Container>
      {/* Footer - Video Icon on Bottom Left */}
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
            color: theme.palette.primary.main,
            background: theme.palette.mode === 'dark' ? '#23234f' : '#ffffff',
            boxShadow: 2,
            '&:hover': {
              background: theme.palette.primary.main,
              color: '#ffffff',
            },
          }}
        >
          <PlayCircleOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Footer - Copyright Text on Bottom Right */}
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
      {/* Video Dialog */}
      <Dialog open={videoOpen} onClose={() => setVideoOpen(false)} maxWidth="md">
        <video controls width="100%">
          <source src="/videos/0_Mountains_Landscape_3840x2160.mp4" type="video/mp4" />
        </video>
      </Dialog>
    </Box>
  );
}