'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Slider, FormControlLabel, Switch, Button, Paper, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import Image from 'next/image';

interface ChakraEditorProps {
  floorPlanImageUrl: string | null;
}

export const ChakraEditor: React.FC<ChakraEditorProps> = ({ floorPlanImageUrl }) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [chakraOpacity, setChakraOpacity] = useState(1);
  const [showCenterMark, setShowCenterMark] = useState(true);

  const floorPlanRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const floorPlanElement = floorPlanRef.current;
    if (!floorPlanElement) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
      floorPlanElement.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - startDrag.x, y: e.clientY - startDrag.y });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (floorPlanElement) {
        floorPlanElement.style.cursor = 'grab';
      }
    };

    floorPlanElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (floorPlanElement) {
        floorPlanElement.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position.x, position.y, startDrag.x, startDrag.y]);

  const handleDownload = async () => {
    const chakraViewerElement = document.getElementById('chakra-viewer-container');
    if (chakraViewerElement) {
      // Ensure all images are loaded
      const images = chakraViewerElement.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map((img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(img);
            else img.onload = () => resolve(img);
          })
        )
      );
  
      const canvas = await html2canvas(chakraViewerElement, {
        backgroundColor: null,
        logging: true,
        useCORS: true,
        allowTaint: true, // Allow tainted canvases if needed
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'floorplan-chakra.png';
      link.click();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        height: { md: '70vh' },
        width: '100%',
      }}
    >
      <Box
        ref={floorPlanRef}
        id="chakra-viewer-container"
        sx={{
          flexGrow: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: { xs: 400, md: '100%' }, // Further increased height for better visibility
          minHeight: { xs: 500, md: 'auto' }, // Increased minHeight for smaller screens
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          mb: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <Image
            src="/images/Shakti Chakra_Size.png"
            alt="Vastu Chakra"
            fill
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: chakraOpacity,
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              transformOrigin: 'center center',
              pointerEvents: 'none',
              objectFit: 'contain',
            }}
            draggable="false"
          />

          {floorPlanImageUrl ? (
            <img
              src={floorPlanImageUrl}
              alt="Floor Plan"
              style={{
                position: 'absolute',
                maxWidth: '50%', // Increased maxWidth for better visibility
                maxHeight: '50%', // Increased maxHeight for better visibility
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                pointerEvents: 'none',
                opacity: 0.75,
              }}
              draggable="false"
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                width: '60%', // Increased width for better visibility
                height: '60%', // Increased height for better visibility
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
                opacity: 0.4,
              }}
            >
              <Image
                src="/floorplan.png"
                alt="Floor Plan"
                fill
                style={{ objectFit: 'contain' }}
                draggable="false"
              />
            </Box>
          )}

          {showCenterMark && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '15px', // Increased size for better visibility
                height: '15px', // Increased size for better visibility
                backgroundColor: 'red',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          height: { xs: 'auto', md: '100%' },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
          width: { xs: '100%', md: '300px' },
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6">Controls</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>Rotate the Chakra</Typography>
          <TextField
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            type="number"
            size="small"
            InputProps={{ endAdornment: <Typography sx={{ ml: 0.5 }}>°</Typography> }}
            sx={{ width: '80px', mb: 1 }}
          />
          <Slider
            value={rotation}
            onChange={(_event, newValue) => setRotation(newValue as number)}
            aria-labelledby="chakra-rotation-slider"
            min={0}
            max={360}
            size="small"
            valueLabelDisplay="on"
            valueLabelFormat={(value) => `${value}°`}
            sx={{
              color: '#FDD835',
              '& .MuiSlider-thumb': { backgroundColor: '#FDD835' },
              '& .MuiSlider-track': { backgroundColor: '#FDD835' },
              '& .MuiSlider-rail': { opacity: 0.5, backgroundColor: '#bdbdbd' },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>- Zoom Floor Plan +</Typography>
          <Slider
            value={zoom}
            onChange={(_event, newValue) => setZoom(newValue as number)}
            aria-labelledby="floorplan-zoom-slider"
            min={0.5}
            max={2}
            step={0.1}
            size="small"
            valueLabelDisplay="on"
            valueLabelFormat={(value) => `${value.toFixed(1)}x`}
            sx={{
              color: '#FDD835',
              '& .MuiSlider-thumb': { backgroundColor: '#FDD835' },
              '& .MuiSlider-track': { backgroundColor: '#FDD835' },
              '& .MuiSlider-rail': { opacity: 0.5, backgroundColor: '#bdbdbd' },
            }}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={chakraOpacity === 1}
                onChange={(e) => setChakraOpacity(e.target.checked ? 1 : 0.5)}
                name="chakra-opacity-toggle"
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FDD835',
                    '&:hover': { backgroundColor: 'rgba(253, 216, 53, 0.08)' },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FDD835' },
                }}
              />
            }
            label="Chakra Opacity"
            sx={{ fontSize: '0.9rem' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showCenterMark}
                onChange={(e) => setShowCenterMark(e.target.checked)}
                name="show-center-mark-toggle"
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FDD835',
                    '&:hover': { backgroundColor: 'rgba(253, 216, 53, 0.08)' },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FDD835' },
                }}
              />
            }
            label="Show Centre Mark"
            sx={{ fontSize: '0.9rem' }}
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          fullWidth
          sx={{
            mt: 'auto',
            backgroundColor: '#FDD835',
            color: '#000',
            '&:hover': { backgroundColor: '#FDD835', opacity: 0.9, },
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            py: 1.5,
            borderRadius: '8px',
          }}
        >
          Download
        </Button>
      </Paper>
    </Box>
  );
};

export default ChakraEditor; 