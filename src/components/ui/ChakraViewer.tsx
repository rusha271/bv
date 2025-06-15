'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

interface ChakraViewerProps {
  rotation: number;
  zoom: number;
  chakraOpacity: number;
  showCenterMark: boolean;
  floorPlanImageUrl: string | null;
}

const ChakraViewer: React.FC<ChakraViewerProps> = ({
  rotation,
  zoom,
  chakraOpacity,
  showCenterMark,
  floorPlanImageUrl,
}) => {
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
      floorPlanElement.style.cursor = 'grab';
    };

    floorPlanElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      floorPlanElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, startDrag]);

  return (
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
        height: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
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
          transition: 'transform 0.1s ease-out',
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
              maxWidth: '70%',
              maxHeight: '70%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              pointerEvents: 'none',
              opacity: 0.4,
              filter: 'grayscale(90%)',
            }}
            draggable="false"
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
              opacity: 0.4,
              filter: 'grayscale(90%)',
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
              width: '10px',
              height: '10px',
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
  );
};

export default ChakraViewer; 