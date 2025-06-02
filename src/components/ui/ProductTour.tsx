'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Dialog from '@mui/material/Dialog';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Step, CallBackProps } from 'react-joyride';

// Dynamically import Joyride to prevent SSR
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

const steps: Step[] = [
  { target: '.file-upload', content: 'Upload your floor plan here!' },
  { target: '.check-vastu-btn', content: 'Click to check your Vastu.' },
  { target: '.social-icons', content: 'Connect with us on social media.' },
  { target: '.video-tour', content: 'Watch a video to learn about how to upload your floor plan.' },
];

export default function ProductTour() {
  const [run, setRun] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const { theme } = useThemeContext();

  useEffect(() => {
    const handleLoad = () => {
      if (document.readyState === 'complete') {
        setRun(true);
      }
    };
    handleLoad();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const joyrideBg = theme.palette.mode === 'dark' ? '#23234f' : '#ffffff';
  const joyrideText = theme.palette.text.primary;

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 2000,
            backgroundColor: joyrideBg,
            textColor: joyrideText,
            arrowColor: joyrideBg,
            overlayColor: theme.palette.mode === 'dark' ? 'rgba(44,44,84,0.7)' : 'rgba(0,0,0,0.3)',
            primaryColor: theme.palette.primary.main,
          },
        }}
        callback={(data: CallBackProps) => {
          if (data.index === 3 && data.action === 'next') {
            setVideoOpen(true);
            setRun(false);
          }
        }}
      />
      <Dialog open={videoOpen} onClose={() => setVideoOpen(false)} maxWidth="md">
        <video controls width="100%">
          <source src="/videos/0_Mountains_Landscape_3840x2160.mp4" type="video/mp4" />
        </video>
      </Dialog>
    </>
  );
}