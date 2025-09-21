'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import Image from 'next/image';

interface Point {
  id: string;
  angle: number; // 0-360 degrees, 0 is East (right), 90 is North (top)
  distance: number; // 0-1, where 0 is center and 1 is outer edge
  color?: string;
  size?: number;
  label?: string;
}

interface CircularImagePointsProps {
  imageSrc: string;
  points: Point[];
  imageAlt?: string;
  containerClassName?: string;
  imageClassName?: string;
  rotation?: number; // Rotation in degrees
  onPointClick?: (point: Point) => void;
  onPointHover?: (point: Point | null) => void;
}

export const CircularImagePoints: React.FC<CircularImagePointsProps> = ({
  imageSrc,
  points,
  imageAlt = "Circular Image",
  containerClassName = "",
  imageClassName = "",
  rotation = 0,
  onPointClick,
  onPointHover
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate point position based on angle and distance
  const calculatePointPosition = (point: Point) => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return { left: 0, top: 0 };
    }

    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;
    
    // Calculate the radius based on the smaller dimension to ensure points stay within bounds
    const maxRadius = Math.min(centerX, centerY) * 0.6; // 60% of the smaller dimension for better text alignment
    
    // Convert angle to radians and apply rotation (0 degrees = East, 90 degrees = North)
    // Subtract rotation to make points rotate in the same direction as the chakra
    const rotatedAngle = (point.angle - rotation + 360) % 360;
    const angleInRadians = (rotatedAngle * Math.PI) / 180;
    
    // Calculate position
    const radius = maxRadius * point.distance;
    const x = centerX + radius * Math.cos(angleInRadians - Math.PI / 2); // Subtract π/2 to start from North
    const y = centerY + radius * Math.sin(angleInRadians - Math.PI / 2);
    
    // Convert to percentage for responsive positioning
    const leftPercent = (x / containerSize.width) * 100;
    const topPercent = (y / containerSize.height) * 100;
    
    return {
      left: Math.max(0, Math.min(100, leftPercent)),
      top: Math.max(0, Math.min(100, topPercent))
    };
  };

  const handlePointClick = (point: Point) => {
    if (onPointClick) {
      onPointClick(point);
    }
  };

  const handlePointHover = (point: Point | null) => {
    setHoveredPoint(point?.id || null);
    if (onPointHover) {
      onPointHover(point);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${containerClassName}`}
      style={{ position: 'relative' }}
    >
      {/* Lazy loaded Circular Image */}
      <Suspense fallback={
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full"
          style={{ position: 'absolute' }}
        >
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={`object-contain ${imageClassName}`}
          style={{ 
            position: 'absolute',
            transform: `rotate(${-rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease-out'
          }}
          loading="lazy"
          priority={false}
        />
      </Suspense>
      
      {/* Points */}
      {points.map((point) => {
        const position = calculatePointPosition(point);
        const pointSize = point.size || 12;
        
        return (
          <div
            key={point.id}
            className="absolute cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
              width: `${pointSize + 4}px`, // Larger clickable area
              height: `${pointSize + 4}px`, // Larger clickable area
              backgroundColor: point.color || '#ef4444',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)', // Center the point on the calculated position
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              zIndex: 10,
              opacity: hoveredPoint === point.id ? 1 : 0, // Invisible by default, visible on hover
              pointerEvents: 'auto' // Ensure clicks are captured
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              // console.log('CircularImagePoints: Point clicked:', point); // Debug log
              handlePointClick(point);
            }}
            onMouseEnter={() => handlePointHover(point)}
            onMouseLeave={() => handlePointHover(null)}
            title={point.label || point.id}
          >
            {/* Point Label */}
            {point.label && (
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-white bg-black bg-opacity-70 px-1 py-0.5 rounded whitespace-nowrap pointer-events-none"
                style={{ fontSize: '8px', zIndex: 20 }}
              >
                {point.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CircularImagePoints;
