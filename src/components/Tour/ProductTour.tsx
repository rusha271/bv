'use client';
import React, { useEffect, useState } from 'react';
import { TourProvider, useTour, StepType } from '@reactour/tour';
import { useThemeContext } from '@/contexts/ThemeContext';
import { IconButton, Box, Typography, Button, useMediaQuery, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

interface TourButtonProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setIsOpen: (isOpen: boolean) => void;
}

interface BaseStyles {
  [key: string]: any;
}

const TourWithSteps = ({ onVideoOpen }: { onVideoOpen?: () => void }) => {
  const { setIsOpen, currentStep, isOpen, setCurrentStep, setSteps } = useTour();
  const { theme } = useThemeContext();
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Custom close button component
  const CustomCloseButton = ({ setIsOpen }: { setIsOpen: () => void }) => (
    <IconButton
      onClick={setIsOpen}
      size="small"
      sx={{
        position: 'absolute',
        top: isClient && isMobile ? 8 : 12,
        right: isClient && isMobile ? 8 : 12,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#666666',
        width: isClient && isMobile ? 28 : 32,
        height: isClient && isMobile ? 28 : 32,
        zIndex: 1,
        '&:hover': { 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
        },
      }}
    >
      <CloseIcon fontSize={isClient && isMobile ? 'small' : 'medium'} />
    </IconButton>
  );

  // Custom previous button component
  const CustomPrevButton = ({ currentStep, setCurrentStep }: { currentStep: number; setCurrentStep: (step: number) => void }) => (
    currentStep > 0 ? (
      <IconButton
        onClick={() => setCurrentStep(currentStep - 1)}
        size="small"
        sx={{
          position: 'absolute',
          top: isClient && isMobile ? 8 : 12,
          left: isClient && isMobile ? 8 : 12,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#666666',
          width: isClient && isMobile ? 28 : 32,
          height: isClient && isMobile ? 28 : 32,
          '&:hover': { 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          },
        }}
      >
        <ArrowBackIcon fontSize={isClient && isMobile ? 'small' : 'medium'} />
      </IconButton>
    ) : null
  );

  // Create custom step content component
  const CustomStepContent = ({ 
    stepIndex, 
    title, 
    description, 
    emoji,
    onClose
  }: { 
    stepIndex: number; 
    title: string; 
    description: string; 
    emoji: string;
    onClose: () => void;
  }) => (
    <Box sx={{ position: 'relative', p: isClient && isMobile ? '16px 16px 0 16px' : '20px 20px 0 20px' }}>
      <CustomCloseButton setIsOpen={onClose} />
      <CustomPrevButton currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <Box sx={{ mt: isClient && isMobile ? 1.5 : 2, pr: isClient && isMobile ? 4 : 5 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: '16px' }}>
          {emoji} {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '14px', lineHeight: 1.4 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );

  // Define steps with proper typing
  const steps: StepType[] = [
    {
      selector: '.file-upload',
      content: (
        <CustomStepContent
          stepIndex={0}
          emoji="📁"
          title="Upload Your Floor Plan"
          description="Start by uploading your floor plan image here. We support PNG, JPG, and JPEG formats."
          onClose={() => setIsOpen(false)}
        />
      ),
    },
    {
      selector: '.check-vastu-btn',
      content: (
        <CustomStepContent
          stepIndex={1}
          emoji="✨"
          title="Check Your Vastu"
          description="Once uploaded, click this button to analyze your floor plan according to Vastu principles."
          onClose={() => setIsOpen(false)}
        />
      ),
    },
    {
      selector: '.social-icons',
      content: (
        <CustomStepContent
          stepIndex={2}
          emoji="🌐"
          title="Stay Connected"
          description="Follow us on social media for more Vastu tips and updates."
          onClose={() => setIsOpen(false)}
        />
      ),
    },
    {
      selector: '.video-tour',
      content: (
        <CustomStepContent
          stepIndex={3}
          emoji="🎥"
          title="Video Tutorial"
          description="Watch our helpful video guide to learn the best practices for uploading your floor plan."
          onClose={() => setIsOpen(false)}
        />
      ),
    },
  ];

  // Set the steps for the tour
  useEffect(() => {
    if (setSteps) {
      setSteps(steps);
    }
  }, [setSteps]); // Remove steps from dependencies to prevent infinite loop

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen && currentStep === 3) {
      setTimeout(() => {
        setIsOpen(false);
        if (onVideoOpen) {
          onVideoOpen();
        }
      }, 3000);
    }
  }, [currentStep, isOpen, setIsOpen, onVideoOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  return null;
};

interface ProductTourProps {
  onVideoOpen?: () => void;
}

export default function ProductTour({ onVideoOpen }: ProductTourProps) {
  const { theme } = useThemeContext();
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const tourStyles = {
    popover: (base: BaseStyles) => {
      const mobileStyles = isClient && isMobile ? {
        maxWidth: '85vw',
        minWidth: '280px',
        position: 'fixed' as const,
        left: '50%',
        transform: 'translateX(-50%)',
        margin: '0 auto',
      } : {
        maxWidth: '320px',
        minWidth: '300px',
      };
    
      return {
        ...base,
        '--reactour-accent': theme.palette.primary.main,
        backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a2e',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#333366' : '#e0e0e0'}`,
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)' 
          : '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        padding: '0',
        overflow: 'hidden' as const,
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        ...mobileStyles,
      };
    },
    maskWrapper: (base: BaseStyles) => ({
      ...base,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 9998,
    }),
    maskArea: (base: BaseStyles) => ({
      ...base,
      rx: 8,
    }),
    badge: (base: BaseStyles) => ({
      ...base,
      backgroundColor: theme.palette.primary.main + ' !important',
      color: theme.palette.primary.contrastText + ' !important',
      fontWeight: '600 !important',
      fontSize: '14px !important',
      minWidth: '28px !important',
      height: '28px !important',
      borderRadius: '14px !important',
      display: 'flex !important',
      alignItems: 'center !important',
      justifyContent: 'center !important',
      position: 'absolute' as const,
      top: '-14px !important',
      right: '-14px !important',
      zIndex: '10000 !important',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2) !important',
      border: `2px solid ${theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff'} !important`,
    }),
    controls: (base: BaseStyles) => ({
      ...base,
      marginTop: 0,
    }),
    close: (base: BaseStyles) => ({
      ...base,
      display: 'none',
    }),
  };

  const CustomNextButton = ({ currentStep, setCurrentStep, setIsOpen }: TourButtonProps) => (
    <Box sx={{ 
      display: 'flex', 
      gap: 1, 
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isClient && isMobile ? '12px 16px' : '16px 20px',
      borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#333366' : '#f0f0f0'}`,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip
          label={currentStep + 1}
          size="small"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            fontSize: '12px',
            minWidth: '24px',
            height: '24px',
            '& .MuiChip-label': {
              px: 0.5,
            }
          }}
        />
        <Typography variant="caption" sx={{ 
          opacity: 0.7, 
          fontSize: isClient && isMobile ? '11px' : '12px',
          alignSelf: 'center'
        }}>
          of 4
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          variant="text"
          size="small"
          onClick={() => setIsOpen(false)}
          sx={{
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#666666',
            textTransform: 'none',
            fontSize: isClient && isMobile ? '12px' : '13px',
            minWidth: 'auto',
            padding: isClient && isMobile ? '4px 8px' : '6px 12px',
            '&:hover': { 
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            },
          }}
        >
          Skip
        </Button>
        
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (currentStep === 3) { // 4 steps total (0-3)
              setIsOpen(false);
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
          endIcon={currentStep === 3 ? null : <ArrowForwardIcon fontSize="small" />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            fontSize: isClient && isMobile ? '12px' : '13px',
            fontWeight: 600,
            borderRadius: '8px',
            minWidth: 'auto',
            px: isClient && isMobile ? 1.5 : 2,
            py: 0.5,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {currentStep === 3 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <TourProvider
        steps={[]} // Will be set by TourWithSteps
        disableInteraction={false}
        styles={tourStyles}
        nextButton={CustomNextButton}
        prevButton={() => null}
        className="modern-tour"
        padding={{ mask: 4, popover: [8, 4] }}
        onClickMask={({ setIsOpen }) => setIsOpen(false)}
        position={isClient && isMobile ? 'bottom' : 'top'}
        showBadge={true}
      >
        <TourWithSteps onVideoOpen={onVideoOpen} />
      </TourProvider>

    </>
  );
}