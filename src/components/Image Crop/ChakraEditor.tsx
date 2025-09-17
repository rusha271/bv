'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Box, Typography, Slider, FormControlLabel, Switch, Button, Paper, TextField, Tooltip, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import BugReportIcon from '@mui/icons-material/BugReport';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Lazy load heavy dependencies
const ChakraDetailsModal = dynamic(() => import('@/components/Chakra/ChakraDetailsModal'), { ssr: false });
const CircularImagePoints = dynamic(() => import('@/components/CircularImagePoints'), { ssr: false });

// Lazy load API service and utilities
const loadApiService = () => import('@/utils/apiService');
const loadChakraUtils = () => import('@/utils/chakraCoordinateConverter');
const loadChakraTypes = () => import('@/types/chakra');


interface ChakraEditorProps {
  floorPlanImageUrl: string | null;
}

export const ChakraEditor: React.FC<ChakraEditorProps> = ({ floorPlanImageUrl }) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [chakraOpacity, setChakraOpacity] = useState(1);
  const [showCenterMark, setShowCenterMark] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedChakraPoint, setSelectedChakraPoint] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chakraPoints, setChakraPoints] = useState<any>({});
  const [chakraPointsList, setChakraPointsList] = useState<any[]>([]);
  const [showDebugPoints, setShowDebugPoints] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  
  // Lazy loading states
  const [isChakraImageLoaded, setIsChakraImageLoaded] = useState(false);
  const [isChakraPointsLoaded, setIsChakraPointsLoaded] = useState(false);
  const [isFloorPlanLoaded, setIsFloorPlanLoaded] = useState(false);
  const [isDependenciesLoaded, setIsDependenciesLoaded] = useState(false);

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

  // Lazy load dependencies on component mount
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [apiServiceModule, chakraTypesModule, chakraUtilsModule] = await Promise.all([
          loadApiService(),
          loadChakraTypes(),
          loadChakraUtils()
        ]);
        
        const { apiService } = apiServiceModule;
        const { defaultChakraPoints } = chakraTypesModule;
        const { getChakraPointsInOrder, getNumericId } = chakraUtilsModule;
        
        setChakraPoints(defaultChakraPoints);
        setChakraPointsList(getChakraPointsInOrder().map((point: any) => ({
          ...point,
          size: 16,
        })));
        setIsDependenciesLoaded(true);
      } catch (error) {
        console.log('Error loading dependencies:', error);
        setIsDependenciesLoaded(true);
      }
    };

    loadDependencies();
  }, []);

  // Lazy load chakra points from API when debug points are enabled
  useEffect(() => {
    if (showDebugPoints && !isChakraPointsLoaded && isDependenciesLoaded) {
      const fetchChakraPoints = async () => {
        try {
          const apiServiceModule = await loadApiService();
          const { apiService } = apiServiceModule;
          
          const data = await apiService.vastuChakraPoints.getChakraPoints();
          if (data && typeof data === 'object') {
            setChakraPoints(data);
            setIsChakraPointsLoaded(true);
          }
        } catch (error) {
          console.log('Using default chakra points data:', error);
          setIsChakraPointsLoaded(true);
          // Keep using default data if API fails
        }
      };

      fetchChakraPoints();
    }
  }, [showDebugPoints, isChakraPointsLoaded, isDependenciesLoaded]);

  const handleChakraPointClick = (chakraId: string) => {
    const chakraPoint = chakraPoints[chakraId];
    if (chakraPoint) {
      setSelectedChakraPoint(chakraPoint);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChakraPoint(null);
  };

  // Constants for rotation slider
  const totalDegrees = 365;

  // Note: Chakra point positioning is now handled by CircularImagePoints component

  const handleDownload = async () => {
    const chakraViewerElement = document.getElementById('chakra-viewer-container');
    if (chakraViewerElement) {
      try {
        // Lazy load html2canvas and apiService
        const [html2canvasModule, apiServiceModule] = await Promise.all([
          import('html2canvas'),
          loadApiService()
        ]);
        
        const html2canvas = html2canvasModule.default;
        const { apiService } = apiServiceModule;
        
        // Create a temporary container for rendering the image
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '1000px';
        tempContainer.style.height = '1000px';
        tempContainer.style.backgroundColor = '#f0f0f0';
  
        const chakraImg = document.createElement('img');
        chakraImg.src = '/images/Shakti Chakra_Size.png';
        chakraImg.style.position = 'absolute';
        chakraImg.style.opacity = chakraOpacity.toString();
        chakraImg.style.transform = `rotate(-${rotation}deg) scale(${zoom})`;
        chakraImg.style.transformOrigin = 'center center';
        chakraImg.style.width = '100%';
        chakraImg.style.height = '100%';
  
        const floorPlanImg = document.createElement('img');
        floorPlanImg.src = floorPlanImageUrl || '/floorplan.png';
        floorPlanImg.style.position = 'absolute';
        floorPlanImg.style.maxWidth = '50%';
        floorPlanImg.style.maxHeight = '50%';
        floorPlanImg.style.top = '50%';
        floorPlanImg.style.left = '50%';
        floorPlanImg.style.transform = 'translate(-50%, -50%)';
        floorPlanImg.style.opacity = '0.75';
        floorPlanImg.style.objectFit = 'contain';
  
        if (showCenterMark) {
          const centerMark = document.createElement('div');
          centerMark.style.position = 'absolute';
          centerMark.style.top = '50%';
          centerMark.style.left = '50%';
          centerMark.style.width = '15px';
          centerMark.style.height = '15px';
          centerMark.style.backgroundColor = 'red';
          centerMark.style.borderRadius = '50%';
          centerMark.style.transform = 'translate(-50%, -50%)';
          tempContainer.appendChild(centerMark);
        }
  
        tempContainer.appendChild(chakraImg);
        tempContainer.appendChild(floorPlanImg);
        document.body.appendChild(tempContainer);
  
        await Promise.all([
          new Promise((resolve) => (chakraImg.onload = resolve)),
          new Promise((resolve) => (floorPlanImg.onload = resolve)),
        ]);
  
        // Generate canvas
        const canvas = await html2canvas(tempContainer, {
          backgroundColor: null,
          logging: true,
          useCORS: true,
          allowTaint: true,
        });
  
        // Convert canvas to a File
        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'floorplan-chakra.png', { type: 'image/png' });
  
        // Upload to backend using floorplan.uploadFloorplan
        const response = await apiService.floorplan.uploadFloorplan(file);
        console.log('File uploaded successfully:', response);
  
        // Trigger download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'floorplan-chakra.png';
        link.click();
  
        // Clean up
        document.body.removeChild(tempContainer);
      } catch (error) {
        console.error('Error generating or uploading image:', error);
        // Optionally, show an error message to the user
        alert('Failed to generate or upload the image. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 1, md: 2 },
        height: { xs: 'auto', md: '70vh' },
        width: '100%',
        minHeight: { xs: '100vh', md: 'auto' },
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
          height: { xs: '60vh', sm: '50vh', md: '100%' },
          minHeight: { xs: '400px', sm: '450px', md: 'auto' },
          maxHeight: { xs: '500px', sm: '600px', md: 'none' },
          backgroundColor: '#f0f0f0',
          borderRadius: { xs: '12px', md: '8px' },
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          mb: { xs: 1, md: 0 },
          mx: { xs: 1, md: 0 },
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
          {/* Lazy loaded Chakra Image */}
          <Suspense fallback={
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '50%',
              }}
            >
              <CircularProgress 
                size={40}
                sx={{ color: 'primary.main' }}
              />
            </Box>
          }>
            <Image
              src="/images/Shakti Chakra_Size.png"
              alt="Vastu Chakra"
              fill
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: chakraOpacity,
                transform: `rotate(-${rotation}deg)`,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                transformOrigin: 'center center', // Ensure rotation is from the center
                pointerEvents: 'none',
                objectFit: 'contain',
              }}
              draggable="false"
              onLoad={() => setIsChakraImageLoaded(true)}
              priority={false} // Enable lazy loading
            />
          </Suspense>

          {floorPlanImageUrl ? (
            <Suspense fallback={
              <Box
                sx={{
                  position: 'absolute',
                  maxWidth: '50%',
                  maxHeight: '50%',
                  width: '200px',
                  height: '200px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: 1,
                }}
              >
                <CircularProgress 
                  size={30}
                  sx={{ color: 'primary.main' }}
                />
              </Box>
            }>
              <img
                src={floorPlanImageUrl}
                alt="Floor Plan"
                style={{
                  position: 'absolute',
                  maxWidth: '50%',
                  maxHeight: '50%',
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
                onLoad={() => setIsFloorPlanLoaded(true)}
                loading="lazy"
              />
            </Suspense>
          ) : (
            <Box
              sx={{
                position: 'absolute',
                width: '60%',
                height: '60%',
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
                width: '15px',
                height: '15px',
                backgroundColor: 'red',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Lazy loaded Chakra Points Overlay */}
          {showDebugPoints && (
            <Suspense fallback={
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: '50%',
                }}
              >
                <CircularProgress 
                  size={30}
                  sx={{ color: 'primary.main' }}
                />
              </Box>
            }>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 15,
                  pointerEvents: 'auto',
                }}
              >
                <Suspense fallback={
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <CircularProgress size={20} />
                  </Box>
                }>
                  <CircularImagePoints
                    imageSrc="/images/Shakti Chakra_Size.png"
                    points={chakraPointsList}
                    imageAlt="Vastu Chakra"
                    containerClassName="w-full h-full"
                    imageClassName="opacity-0" // Hide the duplicate image, we already have one
                    rotation={rotation} // Pass the rotation value
                    onPointClick={async (point: any) => {
                      console.log('Point clicked:', point); // Debug log
                      
                      // Load the utility function if not already loaded
                      const chakraUtilsModule = await loadChakraUtils();
                      const { getNumericId } = chakraUtilsModule;
                      
                      // Try to find the chakra point using the mapped numeric ID
                      const numericId = getNumericId(point.id);
                      const chakraPoint = numericId ? chakraPoints[numericId] : chakraPoints[point.id];
                      
                      console.log('Chakra point found:', chakraPoint); // Debug log
                      console.log('Available chakra points:', Object.keys(chakraPoints)); // Debug log
                      if (chakraPoint) {
                        console.log('Opening modal for:', chakraPoint.name); // Debug log
                        setSelectedChakraPoint(chakraPoint);
                        setIsModalOpen(true);
                      } else {
                        console.error('No chakra point found for ID:', point.id, 'mapped to numeric ID:', numericId);
                        console.error('Available IDs:', Object.keys(chakraPoints));
                      }
                    }}
                    onPointHover={(point: any) => {
                      setHoveredPoint(point?.id || null);
                    }}
                  />
                </Suspense>
              </Box>
            </Suspense>
          )}
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 2 },
          bgcolor: 'background.paper',
          height: { xs: 'auto', md: '100%' },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: '12px', md: '8px' },
          width: { xs: '100%', md: '300px' },
          flexShrink: 0,
          mx: { xs: 1, md: 0 },
          mb: { xs: 2, md: 0 },
          maxHeight: { xs: '50vh', md: 'none' },
          overflow: { xs: 'auto', md: 'visible' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6">Controls</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>Rotate the Chakra</Typography>
          <TextField
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value) % totalDegrees)} // Normalize to 0-364 degrees
            type="number"
            size="small"
            InputProps={{ endAdornment: <Typography sx={{ ml: 0.5 }}>°</Typography> }}
            sx={{ width: '80px', mb: 1 }}
          />
          <Slider
            value={rotation}
            onChange={(_event, newValue) => setRotation((newValue as number) % totalDegrees)} // Normalize to 0-364 degrees
            aria-labelledby="chakra-rotation-slider"
            min={0}
            max={totalDegrees}
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

        {/* <Box sx={{ mb: 2 }}>
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
        </Box> */}

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

        
        {/* <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setShowUserForm(!showUserForm)}
            fullWidth
            sx={{
              backgroundColor: '#FDD835',
              color: '#000',
              '&:hover': { backgroundColor: '#FDD835', opacity: 0.9 },
              boxShadow: 'none',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              py: 1,
              borderRadius: '8px',
            }}
          >
            {showUserForm ? 'Hide User Form' : 'Show User Form'}
          </Button>
        </Box>
        {showUserForm && <UserDetailsForm />} */}

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          fullWidth
          sx={{
            mt: 'auto',
            backgroundColor: '#FDD835',
            color: '#000',
            '&:hover': { backgroundColor: '#FDD835', opacity: 0.9 },
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

      {/* Lazy loaded Chakra Details Modal */}
      {isModalOpen && (
        <Suspense fallback={
          <Box sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999
          }}>
            <CircularProgress size={48} />
          </Box>
        }>
          <ChakraDetailsModal
            open={isModalOpen}
            onClose={closeModal}
            chakraPoint={selectedChakraPoint}
          />
        </Suspense>
      )}
    </Box>
  );
};

export default ChakraEditor;