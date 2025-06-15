'use client';

import React from 'react';
import { Box, Typography, Slider, FormControlLabel, Switch, Button, Paper, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';

interface ChakraControlsProps {
  rotation: number;
  setRotation: (rotation: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  chakraOpacity: number;
  setChakraOpacity: (opacity: number) => void;
  showCenterMark: boolean;
  setShowCenterMark: (show: boolean) => void;
}

const ChakraControls: React.FC<ChakraControlsProps> = ({
  rotation,
  setRotation,
  zoom,
  setZoom,
  chakraOpacity,
  setChakraOpacity,
  showCenterMark,
  setShowCenterMark,
}) => {
  const handleDownload = async () => {
    const chakraViewerElement = document.getElementById('chakra-viewer-container'); // Need to set this ID in ChakraViewer
    if (chakraViewerElement) {
      const canvas = await html2canvas(chakraViewerElement);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'floorplan-chakra.png';
      link.click();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', width: '100%', flexShrink: 0 }}>
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
            color: '#FDD835', // Slider track/thumb color
            '& .MuiSlider-thumb': {
              backgroundColor: '#FDD835',
            },
            '& .MuiSlider-track': {
              backgroundColor: '#FDD835',
            },
            '& .MuiSlider-rail': {
              opacity: 0.5,
              backgroundColor: '#bdbdbd', // Gray for rail
            },
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
            color: '#FDD835', // Slider track/thumb color
            '& .MuiSlider-thumb': {
              backgroundColor: '#FDD835',
            },
            '& .MuiSlider-track': {
              backgroundColor: '#FDD835',
            },
            '& .MuiSlider-rail': {
              opacity: 0.5,
              backgroundColor: '#bdbdbd',
            },
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
                  '&:hover': {
                    backgroundColor: 'rgba(253, 216, 53, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#FDD835',
                },
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
                  '&:hover': {
                    backgroundColor: 'rgba(253, 216, 53, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#FDD835',
                },
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
          '&:hover': {
            backgroundColor: '#FDD835',
            opacity: 0.9,
          },
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
  );
};

export default ChakraControls; 