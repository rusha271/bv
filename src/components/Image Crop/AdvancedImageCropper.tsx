'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography, IconButton, Tooltip, Slider, FormControlLabel, Switch } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import EditIcon from '@mui/icons-material/Edit';
import MouseIcon from '@mui/icons-material/Mouse';
import CropFreeIcon from '@mui/icons-material/CropFree';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CropIcon from '@mui/icons-material/Crop';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ClearIcon from '@mui/icons-material/Clear';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AdvancedImageCropperProps {
  imageUrl: string;
  onImageLoaded?: () => void;
  onCropComplete: (cropData: CropData | null, userInteracted: boolean, croppedImageUrl?: string) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  tool: 'pencil' | 'eraser';
  brushSize: number;
  color: string;
}

type ToolType = 'pointer' | 'pencil' | 'eraser' | 'rectangle' | 'square' | 'polygon' | 'auto';

const AdvancedImageCropper: React.FC<AdvancedImageCropperProps> = ({ 
  imageUrl, 
  onImageLoaded, 
  onCropComplete 
}) => {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tool and drawing states
  const [activeTool, setActiveTool] = useState<ToolType>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [brushSize, setBrushSize] = useState(10);
  const [eraserSize, setEraserSize] = useState(20);
  const [isErasing, setIsErasing] = useState(false);
  
  // Selection states
  const [selectedArea, setSelectedArea] = useState<Point[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Point | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Point | null>(null);
  
  // Legacy crop states (for rectangle/square/polygon)
  const [points, setPoints] = useState<Point[]>([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [drawStart, setDrawStart] = useState<Point | null>(null);
  const [drawEnd, setDrawEnd] = useState<Point | null>(null);
  const [shapeType, setShapeType] = useState<'polygon' | 'rectangle' | 'square'>('rectangle');
  
  // Image and canvas states
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
  
  // History for undo/redo
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Touch states
  const [touchStartPos, setTouchStartPos] = useState<{x: number, y: number} | null>(null);
  const [touchMoved, setTouchMoved] = useState(false);

  // Get coordinates from either mouse or touch event
  const getEventCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Initialize canvas and load image
  useEffect(() => {
    if (imageUrl && canvasRef.current && overlayCanvasRef.current) {
      const canvas = canvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const overlayCtx = overlayCanvas.getContext('2d');
      
      if (!ctx || !overlayCtx) return;

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const container = canvas.parentElement;
        if (!container) {
          canvas.width = isMobile ? 350 : 800;
          canvas.height = isMobile ? 400 : 600;
        } else {
          const maxWidth = container.clientWidth - (isMobile ? 20 : 0);
          const maxHeight = container.clientHeight - (isMobile ? 20 : 0);
          const aspectRatio = img.width / img.height;

          let canvasWidth = maxWidth;
          let canvasHeight = maxWidth / aspectRatio;

          if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = maxHeight * aspectRatio;
          }

          canvasWidth = Math.min(canvasWidth, img.width);
          canvasHeight = Math.min(canvasHeight, img.height);

          if (isMobile) {
            canvasWidth = Math.max(canvasWidth, 300);
            canvasHeight = Math.max(canvasHeight, 300);
          }

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          overlayCanvas.width = canvasWidth;
          overlayCanvas.height = canvasHeight;
        }

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
        
        // Clear overlay
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        if (onImageLoaded) {
          onImageLoaded();
        }
      };
    }
  }, [imageUrl, onImageLoaded, isMobile]);

  // Draw overlay canvas (strokes, selections, etc.)
  const drawOverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !imageDimensions) return;
    
    const overlayCanvas = overlayCanvasRef.current;
    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Draw all strokes
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === 'eraser' ? 'rgba(255, 0, 0, 0.5)' : stroke.color;
      ctx.lineWidth = stroke.brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // Draw current stroke being drawn
    if (currentStroke.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = isErasing ? 'rgba(255, 0, 0, 0.5)' : '#00f';
      ctx.lineWidth = isErasing ? eraserSize : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }

    // Draw selection area
    if (selectedArea.length > 2) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      
      ctx.moveTo(selectedArea[0].x, selectedArea[0].y);
      selectedArea.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw legacy polygon/rectangle selection
    if (points.length > 0 && (activeTool === 'rectangle' || activeTool === 'square' || activeTool === 'polygon')) {
      let drawPoints: Point[] = points;

      if (isDrawing && drawStart && drawEnd) {
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
        drawPoints = [
          { x: x1, y: y1 },
          { x: x2, y: y1 },
          { x: x2, y: y2 },
          { x: x1, y: y2 },
        ];
      }

      if (drawPoints.length > 0) {
        // Draw semi-transparent polygon fill
        if ((isPolygonClosed || isDrawing) && drawPoints.length > 2) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
          ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
          drawPoints.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.closePath();
          ctx.fill();
        }

        // Draw lines
        ctx.beginPath();
        ctx.strokeStyle = '#00f';
        ctx.lineWidth = 3;
        for (let i = 0; i < drawPoints.length - 1; i++) {
          ctx.moveTo(drawPoints[i].x, drawPoints[i].y);
          ctx.lineTo(drawPoints[i + 1].x, drawPoints[i + 1].y);
        }
        if ((isPolygonClosed || isDrawing) && drawPoints.length > 2) {
          ctx.lineTo(drawPoints[0].x, drawPoints[0].y);
        }
        ctx.stroke();

        // Draw points
        if (!isDrawing) {
          drawPoints.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
          });
        }
      }
    }
  }, [strokes, currentStroke, selectedArea, points, isPolygonClosed, isDrawing, drawStart, drawEnd, shapeType, activeTool, isErasing, brushSize, eraserSize, imageDimensions]);

  // Handle pencil/eraser drawing
  const handleDrawingStart = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'pencil' && activeTool !== 'eraser') return;
    
    const { x, y } = getEventCoordinates(e);
    setIsDrawing(true);
    setIsErasing(activeTool === 'eraser');
    setCurrentStroke([{ x, y }]);
    setUserInteracted(true);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [activeTool]);

  const handleDrawingMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || (activeTool !== 'pencil' && activeTool !== 'eraser')) return;
    
    const { x, y } = getEventCoordinates(e);
    setCurrentStroke(prev => [...prev, { x, y }]);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [isDrawing, activeTool]);

  const handleDrawingEnd = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || (activeTool !== 'pencil' && activeTool !== 'eraser')) return;
    
    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        points: [...currentStroke],
        tool: isErasing ? 'eraser' : 'pencil',
        brushSize: isErasing ? eraserSize : brushSize,
        color: isErasing ? 'rgba(255, 0, 0, 0.5)' : '#00f'
      };
      
      // Save to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...strokes, newStroke]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      setStrokes(prev => [...prev, newStroke]);
      
      // Apply the stroke immediately to the main canvas for visual feedback
      applyStrokeToMainCanvas(newStroke);
    }
    
    setIsDrawing(false);
    setCurrentStroke([]);
    setIsErasing(false);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [isDrawing, activeTool, currentStroke, isErasing, eraserSize, brushSize, strokes, history, historyIndex]);

  // Handle pointer tool selection
  const handlePointerStart = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'pointer') return;
    
    const { x, y } = getEventCoordinates(e);
    setIsSelecting(true);
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
    setUserInteracted(true);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [activeTool]);

  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isSelecting || activeTool !== 'pointer') return;
    
    const { x, y } = getEventCoordinates(e);
    setSelectionEnd({ x, y });
    
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [isSelecting, activeTool]);

  const handlePointerEnd = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isSelecting || activeTool !== 'pointer') return;
    
    if (selectionStart && selectionEnd) {
      const x1 = Math.min(selectionStart.x, selectionEnd.x);
      const y1 = Math.min(selectionStart.y, selectionEnd.y);
      const x2 = Math.max(selectionStart.x, selectionEnd.x);
      const y2 = Math.max(selectionStart.y, selectionEnd.y);
      
      if (x2 - x1 > 10 && y2 - y1 > 10) {
        setSelectedArea([
          { x: x1, y: y1 },
          { x: x2, y: y1 },
          { x: x2, y: y2 },
          { x: x1, y: y2 }
        ]);
      }
    }
    
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [isSelecting, activeTool, selectionStart, selectionEnd]);

  // Legacy polygon/rectangle handlers (simplified)
  const handleLegacyClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'polygon' || croppedImage || isDragging !== null || 'touches' in e) return;

    const { x, y } = getEventCoordinates(e);
    const snapDistance = 15;

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
  }, [activeTool, points, croppedImage, isDragging]);

  // Apply a single stroke to the main canvas for immediate visual feedback
  const applyStrokeToMainCanvas = useCallback((stroke: Stroke) => {
    if (!canvasRef.current || !imageDimensions) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || stroke.points.length < 2) return;

    const { width, height, scaledWidth, scaledHeight, offsetX, offsetY } = imageDimensions;
    
    // Set up the drawing context
    ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : 'transparent';
    ctx.lineWidth = stroke.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw the stroke
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    ctx.stroke();
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }, [imageDimensions]);

  // Apply pencil/eraser strokes to create crop
  const applyStrokesToCrop = useCallback(() => {
    if (!canvasRef.current || !imgRef.current || !imageDimensions) return;

    const { width, height, scaledWidth, scaledHeight, offsetX, offsetY } = imageDimensions;
    
    // Create a temporary canvas for the original image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.drawImage(imgRef.current, 0, 0, width, height);

    // If no strokes, just return the original image
    if (strokes.length === 0) {
      const croppedImageUrl = tempCanvas.toDataURL('image/png');
      setCroppedImage(croppedImageUrl);
      onCropComplete(null, userInteracted, croppedImageUrl);
      return;
    }

    // Create final canvas for the result
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    finalCanvas.width = width;
    finalCanvas.height = height;
    
    // Start with the original image
    finalCtx.drawImage(tempCanvas, 0, 0);

    // Apply each stroke directly to the image
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      // Set up the drawing context
      finalCtx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      finalCtx.strokeStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : 'transparent';
      finalCtx.lineWidth = (stroke.brushSize / scaledWidth) * width;
      finalCtx.lineCap = 'round';
      finalCtx.lineJoin = 'round';
      
      // Convert points to image coordinates
      const imagePoints = stroke.points.map(point => ({
        x: ((point.x - offsetX) / scaledWidth) * width,
        y: ((point.y - offsetY) / scaledHeight) * height
      }));
      
      // Draw the stroke
      finalCtx.beginPath();
      finalCtx.moveTo(imagePoints[0].x, imagePoints[0].y);
      
      for (let i = 1; i < imagePoints.length; i++) {
        finalCtx.lineTo(imagePoints[i].x, imagePoints[i].y);
      }
      
      finalCtx.stroke();
    });

    // Reset composite operation
    finalCtx.globalCompositeOperation = 'source-over';

    const croppedImageUrl = finalCanvas.toDataURL('image/png');
    setCroppedImage(croppedImageUrl);
    onCropComplete(null, userInteracted, croppedImageUrl);
    
    // Clear strokes and selection after applying crop
    setStrokes([]);
    setCurrentStroke([]);
    setSelectedArea([]);
    setPoints([]);
    setIsPolygonClosed(false);
  }, [strokes, imageDimensions, onCropComplete, userInteracted]);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setStrokes(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setStrokes(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  // Clear all strokes
  const handleClear = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
    setSelectedArea([]);
    setPoints([]);
    setIsPolygonClosed(false);
    setUserInteracted(false);
    onCropComplete(null, false);
  }, [onCropComplete]);

  // Redraw overlay when strokes change
  useEffect(() => {
    drawOverlay();
  }, [drawOverlay]);

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
      {/* Tool Selection */}
      {!croppedImage && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            textAlign: 'center',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            🛠️ Select Tool
          </Typography>
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ gap: 1 }}
          >
            <Tooltip title="Pointer Tool - Select areas">
              <IconButton
                onClick={() => setActiveTool('pointer')}
                sx={{
                  backgroundColor: activeTool === 'pointer' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : theme.palette.mode === 'dark' 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'pointer' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'pointer' 
                    ? 'none'
                    : theme.palette.mode === 'dark'
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'pointer'
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: activeTool === 'pointer'
                      ? '0 8px 25px rgba(59, 130, 246, 0.4)'
                      : '0 4px 15px rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <MouseIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Pencil Tool - Draw crop area">
              <IconButton
                onClick={() => setActiveTool('pencil')}
                sx={{
                  backgroundColor: activeTool === 'pencil' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : theme.palette.mode === 'dark' 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'pencil' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'pencil' 
                    ? 'none'
                    : theme.palette.mode === 'dark'
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'pencil'
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: activeTool === 'pencil'
                      ? '0 8px 25px rgba(59, 130, 246, 0.4)'
                      : '0 4px 15px rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <BrushIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Eraser Tool - Remove areas">
              <IconButton
                onClick={() => setActiveTool('eraser')}
                sx={{
                  backgroundColor: activeTool === 'eraser' 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : theme.palette.mode === 'dark' 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'eraser' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'eraser' 
                    ? 'none'
                    : theme.palette.mode === 'dark'
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'eraser'
                      ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(239, 68, 68, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: activeTool === 'eraser'
                      ? '0 8px 25px rgba(239, 68, 68, 0.4)'
                      : '0 4px 15px rgba(239, 68, 68, 0.2)',
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Rectangle Tool">
              <IconButton
                onClick={() => setActiveTool('rectangle')}
                sx={{
                  backgroundColor: activeTool === 'rectangle' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : theme.palette.mode === 'dark' 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'rectangle' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'rectangle' 
                    ? 'none'
                    : theme.palette.mode === 'dark'
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'rectangle'
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: activeTool === 'rectangle'
                      ? '0 8px 25px rgba(59, 130, 246, 0.4)'
                      : '0 4px 15px rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <CropFreeIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Square Tool">
              <IconButton
                onClick={() => setActiveTool('square')}
                sx={{
                  backgroundColor: activeTool === 'square' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : theme.palette.mode === 'dark' 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'square' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'square' 
                    ? 'none'
                    : theme.palette.mode === 'dark'
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'square'
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: activeTool === 'square'
                      ? '0 8px 25px rgba(59, 130, 246, 0.4)'
                      : '0 4px 15px rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <CropSquareIcon />
              </IconButton>
            </Tooltip>
            
            {!isMobile && (
              <Tooltip title="Polygon Tool">
                <IconButton
                  onClick={() => setActiveTool('polygon')}
                  sx={{
                    backgroundColor: activeTool === 'polygon' 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                      : theme.palette.mode === 'dark' 
                        ? 'rgba(148, 163, 184, 0.1)' 
                        : 'rgba(148, 163, 184, 0.05)',
                    color: activeTool === 'polygon' ? 'white' : theme.palette.text.primary,
                    border: activeTool === 'polygon' 
                      ? 'none'
                      : theme.palette.mode === 'dark'
                        ? '1px solid rgba(148, 163, 184, 0.2)'
                        : '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      backgroundColor: activeTool === 'polygon'
                        ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                        : theme.palette.mode === 'dark'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(59, 130, 246, 0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: activeTool === 'polygon'
                        ? '0 8px 25px rgba(59, 130, 246, 0.4)'
                        : '0 4px 15px rgba(59, 130, 246, 0.2)',
                    }
                  }}
                >
                  <CropIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Auto Crop - Coming Soon">
              <IconButton
                disabled={true}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(148, 163, 184, 0.1)' 
                    : 'rgba(148, 163, 184, 0.05)',
                  color: theme.palette.text.disabled,
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(148, 163, 184, 0.2)'
                    : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:disabled': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                    color: theme.palette.text.disabled,
                    transform: 'none',
                  }
                }}
              >
                <AutoFixHighIcon />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                    color: theme.palette.mode === 'dark' ? '#22c55e' : '#059669',
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  Soon
                </Typography>
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      )}

      {/* Tool Options */}
      {!croppedImage && (activeTool === 'pencil' || activeTool === 'eraser') && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {activeTool === 'pencil' ? 'Pencil Settings' : 'Eraser Settings'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ minWidth: '60px' }}>
              Size: {activeTool === 'pencil' ? brushSize : eraserSize}px
            </Typography>
            <Slider
              value={activeTool === 'pencil' ? brushSize : eraserSize}
              onChange={(_, value) => {
                if (activeTool === 'pencil') {
                  setBrushSize(value as number);
                } else {
                  setEraserSize(value as number);
                }
              }}
              min={5}
              max={50}
              sx={{ flexGrow: 1 }}
            />
          </Box>
        </Box>
      )}

      {/* Instructions */}
      {!croppedImage && (
        <Box sx={{ mb: 1, p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.8rem' }}>
            {activeTool === 'pointer' && '🖱️ Click and drag to select rectangular areas'}
            {activeTool === 'pencil' && '✏️ Draw to mark areas to keep (applied immediately)'}
            {activeTool === 'eraser' && '🧽 Draw to remove areas (applied immediately)'}
            {activeTool === 'rectangle' && '📐 Click and drag to create rectangle'}
            {activeTool === 'square' && '⬜ Click and drag to create square'}
            {activeTool === 'polygon' && '📐 Click to add points, click near start to close'}
            {activeTool === 'auto' && '🤖 Click to auto-detect and crop content'}
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
              onClick={handleLegacyClick}
              onMouseDown={(e) => {
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingStart(e);
                } else if (activeTool === 'pointer') {
                  handlePointerStart(e);
                }
              }}
              onMouseMove={(e) => {
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingMove(e);
                } else if (activeTool === 'pointer') {
                  handlePointerMove(e);
                }
              }}
              onMouseUp={(e) => {
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingEnd(e);
                } else if (activeTool === 'pointer') {
                  handlePointerEnd(e);
                }
              }}
              onTouchStart={(e) => {
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingStart(e);
                } else if (activeTool === 'pointer') {
                  handlePointerStart(e);
                }
              }}
              onTouchMove={(e) => {
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingMove(e);
                } else if (activeTool === 'pointer') {
                  handlePointerMove(e);
                }
              }}
              onTouchEnd={(e) => {
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingEnd(e);
                } else if (activeTool === 'pointer') {
                  handlePointerEnd(e);
                }
              }}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                cursor: activeTool === 'pointer' ? 'crosshair' : 
                       activeTool === 'pencil' ? 'crosshair' :
                       activeTool === 'eraser' ? 'crosshair' : 'crosshair',
              }}
            />
            <canvas
              ref={overlayCanvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
            <img
              ref={imgRef}
              alt="Source"
              src={imageUrl}
              style={{ display: 'none' }}
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
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          onClick={applyStrokesToCrop}
          disabled={strokes.length === 0 || !!croppedImage}
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
          ✂️ Finalize Crop
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<UndoIcon />}
          onClick={handleUndo}
          disabled={historyIndex <= 0}
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
          startIcon={<RedoIcon />}
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
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
          ↷ Redo
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClear}
          disabled={strokes.length === 0 && points.length === 0}
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
          🗑️ Clear
        </Button>
        
        <Button
          variant="outlined"
          disabled={true}
          sx={{ 
            borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
            color: theme.palette.text.disabled,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: buttonFontSize,
            padding: buttonPadding,
            minHeight: isMobile ? '44px' : 'auto',
            transition: 'all 0.3s ease',
            position: 'relative',
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
    </Box>
  );
};

export default AdvancedImageCropper;
