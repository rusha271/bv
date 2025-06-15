'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper, IconButton, Slide, useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChakraControls from './ChakraControls';

interface DraggableChakraControlsProps {
  rotation: number;
  setRotation: (rotation: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  chakraOpacity: number;
  setChakraOpacity: (opacity: number) => void;
  showCenterMark: boolean;
  setShowCenterMark: (show: boolean) => void;
  open: boolean;
  onClose: () => void;
}

const DraggableChakraControls: React.FC<DraggableChakraControlsProps> = ({
  rotation,
  setRotation,
  zoom,
  setZoom,
  chakraOpacity,
  setChakraOpacity,
  showCenterMark,
  setShowCenterMark,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const controlsRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (controlsRef.current) {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setOffset({
        x: clientX - controlsRef.current.getBoundingClientRect().left,
        y: clientY - controlsRef.current.getBoundingClientRect().top,
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (controlsRef.current) {
      const newX = clientX - offset.x;
      const newY = clientY - offset.y;

      // Constrain within viewport
      const maxX = window.innerWidth - controlsRef.current.offsetWidth - 16; // 16px padding
      const maxY = window.innerHeight - controlsRef.current.offsetHeight - 16; // 16px padding
      const minX = 16;
      const minY = 16;

      setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY)),
      });
    }
  }, [isDragging, offset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (open) {
      // Set initial position to top-right or centered for smaller screens
      if (controlsRef.current) {
        const initialX = Math.min(window.innerWidth - controlsRef.current.offsetWidth - 16, window.innerWidth * 0.75); // 16px from right, or 75% width
        const initialY = 70; // Below navbar
        setPosition({ x: initialX, y: initialY });
      }
    }
  }, [open]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit timeout={{ enter: 300, exit: 200 }}>
      <Paper
        ref={controlsRef}
        elevation={8}
        sx={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: 300, // Fixed width for the controls panel
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '12px',
          zIndex: theme.zIndex.drawer + 2, // Above backdrop
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: theme.shadows[8],
          transition: 'none !important', // Disable MUI transitions for manual dragging
          transform: `translate(0px, 0px)`,
          willChange: 'transform',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            pb: 0,
            cursor: 'grab',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <IconButton onClick={onClose} size="small" sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2, pt: 1, flexGrow: 1, overflowY: 'auto' }}>
          <ChakraControls
            rotation={rotation}
            setRotation={setRotation}
            zoom={zoom}
            setZoom={setZoom}
            chakraOpacity={chakraOpacity}
            setChakraOpacity={setChakraOpacity}
            showCenterMark={showCenterMark}
            setShowCenterMark={setShowCenterMark}
          />
        </Box>
      </Paper>
    </Slide>
  );
};

export default DraggableChakraControls; 