'use client';
import { useState } from "react";
import { Form } from "@/components/forms/Form";
import { FileUploadInput } from "@/components/forms/FileUploadInput";
import Navbar from "@/components/ui/Navbar";
import SocialIcons from "@/components/ui/SocialIcons";
import { Box, Typography, Card, Container, Fade, IconButton, Dialog, CircularProgress, DialogContent } from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import * as yup from "yup";
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/contexts/ThemeContext';
import * as tf from '@tensorflow/tfjs';
import { useRouter } from 'next/navigation';
import apiService from '@/utils/apiService';
import { sessionStorageManager } from '@/utils/sessionStorage';

const ProductTour = dynamic(() => import('@/components/ui/ProductTour'), { ssr: false });

// Constants for dynamic image processing
const BASE_TARGET_SIZE = 512;
const EDGE_THRESHOLD = 0.2; // Adjusted for less strict detection
const MIN_CONFIDENCE = 0.45; // Adjusted for less strict validation

// Enhanced floor plan detection with proper TypeScript types
async function detectFloorPlanFeatures(imageElement: HTMLImageElement): Promise<{
  confidence: number;
  features: string[];
  metrics: any;
}> {
  try {
    // Convert image to tensor with proper typing
    let tensor = tf.browser.fromPixels(imageElement).toFloat() as tf.Tensor3D;

    // Handle different image formats
    let numChannels = tensor.shape[2];
    if (numChannels === 4) {
      tensor = tensor.slice([0, 0, 0], [-1, -1, 3]) as tf.Tensor3D;
    } else if (numChannels === 1) {
      tensor = tensor.expandDims(-1).tile([1, 1, 3]) as tf.Tensor3D;
    }

    // Resize for consistent processing
    const [height, width] = tensor.shape;
    const aspectRatio = width / height;
    let targetHeight = BASE_TARGET_SIZE;
    let targetWidth = BASE_TARGET_SIZE;
    
    if (aspectRatio > 1) {
      targetWidth = Math.round(BASE_TARGET_SIZE * aspectRatio);
    } else {
      targetHeight = Math.round(BASE_TARGET_SIZE / aspectRatio);
    }

    const resizedTensor = tf.image.resizeBilinear(tensor, [targetHeight, targetWidth]) as tf.Tensor3D;
    
    // Convert to grayscale for analysis
    const grayscaleTensor = resizedTensor.mean(2) as tf.Tensor2D;

    // Enhanced analysis methods
    const edgeFeatures = await detectArchitecturalEdges(grayscaleTensor);
    const lineFeatures = await detectArchitecturalLines(grayscaleTensor);
    const shapeFeatures = await detectRectangularShapes(grayscaleTensor);
    const contrastFeatures = await analyzeContrastPatterns(resizedTensor);
    const borderFeatures = await detectOuterBorders(grayscaleTensor);
    const textFeatures = await detectTextRegions(grayscaleTensor);

    // Calculate overall confidence with adjusted scoring
    const features = [];
    let confidence = 0;

    // Adjusted scoring system (less strict)
    if (edgeFeatures.density > 0.08) { // Adjusted threshold
      confidence += 0.2;
      features.push('✓ Architectural edges detected');
    }

    if (lineFeatures.horizontalScore > 0.2 && lineFeatures.verticalScore > 0.2) { // Adjusted threshold
      confidence += 0.25;
      features.push('✓ Perpendicular line grid detected');
    } else if (lineFeatures.horizontalScore > 0.15 || lineFeatures.verticalScore > 0.15) { // Adjusted threshold
      confidence += 0.1;
      features.push('⚠️ Some linear architectural patterns found');
    }

    if (shapeFeatures.rectangularScore > 0.2) { // Adjusted threshold
      confidence += 0.2;
      features.push('✓ Rectangular structures detected');
    } else if (shapeFeatures.rectangularScore > 0.1) { // Adjusted threshold
      confidence += 0.08;
      features.push('⚠️ Some rectangular patterns found');
    }

    if (contrastFeatures.whiteDominance > 0.4 && contrastFeatures.blackLineRatio > 0.03) { // Adjusted thresholds
      confidence += 0.15;
      features.push('✓ Good contrast architectural drawing scheme');
    } else if (contrastFeatures.whiteDominance > 0.3 && contrastFeatures.blackLineRatio > 0.02) { // Adjusted thresholds
      confidence += 0.05;
      features.push('⚠️ Average drawing contrast');
    }

    if (borderFeatures.hasBorders && borderFeatures.borderScore > 0.15) { // Adjusted threshold
      confidence += 0.1;
      features.push('✓ Drawing boundaries detected');
    } else if (borderFeatures.hasBorders) {
      confidence += 0.03;
      features.push('⚠️ Faint drawing boundaries');
    }

    if (textFeatures.hasTextRegions && textFeatures.textScore > 0.02) { // Adjusted threshold
      confidence += 0.05;
      features.push('✓ Text labels detected');
    } else if (textFeatures.hasTextRegions) {
      confidence += 0.01;
      features.push('⚠️ Minor text regions detected');
    }

    // Clean up tensors
    tf.dispose([tensor, resizedTensor, grayscaleTensor]);

    const metrics = {
      edgeDensity: edgeFeatures.density,
      lineScores: lineFeatures,
      shapeScore: shapeFeatures.rectangularScore,
      contrastRatio: contrastFeatures.blackLineRatio,
      whiteDominance: contrastFeatures.whiteDominance,
      borderScore: borderFeatures.borderScore,
      textScore: textFeatures.textScore
    };

    return {
      confidence: Math.min(confidence, 1),
      features,
      metrics
    };
  } catch (error) {
    console.error('Error in floor plan detection:', error);
    throw error;
  }
}

// Fixed edge detection with proper typing
async function detectArchitecturalEdges(grayscaleTensor: tf.Tensor2D): Promise<{ density: number }> {
  const expandedTensor = grayscaleTensor.expandDims(0).expandDims(-1) as tf.Tensor4D;
  
  const sobelX = tf.tensor([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], [3, 3])
    .reshape([3, 3, 1, 1]) as tf.Tensor4D;
  
  const sobelY = tf.tensor([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], [3, 3])
    .reshape([3, 3, 1, 1]) as tf.Tensor4D;

  const edgesX = tf.conv2d(expandedTensor, sobelX, 1, 'same') as tf.Tensor4D;
  const edgesY = tf.conv2d(expandedTensor, sobelY, 1, 'same') as tf.Tensor4D;
  
  const edgeMagnitude = tf.sqrt(tf.add(tf.square(edgesX), tf.square(edgesY))) as tf.Tensor4D;
  const strongEdges = edgeMagnitude.greater(EDGE_THRESHOLD) as tf.Tensor4D;
  
  const edgeCount = tf.sum(strongEdges).arraySync() as number;
  const totalPixels = grayscaleTensor.size;
  
  tf.dispose([expandedTensor, sobelX, sobelY, edgesX, edgesY, edgeMagnitude, strongEdges]);
  
  return { density: edgeCount / totalPixels };
}

// Enhanced line detection with better sampling
async function detectArchitecturalLines(grayscaleTensor: tf.Tensor2D): Promise<{
  horizontalScore: number;
  verticalScore: number;
}> {
  const [height, width] = grayscaleTensor.shape;
  const threshold = 0.15;
  
  let horizontalLines = 0;
  const hSampleStep = Math.max(1, Math.floor(height / 50));
  for (let y = 0; y < height; y += hSampleStep) {
    const row = grayscaleTensor.slice([y, 0], [1, width]).squeeze() as tf.Tensor1D;
    const darkPixels = tf.sum(row.less(120)).arraySync() as number;
    if (darkPixels > width * threshold) {
      horizontalLines++;
    }
    row.dispose();
  }
  
  let verticalLines = 0;
  const vSampleStep = Math.max(1, Math.floor(width / 50));
  for (let x = 0; x < width; x += vSampleStep) {
    const col = grayscaleTensor.slice([0, x], [height, 1]).squeeze() as tf.Tensor1D;
    const darkPixels = tf.sum(col.less(120)).arraySync() as number;
    if (darkPixels > height * threshold) {
      verticalLines++;
    }
    col.dispose();
  }
  
  return {
    horizontalScore: horizontalLines / Math.ceil(height / hSampleStep),
    verticalScore: verticalLines / Math.ceil(width / vSampleStep)
  };
}

// Fixed rectangular shape detection
async function detectRectangularShapes(grayscaleTensor: tf.Tensor2D): Promise<{
  rectangularScore: number;
}> {
  const binaryImage = grayscaleTensor.less(130) as tf.Tensor2D;
  const expandedBinary = binaryImage.expandDims(0).expandDims(-1).toFloat() as tf.Tensor4D;
  
  const pooled = tf.pool(expandedBinary, [3, 3], 'max', 'same') as tf.Tensor4D;
  const componentScore = tf.sum(pooled).arraySync() as number / binaryImage.size;
  
  tf.dispose([binaryImage, expandedBinary, pooled]);
  
  return { rectangularScore: componentScore };
}

// Enhanced contrast analysis
async function analyzeContrastPatterns(colorTensor: tf.Tensor3D): Promise<{
  whiteDominance: number;
  blackLineRatio: number;
}> {
  const grayscale = colorTensor.mean(2) as tf.Tensor2D;
  
  const whitePixels = tf.sum(grayscale.greater(180)).arraySync() as number;
  const whiteDominance = whitePixels / grayscale.size;
  
  const blackPixels = tf.sum(grayscale.less(120)).arraySync() as number;
  const blackLineRatio = blackPixels / grayscale.size;
  
  grayscale.dispose();
  
  return { whiteDominance, blackLineRatio };
}

// Enhanced border detection
async function detectOuterBorders(grayscaleTensor: tf.Tensor2D): Promise<{
  hasBorders: boolean;
  borderScore: number;
}> {
  const [height, width] = grayscaleTensor.shape;
  const borderWidth = Math.max(3, Math.floor(Math.min(height, width) * 0.02));
  
  const topBorder = grayscaleTensor.slice([0, 0], [borderWidth, width]);
  const bottomBorder = grayscaleTensor.slice([height - borderWidth, 0], [borderWidth, width]);
  const leftBorder = grayscaleTensor.slice([0, 0], [height, borderWidth]);
  const rightBorder = grayscaleTensor.slice([0, width - borderWidth], [height, borderWidth]);
  
  const topDark = tf.sum(topBorder.less(130)).arraySync() as number;
  const bottomDark = tf.sum(bottomBorder.less(130)).arraySync() as number;
  const leftDark = tf.sum(leftBorder.less(130)).arraySync() as number;
  const rightDark = tf.sum(rightBorder.less(130)).arraySync() as number;
  
  const totalBorderPixels = (topBorder.size + bottomBorder.size + leftBorder.size + rightBorder.size);
  const darkBorderRatio = (topDark + bottomDark + leftDark + rightDark) / totalBorderPixels;
  
  tf.dispose([topBorder, bottomBorder, leftBorder, rightBorder]);
  
  return {
    hasBorders: darkBorderRatio > 0.1,
    borderScore: darkBorderRatio
  };
}

// New text region detection
async function detectTextRegions(grayscaleTensor: tf.Tensor2D): Promise<{
  hasTextRegions: boolean;
  textScore: number;
}> {
  const [height, width] = grayscaleTensor.shape;
  
  const binaryImage = grayscaleTensor.less(100) as tf.Tensor2D;
  const expandedBinary = binaryImage.expandDims(0).expandDims(-1).toFloat() as tf.Tensor4D;
  
  const textKernel = tf.ones([2, 8, 1, 1]) as tf.Tensor4D;
  const textResponse = tf.conv2d(expandedBinary, textKernel, 1, 'same') as tf.Tensor4D;
  
  const textPixels = tf.sum(textResponse.greater(4)).arraySync() as number;
  const textScore = textPixels / (height * width);
  
  tf.dispose([binaryImage, expandedBinary, textKernel, textResponse]);
  
  return {
    hasTextRegions: textScore > 0.01,
    textScore: textScore
  };
}

// Updated verification function with improved error messaging
async function verifyFloorPlan(imageElement: HTMLImageElement): Promise<{
  isValid: boolean;
  confidence: number;
  features: string[];
  details: string;
}> {
  try {
    const analysis = await detectFloorPlanFeatures(imageElement);
    
    const isValid = analysis.confidence >= MIN_CONFIDENCE;
    const confidencePercent = Math.round(analysis.confidence * 100);
    
    let details = ''; // No detailed analysis for positive results

    // Enhanced error messaging
    let errorDetails = '';
    if (!isValid) {
      errorDetails += `This doesn\'t appear to be a valid floor plan through machine detection. For better results, please upload an image with:\n`;
      errorDetails += `• Clear, well-defined walls and room boundaries\n`;
      errorDetails += `• Strong horizontal and vertical lines\n`;
      errorDetails += `• High contrast between walls and background\n`;
      errorDetails += `• Minimal noise or clutter`;
    }

    return {
      isValid,
      confidence: analysis.confidence,
      features: analysis.features,
      details: isValid ? '' : errorDetails // Return empty string for valid, errorDetails for invalid
    };
  } catch (error) {
    console.error('Error in verifyFloorPlan:', error);
    throw error;
  }
}

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // New state for error dialog
  const { theme } = useThemeContext();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      setSubmitted(true);
      setVerificationError(null);
      setVerificationDetails(null);
      setIsVerifying(true);
      setErrorDialogOpen(false); // Close dialog on new submission
  
      const file = data.floorPlan[0];
      if (!file) {
        throw new Error("No file selected");
      }
  
      // Check file size (optional - add reasonable limits)
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error("File size too large. Please upload an image smaller than 10MB.");
      }
  
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        try {
          if (!e.target?.result) {
            throw new Error("Failed to read file");
          }
  
          const img = new Image();
          img.src = e.target.result as string;
  
          img.onload = async () => {
            try {
              // Enhanced verification
              const result = await verifyFloorPlan(img);
              
              setVerificationDetails(result.details);
              
              if (!result.isValid) {
                setVerificationError(result.details);
                setErrorDialogOpen(true);
                setIsVerifying(false);
                setSubmitted(false);
              } else {
                // Upload the floor plan using API service
                try {
                  const uploadResult = await apiService.floorplan.uploadFloorplan(file);
                  console.log('Floor plan uploaded successfully:', uploadResult);
                  
                  // Create a blob URL for the verified image
                  const blob = await fetch(img.src).then(r => r.blob());
                  const blobUrl = URL.createObjectURL(blob);
                  
                  // Store in session storage for efficient data flow
                  sessionStorageManager.storeOriginalFloorPlan(file, uploadResult.id, blobUrl);
                  
                  // Navigate to crop page (no need to pass data via URL)
                  router.push('/crop');
                  setIsVerifying(false);
                  setSubmitted(false);
                } catch (uploadError) {
                  console.error('Error uploading floor plan:', uploadError);
                  setVerificationError("Failed to upload floor plan. Please try again.");
                  setErrorDialogOpen(true);
                  setIsVerifying(false);
                  setSubmitted(false);
                }
              }
            } catch (error) {
              console.error('Error verifying floor plan:', error);
              setVerificationError("Error analyzing the image. Please try again with a clearer floor plan image.");
              setErrorDialogOpen(true);
              setIsVerifying(false);
              setSubmitted(false);
            }
          };
  
          img.onerror = () => {
            setVerificationError("Could not load image. Please try again with a valid image file.");
            setErrorDialogOpen(true);
            setIsVerifying(false);
            setSubmitted(false);
          };
        } catch (error) {
          console.error('Error in file reader:', error);
          setVerificationError("Error reading the file. Please try again.");
          setErrorDialogOpen(true);
          setIsVerifying(false);
          setSubmitted(false);
        }
      };
  
      reader.onerror = () => {
        setVerificationError("Error reading the file. Please try again.");
        setErrorDialogOpen(true);
        setIsVerifying(false);
        setSubmitted(false);
      };
  
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in form submission:', error);
      setVerificationError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      setErrorDialogOpen(true);
      setIsVerifying(false);
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
          }}
          onError={(e) => {
            console.error('Error loading background video:', e);
          }}
        >
          <source src="/videos/169951-842348732_medium.mp4" type="video/mp4" />
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
              submitButtonText={isVerifying ? "Analyzing Floor Plan..." : (submitted ? "Processing..." : "DivyaVastu")}
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
                },
                fullWidth: true,
                size: "large",
                className: "check-vastu-btn",
                disabled: isVerifying || submitted
              }}
            >
              {({ control }: { control: any }) => (
                <FileUploadInput name="floorPlan" control={control} className="file-upload" />
              )}
            </Form>
            {isVerifying && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing architectural features...
                </Typography>
              </Box>
            )}
            {verificationDetails && !verificationError && (
              <Typography 
                variant="body2" 
                color="success.main" 
                sx={{ 
                  mt: 2, 
                  textAlign: 'left',
                  whiteSpace: 'pre-line',
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  padding: 2,
                  borderRadius: 1,
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.3)',
                    },
                  },
                }}
              >
                {/* Empty text for successful detection */}
              </Typography>
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
        Made with ❤️ by Divya Vastu
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
            Invalid Floor Plan Detected (Machine Detection)
          </Typography>
          <Typography variant="body1" color="text.secondary" whiteSpace="pre-line" sx={{ mb: 3 }}>
            {verificationError}
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
              e.currentTarget.style.boxShadow = theme.palette.mode === 'dark' 
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