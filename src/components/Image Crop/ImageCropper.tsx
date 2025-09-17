// src/components/ui/ImageCropper.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  imageUrl: string;
  onImageLoaded?: () => void;
  onCropComplete: (cropData: CropData | null, userInteracted: boolean, croppedImageUrl?: string) => void;
}

interface Point {
  x: number;
  y: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onImageLoaded, onCropComplete }) => {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<Point | null>(null);
  const [drawEnd, setDrawEnd] = useState<Point | null>(null);
  const [shapeType, setShapeType] = useState<'polygon' | 'rectangle' | 'square'>(isMobile ? 'rectangle' : 'polygon');
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
    scaledWidth: number;
    scaledHeight: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // State to track touch interaction
  const [touchStartPos, setTouchStartPos] = useState<{x: number, y: number} | null>(null);
  const [touchMoved, setTouchMoved] = useState(false);

  // Get coordinates from either mouse or touch event
  const getEventCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Initialize canvas and load image
  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        // Get container size with mobile considerations
        const container = canvas.parentElement;
        if (!container) {
          console.warn('ImageCropper: Parent container not found, using default canvas size');
          canvas.width = isMobile ? 350 : 800;
          canvas.height = isMobile ? 400 : 600;
        } else {
          // Set canvas to container size with mobile-specific adjustments
          const maxWidth = container.clientWidth - (isMobile ? 20 : 0);
          const maxHeight = container.clientHeight - (isMobile ? 20 : 0);
          const aspectRatio = img.width / img.height;

          let canvasWidth = maxWidth;
          let canvasHeight = maxWidth / aspectRatio;

          if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = maxHeight * aspectRatio;
          }

          // Ensure canvas size doesn't exceed image's natural size
          canvasWidth = Math.min(canvasWidth, img.width);
          canvasHeight = Math.min(canvasHeight, img.height);

          // Mobile-specific minimum sizes
          if (isMobile) {
            canvasWidth = Math.max(canvasWidth, 300);
            canvasHeight = Math.max(canvasHeight, 300);
          }

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
        }

        // Calculate scaled image dimensions to fit canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (canvas.width - scaledWidth) / 2;
        const offsetY = (canvas.height - scaledHeight) / 2;

        setImageDimensions({
          width: img.width,
          height: img.height,
          scaledWidth,
          scaledHeight,
          offsetX,
          offsetY,
        });

        // Draw initial image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        if (onImageLoaded) {
          onImageLoaded();
        }
      };
    }
  }, [imageUrl, onImageLoaded, isMobile]);

  // Draw canvas with points and polygon
  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !imgRef.current || !imageDimensions) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { scaledWidth, scaledHeight, offsetX, offsetY } = imageDimensions;
    const pointSize = isMobile ? 12 : 8; // Larger points for mobile
    const lineWidth = isMobile ? 4 : 3; // Thicker lines for mobile

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image - ALWAYS draw the original image, not the cropped one
    ctx.drawImage(imgRef.current, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw points and lines ONLY if image is not cropped yet
    if (!croppedImage) {
      let drawPoints: Point[] = points;

      if (isDrawing && drawStart && drawEnd) {
        let start = drawStart;
        let end = {...drawEnd}; // copy to modify
        if (shapeType === 'square') {
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const side = Math.max(Math.abs(dx), Math.abs(dy));
          end.x = start.x + side * Math.sign(dx);
          end.y = start.y + side * Math.sign(dy);
        }
        const x1 = Math.min(start.x, end.x);
        const y1 = Math.min(start.y, end.y);
        const x2 = Math.max(start.x, end.x);
        const y2 = Math.max(start.y, end.y);
        drawPoints = [
          { x: x1, y: y1 },
          { x: x2, y: y1 },
          { x: x2, y: y2 },
          { x: x1, y: y2 },
        ];
      } else {
        drawPoints = points;
      }

      if (drawPoints.length > 0) {
        // Draw semi-transparent polygon fill
        if ((isPolygonClosed || isDrawing) && drawPoints.length > 2) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'; // Light blue fill for selected area
          ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
          drawPoints.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.closePath();
          ctx.fill();
        }

        // Draw lines
        ctx.beginPath();
        ctx.strokeStyle = '#00f';
        ctx.lineWidth = lineWidth;
        for (let i = 0; i < drawPoints.length - 1; i++) {
          ctx.moveTo(drawPoints[i].x, drawPoints[i].y);
          ctx.lineTo(drawPoints[i + 1].x, drawPoints[i + 1].y);
        }
        if ((isPolygonClosed || isDrawing) && drawPoints.length > 2) {
          ctx.lineTo(drawPoints[0].x, drawPoints[0].y);
        }
        ctx.stroke();

        // Draw points as larger circles for better visibility (especially on mobile)
        if (!isDrawing) { // Don't show points during initial draw
          drawPoints.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
          });
        }
      }
    }

    // If cropped, show the cropped result by drawing it over the original image
    if (croppedImage) {
      const croppedImg = new Image();
      croppedImg.onload = () => {
        // Clear the canvas and draw the cropped image centered
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate how to center the cropped image on the canvas
        const scale = Math.min(canvas.width / croppedImg.width, canvas.height / croppedImg.height);
        const displayWidth = croppedImg.width * scale;
        const displayHeight = croppedImg.height * scale;
        const displayX = (canvas.width - displayWidth) / 2;
        const displayY = (canvas.height - displayHeight) / 2;
        
        ctx.drawImage(croppedImg, displayX, displayY, displayWidth, displayHeight);
      };
      croppedImg.src = croppedImage;
    }
  }, [points, isPolygonClosed, croppedImage, imageDimensions, isMobile, isDrawing, drawStart, drawEnd, shapeType]);

  // Handle canvas click (mouse only) to add points for polygon
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (shapeType !== 'polygon' || croppedImage || isDragging !== null || 'touches' in e) return;

      const { x, y } = getEventCoordinates(e);
      const snapDistance = 15;

      // Check for auto-close (within snap distance of starting point)
      if (points.length > 2 && points[0]) {
        const dx = x - points[0].x;
        const dy = y - points[0].y;
        if (Math.sqrt(dx * dx + dy * dy) < snapDistance) {
          setIsPolygonClosed(true);
          setUserInteracted(true);
          return;
        }
      }

      setPoints([...points, { x, y }]);
      setUserInteracted(true);
    },
    [points, croppedImage, isDragging, shapeType]
  );

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || croppedImage) return;

      const { x, y } = getEventCoordinates(e);
      setTouchStartPos({ x, y });
      setTouchMoved(false);
      
      const snapDistance = 25; // Larger snap distance for mobile

      // Check if touching on an existing point for dragging
      for (let i = 0; i < points.length; i++) {
        const dx = x - points[i].x;
        const dy = y - points[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < snapDistance) {
          setIsDragging(i);
          setUserInteracted(true);
          e.preventDefault(); // Only prevent default when dragging
          return;
        }
      }

      // If no points and not polygon, start drawing
      if (points.length === 0 && shapeType !== 'polygon') {
        setIsDrawing(true);
        setDrawStart({ x, y });
        e.preventDefault();
      }
    },
    [points, croppedImage, shapeType]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!touchStartPos) return;

      const { x, y } = getEventCoordinates(e);
      const moveDistance = Math.sqrt(
        Math.pow(x - touchStartPos.x, 2) + Math.pow(y - touchStartPos.y, 2)
      );

      // If moved more than 10 pixels, consider it a move gesture
      if (moveDistance > 10) {
        setTouchMoved(true);
      }

      // Only handle dragging if we're actually dragging a point
      if (isDragging !== null) {
        e.preventDefault(); // Prevent scrolling only when dragging
        const newPoints = [...points];
        newPoints[isDragging] = { x, y };
        setPoints(newPoints);
      } else if (isDrawing) {
        e.preventDefault();
        setDrawEnd({ x, y });
      }
    },
    [touchStartPos, isDragging, points, isDrawing]
  );

  // Handle touch end
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || croppedImage || !touchStartPos) return;

      // If we were dragging, stop dragging
      if (isDragging !== null) {
        setIsDragging(null);
        setTouchStartPos(null);
        setTouchMoved(false);
        return;
      }

      // If drawing
      if (isDrawing) {
        if (touchMoved && drawStart && drawEnd) {
          let start = drawStart;
          let end = {...drawEnd};
          if (shapeType === 'square') {
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const side = Math.max(Math.abs(dx), Math.abs(dy));
            end.x = start.x + side * Math.sign(dx);
            end.y = start.y + side * Math.sign(dy);
          }
          const x1 = Math.min(start.x, end.x);
          const y1 = Math.min(start.y, end.y);
          const x2 = Math.max(start.x, end.x);
          const y2 = Math.max(start.y, end.y);
          if (x2 - x1 > 0 && y2 - y1 > 0) { // valid size
            setPoints([
              { x: x1, y: y1 },
              { x: x2, y: y1 },
              { x: x2, y: y2 },
              { x: x1, y: y2 },
            ]);
            setIsPolygonClosed(true);
            setUserInteracted(true);
          }
        }
        setIsDrawing(false);
        setDrawStart(null);
        setDrawEnd(null);
      } else if (shapeType === 'polygon' && !touchMoved) {
        // For polygon, handle tap to add point
        const { x, y } = touchStartPos;
        const snapDistance = 25;

        // Check for auto-close
        if (points.length > 2 && points[0]) {
          const dx = x - points[0].x;
          const dy = y - points[0].y;
          if (Math.sqrt(dx * dx + dy * dy) < snapDistance) {
            setIsPolygonClosed(true);
            setUserInteracted(true);
            setTouchStartPos(null);
            setTouchMoved(false);
            return;
          }
        }

        // Add new point
        setPoints([...points, { x, y }]);
        setUserInteracted(true);
      }

      setTouchStartPos(null);
      setTouchMoved(false);
    },
    [croppedImage, touchStartPos, touchMoved, isDragging, points, isDrawing, drawStart, drawEnd, shapeType]
  );

  // Handle mouse down for dragging points or starting draw (desktop)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || croppedImage) return;

      const { x, y } = getEventCoordinates(e);
      const snapDistance = 15;

      // Check if clicking on a point
      for (let i = 0; i < points.length; i++) {
        const dx = x - points[i].x;
        const dy = y - points[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < snapDistance) {
          setIsDragging(i);
          setUserInteracted(true);
          return;
        }
      }

      // If no points and not polygon, start drawing
      if (points.length === 0 && shapeType !== 'polygon') {
        setIsDrawing(true);
        setDrawStart({ x, y });
      }
    },
    [points, croppedImage, shapeType]
  );

  // Handle mouse move for dragging points or drawing (desktop)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging === null && !isDrawing || !canvasRef.current) return;

      const { x, y } = getEventCoordinates(e);

      if (isDragging !== null) {
        // Update point position
        const newPoints = [...points];
        newPoints[isDragging] = { x, y };
        setPoints(newPoints);
      } else if (isDrawing) {
        setDrawEnd({ x, y });
      }
    },
    [isDragging, points, isDrawing]
  );

  // Handle mouse up to stop dragging or drawing (desktop)
  const handleMouseUp = useCallback(() => {
    if (isDragging !== null) {
      setIsDragging(null);
    } else if (isDrawing) {
      if (drawStart && drawEnd) {
        let start = drawStart;
        let end = {...drawEnd};
        if (shapeType === 'square') {
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const side = Math.max(Math.abs(dx), Math.abs(dy));
          end.x = start.x + side * Math.sign(dx);
          end.y = start.y + side * Math.sign(dy);
        }
        const x1 = Math.min(start.x, end.x);
        const y1 = Math.min(start.y, end.y);
        const x2 = Math.max(start.x, end.x);
        const y2 = Math.max(start.y, end.y);
        if (x2 - x1 > 0 && y2 - y1 > 0) {
          setPoints([
            { x: x1, y: y1 },
            { x: x2, y: y1 },
            { x: x2, y: y2 },
            { x: x1, y: y2 },
          ]);
          setIsPolygonClosed(true);
          setUserInteracted(true);
        }
      }
      setIsDrawing(false);
      setDrawStart(null);
      setDrawEnd(null);
    }
  }, [isDragging, isDrawing, drawStart, drawEnd, shapeType]);

  // Auto crop handler - implemented internally to avoid module dependency
  const handleAutoCrop = useCallback(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Consider pixel as content if it's not fully transparent and not pure white
        if (a > 0 && (r < 255 || g < 255 || b < 255)) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (minX >= maxX || minY >= maxY) {
      console.warn('No content detected for auto crop');
      return;
    }

    // Add padding
    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width - 1, maxX + padding);
    maxY = Math.min(canvas.height - 1, maxY + padding);

    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    cropCtx.drawImage(
      canvas,
      minX,
      minY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const croppedImageUrl = cropCanvas.toDataURL('image/png');
    setCroppedImage(croppedImageUrl);
    onCropComplete(null, true, croppedImageUrl);
  }, [onCropComplete]);

  // Crop image to polygon
  const handleCrop = useCallback(() => {
    if (!canvasRef.current || !imgRef.current || !imageDimensions || points.length < 3 || !isPolygonClosed) return;

    const { width, height, scaledWidth, scaledHeight, offsetX, offsetY } = imageDimensions;
    
    // Create a temporary canvas for the original image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Set canvas to original image size
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    // Draw the original image at full resolution
    tempCtx.drawImage(imgRef.current, 0, 0, width, height);

    // Convert points from canvas coordinates to original image coordinates
    const imagePoints = points.map((p) => ({
      x: ((p.x - offsetX) / scaledWidth) * width,
      y: ((p.y - offsetY) / scaledHeight) * height,
    }));

    // Find bounding box of the polygon
    const bounds = {
      minX: Math.max(0, Math.min(...imagePoints.map((p) => p.x))),
      maxX: Math.min(width, Math.max(...imagePoints.map((p) => p.x))),
      minY: Math.max(0, Math.min(...imagePoints.map((p) => p.y))),
      maxY: Math.min(height, Math.max(...imagePoints.map((p) => p.y))),
    };

    // Create final cropped canvas
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    const cropWidth = bounds.maxX - bounds.minX;
    const cropHeight = bounds.maxY - bounds.minY;
    
    finalCanvas.width = cropWidth;
    finalCanvas.height = cropHeight;

    // Adjust polygon points relative to the crop area
    const adjustedPoints = imagePoints.map((p) => ({
      x: p.x - bounds.minX,
      y: p.y - bounds.minY,
    }));

    // Create clipping path for the polygon
    finalCtx.beginPath();
    adjustedPoints.forEach((p, i) => {
      if (i === 0) finalCtx.moveTo(p.x, p.y);
      else finalCtx.lineTo(p.x, p.y);
    });
    finalCtx.closePath();
    finalCtx.clip();

    // Draw the cropped portion of the image
    finalCtx.drawImage(
      tempCanvas,
      bounds.minX, bounds.minY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    // Convert to data URL
    const croppedImageUrl = finalCanvas.toDataURL('image/png');
    setCroppedImage(croppedImageUrl);

    // Create crop data for canvas coordinates
    const cropData: CropData = {
      x: (bounds.minX / width) * scaledWidth + offsetX,
      y: (bounds.minY / height) * scaledHeight + offsetY,
      width: (cropWidth / width) * scaledWidth,
      height: (cropHeight / height) * scaledHeight,
    };
    
    // Pass the cropped image URL as the third parameter
    onCropComplete(cropData, userInteracted, croppedImageUrl);
  }, [points, imageDimensions, isPolygonClosed, onCropComplete, userInteracted]);

  // Reset canvas
  const handleReset = useCallback(() => {
    setPoints([]);
    setIsPolygonClosed(false);
    setCroppedImage(null);
    setUserInteracted(false);
    onCropComplete(null, false);
  }, [onCropComplete]);

  // Undo last point
  const handleUndo = useCallback(() => {
    if (points.length > 0) {
      if (shapeType === 'polygon') {
        setPoints(points.slice(0, -1));
        setIsPolygonClosed(false);
        setUserInteracted(points.length > 1);
      } else {
        setPoints([]);
        setIsPolygonClosed(false);
        setUserInteracted(false);
      }
    }
  }, [points, shapeType]);

  // Redraw canvas when points or cropped image change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mobile-specific sizing
  const buttonFontSize = isMobile ? '0.8rem' : isTablet ? '0.9rem' : '1rem';
  const buttonPadding = isMobile ? '8px 16px' : isTablet ? '10px 20px' : '12px 24px';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 1 : 2,
      }}
    >
      {/* Shape type selector */}
      {!croppedImage && (
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1 }} flexWrap="wrap">
          <Button
            variant={shapeType === 'rectangle' ? 'contained' : 'outlined'}
            onClick={() => setShapeType('rectangle')}
            sx={{ 
              fontSize: buttonFontSize, 
              padding: buttonPadding, 
              minWidth: '100px',
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              ...(shapeType === 'rectangle' ? {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                }
              } : {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
                color: theme.palette.text.primary,
                '&:hover': {
                  borderColor: '#3b82f6',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  transform: 'translateY(-1px)',
                }
              })
            }}
          >
            📐 Rectangle
          </Button>
          <Button
            variant={shapeType === 'square' ? 'contained' : 'outlined'}
            onClick={() => setShapeType('square')}
            sx={{ 
              fontSize: buttonFontSize, 
              padding: buttonPadding, 
              minWidth: '100px',
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              ...(shapeType === 'square' ? {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                }
              } : {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
                color: theme.palette.text.primary,
                '&:hover': {
                  borderColor: '#3b82f6',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  transform: 'translateY(-1px)',
                }
              })
            }}
          >
            ⬜ Square
          </Button>
          {!isMobile && (
            <Button
              variant={shapeType === 'polygon' ? 'contained' : 'outlined'}
              onClick={() => setShapeType('polygon')}
              sx={{ 
                fontSize: buttonFontSize, 
                padding: buttonPadding, 
                minWidth: '100px',
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                ...(shapeType === 'polygon' ? {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                  }
                } : {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    borderColor: '#3b82f6',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                    transform: 'translateY(-1px)',
                  }
                })
              }}
            >
              🔷 Polygon
            </Button>
          )}
          <Button
            variant="outlined"
            disabled={true}
            sx={{ 
              fontSize: buttonFontSize, 
              padding: buttonPadding, 
              minWidth: '100px',
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
              color: theme.palette.text.disabled,
              '&:disabled': {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
                color: theme.palette.text.disabled,
                backgroundColor: 'transparent',
                transform: 'none',
              }
            }}
          >
            🤖 Auto Crop
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute',
                top: -8,
                right: -8,
                background: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                color: theme.palette.mode === 'dark' ? '#22c55e' : '#059669',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.7rem',
                fontWeight: 600,
                border: theme.palette.mode === 'dark' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              Coming Soon
            </Typography>
          </Button>
        </Stack>
      )}

      {/* Instructions for mobile */}
      {isMobile && !croppedImage && (
        <Box sx={{ 
          mb: 1, 
          p: 3, 
          background: theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}>
          <Typography variant="body2" sx={{ 
            color: theme.palette.text.secondary, 
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: 500,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {shapeType === 'polygon'
              ? '📱 Tap to add points • Tap close to first point to close • Touch & hold point to drag'
              : '📱 Drag to select area • Touch & hold corner to drag'}
          </Typography>
        </Box>
      )}

      {/* Canvas Container */}
      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          width: '100%',
          height: '100%',
          minHeight: isMobile ? '300px' : '400px',
          background: '#000',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {imageUrl ? (
          <>
            <canvas
              ref={canvasRef}
              // Mouse events (desktop)
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              // Touch events (mobile)
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                cursor: isDragging !== null ? 'grabbing' : 'crosshair',
              }}
            />
            <img
              ref={imgRef}
              alt="Source"
              src={imageUrl}
              style={{ display: 'none' }}
              onLoad={() => console.log('ImageCropper: Image loaded', imageUrl)}
            />
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No image to crop. Please upload one.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        spacing={isMobile ? 1 : 2} 
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={handleCrop}
          disabled={points.length < 3 || !isPolygonClosed || !!croppedImage}
          sx={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: buttonFontSize,
            padding: buttonPadding,
            minHeight: isMobile ? '44px' : 'auto',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
            },
            '&:disabled': {
              background: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.05)',
              color: theme.palette.text.disabled,
              boxShadow: 'none',
              transform: 'none',
            }
          }}
        >
          ✂️ Crop
        </Button>
        <Button
          variant="outlined"
          onClick={handleUndo}
          disabled={points.length === 0 || !!croppedImage}
          sx={{ 
            borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
            color: theme.palette.text.primary,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: buttonFontSize,
            padding: buttonPadding,
            minHeight: isMobile ? '44px' : 'auto',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#3b82f6',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
              color: theme.palette.text.disabled,
              backgroundColor: 'transparent',
              transform: 'none',
            }
          }}
        >
          ↶ Undo
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={points.length === 0 && !croppedImage}
          sx={{ 
            borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
            color: theme.palette.text.primary,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: buttonFontSize,
            padding: buttonPadding,
            minHeight: isMobile ? '44px' : 'auto',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#ef4444',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
              color: theme.palette.text.disabled,
              backgroundColor: 'transparent',
              transform: 'none',
            }
          }}
        >
          🔄 Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default ImageCropper;