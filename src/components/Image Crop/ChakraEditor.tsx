'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Slider, FormControlLabel, Switch, Button, Paper, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Image from 'next/image';
import CircularImagePoints from '@/components/CircularImagePoints';
import ChakraDetailsModal from '@/components/Chakra/ChakraDetailsModal';
import { getChakraPointsInOrder } from '@/utils/chakraCoordinateConverter';
import { ChakraPoint } from '@/types/chakra';
import { apiService } from '@/utils/apiService';

interface ChakraEditorProps {
  floorPlanImageUrl: string | null;
}

const ChakraEditor: React.FC<ChakraEditorProps> = ({ floorPlanImageUrl }) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [chakraOpacity, setChakraOpacity] = useState(1);
  const [showCenterMark, setShowCenterMark] = useState(true);
  const [selectedChakraPoint, setSelectedChakraPoint] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chakraPointsData, setChakraPointsData] = useState<{ [key: string]: ChakraPoint }>({});
  const [isLoadingChakraPoints, setIsLoadingChakraPoints] = useState(true);

  const floorPlanRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  // Fetch chakra points from API
  useEffect(() => {
    const fetchChakraPoints = async () => {
      try {
        setIsLoadingChakraPoints(true);
        console.log('ChakraEditor: Fetching chakra points from API...');
        const data = await apiService.vastuChakraPoints.getChakraPoints();
        if (data && typeof data === 'object') {
          console.log('ChakraEditor: Successfully loaded chakra points from API:', Object.keys(data).length, 'points');
          console.log('ChakraEditor: API data keys:', Object.keys(data));
          console.log('ChakraEditor: Sample API data:', data[Object.keys(data)[0]]);
          console.log('ChakraEditor: Raw data type:', typeof data);
          console.log('ChakraEditor: Is Array?', Array.isArray(data));
          console.log('ChakraEditor: Data constructor:', data.constructor.name);
          
          // Convert array to object with chakra point IDs as keys
          const chakraPointsObject: { [key: string]: ChakraPoint } = {};
          
          console.log('ChakraEditor: Data type:', Array.isArray(data) ? 'Array' : 'Object');
          console.log('ChakraEditor: Data length/keys:', Array.isArray(data) ? data.length : Object.keys(data).length);
          
          // Force conversion regardless of data type - handle both array and object formats
          let dataArray: any[] = [];
          
          if (Array.isArray(data)) {
            console.log('ChakraEditor: Data is array, using directly');
            dataArray = data;
          } else {
            console.log('ChakraEditor: Data is object, converting to array');
            dataArray = Object.values(data);
          }
          
          console.log('ChakraEditor: Processing data array with', dataArray.length, 'items');
          dataArray.forEach((point: any, index: number) => {
            console.log(`ChakraEditor: Processing point ${index}:`, point?.id, point?.name);
            if (point && point.id) {
              chakraPointsObject[point.id] = point;
              console.log(`ChakraEditor: Added ${point.id} to object`);
            } else {
              console.log(`ChakraEditor: Skipping point ${index} - no valid ID`);
            }
          });
          
          console.log('ChakraEditor: Converted to object format with keys:', Object.keys(chakraPointsObject));
          console.log('ChakraEditor: Sample converted data for N1:', chakraPointsObject['N1']);
          console.log('ChakraEditor: Sample converted data for E1:', chakraPointsObject['E1']);
          console.log('ChakraEditor: All converted keys:', Object.keys(chakraPointsObject));
          console.log('ChakraEditor: About to set chakraPointsData with:', Object.keys(chakraPointsObject).length, 'items');
          setChakraPointsData(chakraPointsObject);
          
          // Verify the state was set correctly
          setTimeout(() => {
            console.log('ChakraEditor: State verification - chakraPointsData keys after setState:', Object.keys(chakraPointsData));
          }, 100);
        }
      } catch (error: any) {
        console.error('ChakraEditor: Failed to fetch chakra points - Full error object:', error);
        console.error('ChakraEditor: Error type:', typeof error);
        console.error('ChakraEditor: Error constructor:', error?.constructor?.name);
        console.error('ChakraEditor: Error message:', error?.message);
        console.error('ChakraEditor: Error status:', error?.status);
        
        // Check if this is a network/API unavailable error
        const isNetworkError = error?.status === 0 || 
                             error?.message?.includes('Network error') ||
                             error?.message?.includes('fetch') ||
                             error?.code === 'ECONNABORTED' ||
                             !error?.response;
        
        if (isNetworkError) {
          console.log('ChakraEditor: Network/API error detected, trying local storage fallback');
        }
        
        // Try to load from local storage as fallback
        try {
          const localData = localStorage.getItem('chakra_points');
          if (localData) {
            const parsedData = JSON.parse(localData);
            console.log('ChakraEditor: Loaded chakra points from local storage:', Object.keys(parsedData).length, 'points');
            console.log('ChakraEditor: Local storage data keys:', Object.keys(parsedData));
            console.log('ChakraEditor: Sample local storage data:', parsedData[Object.keys(parsedData)[0]]);
            
            // Convert array to object with chakra point IDs as keys
            const chakraPointsObject: { [key: string]: ChakraPoint } = {};
            
            // Force conversion regardless of data type - handle both array and object formats
            let dataArray: any[] = [];
            
            if (Array.isArray(parsedData)) {
              console.log('ChakraEditor: Local storage data is array, using directly');
              dataArray = parsedData;
            } else {
              console.log('ChakraEditor: Local storage data is object, converting to array');
              dataArray = Object.values(parsedData);
            }
            
            console.log('ChakraEditor: Processing local storage data array with', dataArray.length, 'items');
            dataArray.forEach((point: any, index: number) => {
              console.log(`ChakraEditor: Processing local storage point ${index}:`, point?.id, point?.name);
              if (point && point.id) {
                chakraPointsObject[point.id] = point;
                console.log(`ChakraEditor: Added local storage ${point.id} to object`);
              } else {
                console.log(`ChakraEditor: Skipping local storage point ${index} - no valid ID`);
              }
            });
            
            console.log('ChakraEditor: Converted local storage to object format:', Object.keys(chakraPointsObject));
            setChakraPointsData(chakraPointsObject);
          } else {
            console.log('ChakraEditor: No local storage data available');
          }
        } catch (localError) {
          console.error('ChakraEditor: Local storage fallback failed:', localError);
        }
      } finally {
        setIsLoadingChakraPoints(false);
      }
    };

    fetchChakraPoints();
  }, []);

  // Get chakra points data
  const chakraPoints = getChakraPointsInOrder();

  // Handle chakra point click
  const handleChakraPointClick = (point: any) => {
    console.log('ChakraEditor: Point clicked:', point);
    console.log('ChakraEditor: Available chakra points data keys:', Object.keys(chakraPointsData));
    console.log('ChakraEditor: Looking for point ID:', point.id);
    console.log('ChakraEditor: Total chakra points loaded:', Object.keys(chakraPointsData).length);
    
    // Check if the point ID exists in our data
    const availableIds = Object.keys(chakraPointsData);
    console.log('ChakraEditor: Available IDs:', availableIds);
    console.log('ChakraEditor: Is N1 in available IDs?', availableIds.includes('N1'));
    console.log('ChakraEditor: Is E1 in available IDs?', availableIds.includes('E1'));
    
    // Debug: Check what's actually in the state
    console.log('ChakraEditor: Raw chakraPointsData state:', chakraPointsData);
    console.log('ChakraEditor: Type of chakraPointsData:', typeof chakraPointsData);
    console.log('ChakraEditor: Is chakraPointsData an object?', typeof chakraPointsData === 'object');
    console.log('ChakraEditor: chakraPointsData constructor:', chakraPointsData?.constructor?.name);
    
    const chakraPointData = chakraPointsData[point.id];
    console.log('ChakraEditor: Found chakra point data:', chakraPointData);
    
    if (chakraPointData) {
      setSelectedChakraPoint(chakraPointData);
      setIsModalOpen(true);
      console.log('ChakraEditor: Modal should open now');
    } else {
      console.log('ChakraEditor: No data found for point ID:', point.id);
      console.log('ChakraEditor: This might mean the API data does not contain this chakra point ID');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    console.log('ChakraEditor: Modal close requested');
    setIsModalOpen(false);
    setSelectedChakraPoint(null);
  };

  // Debug modal state changes
  useEffect(() => {
    console.log('ChakraEditor: Modal state changed - isModalOpen:', isModalOpen, 'selectedChakraPoint:', selectedChakraPoint);
  }, [isModalOpen, selectedChakraPoint]);

  // Debug chakraPointsData state changes
  useEffect(() => {
    console.log('ChakraEditor: chakraPointsData state changed - keys:', Object.keys(chakraPointsData));
    console.log('ChakraEditor: chakraPointsData state changed - total items:', Object.keys(chakraPointsData).length);
    if (Object.keys(chakraPointsData).length > 0) {
      console.log('ChakraEditor: chakraPointsData state changed - sample keys:', Object.keys(chakraPointsData).slice(0, 5));
      console.log('ChakraEditor: chakraPointsData state changed - has N1?', 'N1' in chakraPointsData);
      console.log('ChakraEditor: chakraPointsData state changed - has E1?', 'E1' in chakraPointsData);
    }
  }, [chakraPointsData]);

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
    try {
      const chakraViewerElement = document.getElementById('chakra-viewer-container');
      if (!chakraViewerElement) return;

      // Create a high-resolution canvas for better quality
      const downloadCanvas = document.createElement('canvas');
      const ctx = downloadCanvas.getContext('2d');
      if (!ctx) return;

      // Get the container dimensions
      const containerRect = chakraViewerElement.getBoundingClientRect();
      
      // Use higher resolution (2x for retina displays, 3x for ultra-high quality)
      const scaleFactor = 3;
      downloadCanvas.width = containerRect.width * scaleFactor;
      downloadCanvas.height = containerRect.height * scaleFactor;

      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.scale(scaleFactor, scaleFactor);

      // Set white background instead of transparent
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, containerRect.width, containerRect.height);

      // Find the chakra image and floor plan image
      const chakraImg = chakraViewerElement.querySelector('img[alt="Vastu Chakra"]') as HTMLImageElement;
      const floorPlanImg = chakraViewerElement.querySelector('img[alt="Floor Plan"]') as HTMLImageElement;
      const centerMark = chakraViewerElement.querySelector('[style*="backgroundColor: red"]') as HTMLElement;

      // Get the transform container to understand positioning
      const transformContainer = chakraViewerElement.querySelector('[style*="transform: translate"]') as HTMLElement;
      if (!transformContainer) return;

      const containerCenterX = containerRect.width / 2;
      const containerCenterY = containerRect.height / 2;

      // Calculate the actual position considering the transform
      const transformX = position.x;
      const transformY = position.y;
      const scale = zoom;

      // Draw chakra image if it exists - maintain exact dimensions with high quality
      if (chakraImg && chakraImg.complete) {
        // Use the natural dimensions of the chakra image to maintain exact size
        const chakraNaturalWidth = chakraImg.naturalWidth;
        const chakraNaturalHeight = chakraImg.naturalHeight;
        
        // Calculate the display size based on the container and natural aspect ratio
        const maxChakraSize = Math.min(containerRect.width, containerRect.height) * 0.8; // 80% of container
        const chakraAspectRatio = chakraNaturalWidth / chakraNaturalHeight;
        
        let chakraDisplayWidth, chakraDisplayHeight;
        if (chakraAspectRatio > 1) {
          // Wider than tall
          chakraDisplayWidth = maxChakraSize;
          chakraDisplayHeight = maxChakraSize / chakraAspectRatio;
        } else {
          // Taller than wide or square
          chakraDisplayHeight = maxChakraSize;
          chakraDisplayWidth = maxChakraSize * chakraAspectRatio;
        }
        
        // Apply zoom scaling
        chakraDisplayWidth *= scale;
        chakraDisplayHeight *= scale;
        
        ctx.save();
        ctx.translate(containerCenterX + transformX, containerCenterY + transformY);
        ctx.rotate((-rotation * Math.PI) / 180);
        ctx.globalAlpha = chakraOpacity;
        
        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(
          chakraImg,
          -chakraDisplayWidth / 2,
          -chakraDisplayHeight / 2,
          chakraDisplayWidth,
          chakraDisplayHeight
        );
        ctx.restore();
      }

      // Draw floor plan image if it exists with high quality
      if (floorPlanImg && floorPlanImg.complete) {
        const floorPlanRect = floorPlanImg.getBoundingClientRect();
        const floorPlanX = containerCenterX + transformX - (floorPlanRect.width * scale) / 2;
        const floorPlanY = containerCenterY + transformY - (floorPlanRect.height * scale) / 2;
        
        ctx.globalAlpha = 0.75;
        
        // Use high-quality image rendering for floor plan
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(
          floorPlanImg,
          floorPlanX,
          floorPlanY,
          floorPlanRect.width * scale,
          floorPlanRect.height * scale
        );
        ctx.globalAlpha = 1;
      }

      // Draw center mark if it exists and is enabled
      if (showCenterMark && centerMark) {
        const centerX = containerCenterX + transformX;
        const centerY = containerCenterY + transformY;
        
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 7.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Get the canvas data as base64
      const canvasDataURL = downloadCanvas.toDataURL('image/png', 1.0);
      
      // Prepare the data to send to backend
      const chakraOverlayData = {
        image_data: canvasDataURL,
        image_format: 'png',
        original_filename: 'floorplan-chakra-overlay.png',
        chakra_settings: {
          rotation: rotation,
          zoom: zoom,
          chakra_opacity: chakraOpacity,
          show_center_mark: showCenterMark,
          position: position
        },
        floor_plan_url: floorPlanImageUrl,
        timestamp: new Date().toISOString()
      };

      // Send data to backend using existing API service
      try {
        // Convert base64 to blob for file creation
        const response = await fetch(canvasDataURL);
        const blob = await response.blob();
        const file = new File([blob], 'floorplan-chakra-overlay.png', { type: 'image/png' });
        
        const uploadResponse = await apiService.floorplan.uploadFloorplan(file);
        console.log('Floor plan data sent to backend successfully:', uploadResponse);
        
        // Also try to send additional chakra data if there's a specific endpoint
        // You can modify this based on your backend API structure
        // try {
        //   await apiService.vastu.analyze({
        //     property_type: 'residential',
        //     direction: 'north',
        //     floor_plan: file
        //   });
        //   console.log('Vastu analysis data sent successfully');
        // } catch (vastuError) {
        //   console.log('Vastu analysis endpoint not available or failed:', vastuError);
        // }
        
      } catch (apiError) {
        console.error('Failed to send data to backend:', apiError);
        // Still allow download even if API fails
      }

      // Create download link with high quality
      const link = document.createElement('a');
      link.href = canvasDataURL;
      link.download = 'floorplan-chakra-hq.png';
      link.click();
      
    } catch (error) {
      console.error('Error in download process:', error);
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
          {isLoadingChakraPoints ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Loading Chakra Points...
              </Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #1976d2',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </Box>
          ) : Object.keys(chakraPointsData).length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No Chakra Points Available
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Please add chakra points in the admin panel first.
              </Typography>
            </Box>
          ) : (
            <CircularImagePoints
              imageSrc="/images/Shakti Chakra_Size.png"
              points={chakraPoints}
              imageAlt="Vastu Chakra"
              rotation={rotation}
              onPointClick={handleChakraPointClick}
              containerClassName="w-full h-full"
              imageClassName="opacity-100"
            />
          )}

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

      {/* Chakra Details Modal */}
      <ChakraDetailsModal
        open={isModalOpen}
        onClose={handleModalClose}
        chakraPoint={selectedChakraPoint}
      />
    </Box>
  );
};

export default ChakraEditor; 