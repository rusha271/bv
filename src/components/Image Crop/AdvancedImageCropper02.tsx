'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography, IconButton, Tooltip, Slider, FormControlLabel, Switch, Tabs, Tab } from '@mui/material';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import MouseIcon from '@mui/icons-material/Mouse';
import CropIcon from '@mui/icons-material/Crop';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ClearIcon from '@mui/icons-material/Clear';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageCropper from './ImageCropper';

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

type ToolType = 'pointer' | 'pencil' | 'eraser' | 'auto';

const AdvancedImageCropper: React.FC<AdvancedImageCropperProps> = ({ 
  imageUrl, 
  onImageLoaded, 
  onCropComplete 
}) => {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  
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
  
  // History for undo/redo - comprehensive system
  const [history, setHistory] = useState<{
    strokes: Stroke[];
    selectedArea: Point[];
  }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Touch states
  const [touchStartPos, setTouchStartPos] = useState<{x: number, y: number} | null>(null);
  const [touchMoved, setTouchMoved] = useState(false);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const currentState = {
      strokes: [...strokes],
      selectedArea: [...selectedArea]
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [strokes, selectedArea, history, historyIndex]);

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
    // Add a small delay to ensure canvas elements are rendered
    const timer = setTimeout(() => {
      if (imageUrl && canvasRef.current && overlayCanvasRef.current) {
      const canvas = canvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const overlayCtx = overlayCanvas.getContext('2d');
      
      if (!ctx || !overlayCtx) {
        return;
      }

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        // Debug: Log image dimensions
        console.log('🖼️ Image loaded:', {
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        });
        
        // Use the same canvas sizing logic as ImageCropper
        const container = canvas.parentElement;
        let canvasWidth, canvasHeight;
        
        if (!container) {
          canvasWidth = isMobile ? 350 : 800;
          canvasHeight = isMobile ? 400 : 600;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          overlayCanvas.width = canvasWidth;
          overlayCanvas.height = canvasHeight;
        } else {
          // Set canvas to container size with mobile-specific adjustments
          const maxWidth = container.clientWidth - (isMobile ? 20 : 0);
          const maxHeight = container.clientHeight - (isMobile ? 20 : 0);
          const aspectRatio = img.width / img.height;

          canvasWidth = maxWidth;
          canvasHeight = maxWidth / aspectRatio;

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
          overlayCanvas.width = canvasWidth;
          overlayCanvas.height = canvasHeight;
        }
        
        console.log('🎨 Canvas dimensions:', {
          canvasWidth,
          canvasHeight,
          originalImageWidth: img.width,
          originalImageHeight: img.height
        });
        
        // Use device pixel ratio for high quality
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scaleFactor = Math.max(devicePixelRatio, 1.5);
        
        // Set canvas internal dimensions (high resolution)
        const internalWidth = canvasWidth * scaleFactor;
        const internalHeight = canvasHeight * scaleFactor;
        
        console.log('🔧 Canvas setup:', {
          internalWidth,
          internalHeight,
          displayWidth: canvasWidth,
          displayHeight: canvasHeight,
          scaleFactor
        });
        
        canvas.width = internalWidth;
        canvas.height = internalHeight;
        overlayCanvas.width = internalWidth;
        overlayCanvas.height = internalHeight;
        
        // Set CSS display size to match image dimensions exactly
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        overlayCanvas.style.width = `${canvasWidth}px`;
        overlayCanvas.style.height = `${canvasHeight}px`;
        
        console.log('✅ Canvas final setup complete');
        
        // Ensure proper positioning
        canvas.style.position = 'relative';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.pointerEvents = 'none';

        // Calculate scaled image dimensions to fit canvas (same as ImageCropper)
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (canvas.width - scaledWidth) / 2;
        const offsetY = (canvas.height - scaledHeight) / 2;
        
        console.log('🖼️ Image drawing:', {
          offsetX,
          offsetY,
          scaledWidth,
          scaledHeight,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          scale
        });
        
        // Enable high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Set white background to prevent black areas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setImageDimensions({
          width: img.width,
          height: img.height,
          scaledWidth,
          scaledHeight,
          offsetX,
          offsetY,
        });

        // Store the image in imgRef for later use
        if (imgRef.current) {
          imgRef.current.src = imageUrl;
        } else {
          // Create imgRef if it doesn't exist
          const imgElement = new Image();
          imgElement.src = imageUrl;
          imgElement.onload = () => {
            // Trigger a redraw when the image is loaded
            setTimeout(() => {
              if (imageDimensions) {
                drawMainCanvas();
              }
            }, 100);
          };
          // Store reference for later use
          (imgRef as any).current = imgElement;
        }

        // Clear overlay
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        // Draw the main canvas (this will be called again by useEffect when imageDimensions changes)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Enable high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        if (onImageLoaded) {
          onImageLoaded();
        }
      };
    }
    }, 100); // 100ms delay to ensure canvas elements are rendered
    
    return () => clearTimeout(timer);
  }, [imageUrl, onImageLoaded, isMobile]);

  // Draw main canvas with image and cropped result
  const drawMainCanvas = useCallback(() => {
    if (!canvasRef.current || !imageDimensions) {
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { scaledWidth, scaledHeight, offsetX, offsetY } = imageDimensions;
    
    // Clear canvas and set white background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    if (croppedImage) {
      // If we have a cropped image, display it centered
      const croppedImg = new Image();
      croppedImg.onload = () => {
        const scale = Math.min(canvas.width / croppedImg.width, canvas.height / croppedImg.height);
        const displayWidth = croppedImg.width * scale;
        const displayHeight = croppedImg.height * scale;
        const displayX = (canvas.width - displayWidth) / 2;
        const displayY = (canvas.height - displayHeight) / 2;
        
        ctx.drawImage(croppedImg, displayX, displayY, displayWidth, displayHeight);
      };
      croppedImg.src = croppedImage;
    } else if (imgRef.current && imgRef.current.complete) {
      // Use the already loaded image from imgRef
      console.log('🖼️ Drawing image from imgRef:', {
        imageWidth: imgRef.current.width,
        imageHeight: imgRef.current.height,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight
      });
      
      // Draw image with proper scaling and centering
      ctx.drawImage(imgRef.current, offsetX, offsetY, scaledWidth, scaledHeight);
      
      console.log('✅ Image drawn successfully from imgRef');
    } else if (imageUrl) {
      // Fallback: load image from URL if imgRef is not ready
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('🖼️ Drawing image from URL fallback:', {
          imageWidth: img.width,
          imageHeight: img.height,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height
        });
        
        // Draw image with proper scaling and centering
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        
        console.log('✅ Image drawn successfully from URL');
      };
      img.onerror = (e) => {
        console.error('❌ Failed to load image:', e);
        // Draw a test rectangle to verify canvas is working
        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 100, 100);
      };
      img.src = imageUrl;
    } else {
      // Draw a test rectangle if no image
      ctx.fillStyle = 'blue';
      ctx.fillRect(50, 50, 100, 100);
    }
  }, [imageDimensions, croppedImage, imageUrl]);

  // Draw overlay canvas (strokes, selections, etc.)
  const drawOverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !imageDimensions) return;
    
    const overlayCanvas = overlayCanvasRef.current;
    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;
  
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Enable high-quality rendering for overlay
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  
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
  
  }, [strokes, currentStroke, selectedArea, activeTool, isErasing, brushSize, eraserSize, imageDimensions, isMobile, croppedImage]);

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
      
      setStrokes(prev => [...prev, newStroke]);
      
      // Apply the stroke immediately to the main canvas for visual feedback
      applyStrokeToMainCanvas(newStroke);
      
      // Save to history after updating strokes
      setTimeout(() => saveToHistory(), 0);
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
    
    // Enable high-quality rendering
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    
    tempCtx.drawImage(imgRef.current, 0, 0, width, height);

    // If no strokes, just return the original image with high quality
    if (strokes.length === 0) {
      const croppedImageUrl = tempCanvas.toDataURL('image/png', 1.0); // Maximum quality
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
    
    // Enable high-quality rendering
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
    
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
      
      // Convert points to image coordinates (with dynamic canvas, offsetX and offsetY are 0)
      const imagePoints = stroke.points.map(point => ({
        x: (point.x / scaledWidth) * width,
        y: (point.y / scaledHeight) * height
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

    // Enable high-quality rendering for final output
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';

    const croppedImageUrl = finalCanvas.toDataURL('image/png', 1.0); // Maximum quality
    setCroppedImage(croppedImageUrl);
    onCropComplete(null, userInteracted, croppedImageUrl);
    
    // Clear strokes and selection after applying crop
    setStrokes([]);
    setCurrentStroke([]);
    setSelectedArea([]);
  }, [strokes, imageDimensions, onCropComplete, userInteracted]);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setHistoryIndex(newIndex);
      setStrokes(state.strokes);
      setSelectedArea(state.selectedArea);
    }
  }, [historyIndex, history]);
  
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setHistoryIndex(newIndex);
      setStrokes(state.strokes);
      setSelectedArea(state.selectedArea);
    }
  }, [historyIndex, history]);

  // Clear all strokes
  const handleClear = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
    setSelectedArea([]);
    setUserInteracted(false);
    onCropComplete(null, false);
    setTimeout(() => saveToHistory(), 0);
  }, [onCropComplete, saveToHistory]);

  // Redraw main canvas when cropped image changes
  useEffect(() => {
    drawMainCanvas();
  }, [drawMainCanvas]);

  // Redraw main canvas when image dimensions change
  useEffect(() => {
    if (imageDimensions) {
      drawMainCanvas();
    }
  }, [imageDimensions, drawMainCanvas]);

  // Redraw canvas when switching to Advanced tab
  useEffect(() => {
    if (activeTab === 1 && imageDimensions && canvasRef.current) {
      // Small delay to ensure canvas is ready
      const timer = setTimeout(() => {
        drawMainCanvas();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, imageDimensions, drawMainCanvas]);

  // Initialize canvas when Advanced tab becomes active
  useEffect(() => {
    if (activeTab === 1 && imageUrl) { // Advanced tab is active
      const timer = setTimeout(() => {
        if (canvasRef.current && overlayCanvasRef.current) {
          // Trigger the image loading useEffect
          if (imageUrl) {
            const canvas = canvasRef.current;
            const overlayCanvas = overlayCanvasRef.current;
            const ctx = canvas.getContext('2d');
            const overlayCtx = overlayCanvas.getContext('2d');
            
            if (ctx && overlayCtx) {
              const img = new Image();
              img.src = imageUrl;
              img.onload = () => {
                const container = canvas.parentElement;
                // Use the same canvas sizing logic as ImageCropper
                let canvasWidth, canvasHeight;
                
                if (!container) {
                  canvasWidth = isMobile ? 350 : 800;
                  canvasHeight = isMobile ? 400 : 600;
                  canvas.width = canvasWidth;
                  canvas.height = canvasHeight;
                  overlayCanvas.width = canvasWidth;
                  overlayCanvas.height = canvasHeight;
                } else {
                  // Set canvas to container size with mobile-specific adjustments
                  const maxWidth = container.clientWidth - (isMobile ? 20 : 0);
                  const maxHeight = container.clientHeight - (isMobile ? 20 : 0);
                  const aspectRatio = img.width / img.height;

                  canvasWidth = maxWidth;
                  canvasHeight = maxWidth / aspectRatio;

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
                  overlayCanvas.width = canvasWidth;
                  overlayCanvas.height = canvasHeight;
                }
                
                // Use device pixel ratio for high quality
                const devicePixelRatio = window.devicePixelRatio || 1;
                const scaleFactor = Math.max(devicePixelRatio, 1.5);
                
                // Set canvas internal dimensions (high resolution)
                const internalWidth = canvasWidth * scaleFactor;
                const internalHeight = canvasHeight * scaleFactor;
                
                canvas.width = internalWidth;
                canvas.height = internalHeight;
                overlayCanvas.width = internalWidth;
                overlayCanvas.height = internalHeight;
                
                // Set CSS display size to match image dimensions exactly
                canvas.style.width = `${canvasWidth}px`;
                canvas.style.height = `${canvasHeight}px`;
                overlayCanvas.style.width = `${canvasWidth}px`;
                overlayCanvas.style.height = `${canvasHeight}px`;
                
                // Ensure proper positioning
                canvas.style.position = 'relative';
                overlayCanvas.style.position = 'absolute';
                overlayCanvas.style.top = '0';
                overlayCanvas.style.left = '0';
                overlayCanvas.style.pointerEvents = 'none';

                // Calculate scaled image dimensions to fit canvas (same as ImageCropper)
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const offsetX = (canvas.width - scaledWidth) / 2;
                const offsetY = (canvas.height - scaledHeight) / 2;
                
                // Enable high-quality image rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Set white background to prevent black areas
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                setImageDimensions({
                  width: img.width,
                  height: img.height,
                  scaledWidth,
                  scaledHeight,
                  offsetX,
                  offsetY,
                });

                // Clear overlay
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                
                // Draw the main canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Enable high-quality image rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

                if (onImageLoaded) {
                  onImageLoaded();
                }
              };
            }
          }
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, imageUrl, isMobile, onImageLoaded]);

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
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: isMobile ? '0.9rem' : '1rem',
              minHeight: isMobile ? 40 : 48,
            }
          }}
        >
          <Tab 
            label="Basic" 
            icon={<CropIcon />} 
            iconPosition="start"
            sx={{ 
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: isDarkMode ? '#60a5fa' : '#3b82f6',
              }
            }}
          />
          <Tab 
            label="Advanced" 
            icon={<AutoFixHighIcon />} 
            iconPosition="start"
            sx={{ 
              color: isDarkMode ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: isDarkMode ? '#60a5fa' : '#3b82f6',
              }
            }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 ? (
        // Basic Tab - ImageCropper
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <ImageCropper 
            imageUrl={imageUrl}
            onImageLoaded={onImageLoaded}
            onCropComplete={onCropComplete}
          />
        </Box>
      ) : (
        // Advanced Tab - Current AdvancedImageCropper functionality
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Tool Selection */}
      {!croppedImage && (
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 1, 
            textAlign: 'center',
            backgroundImage: isDarkMode
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            🛠️ Select Tool
          </Typography>
          <Stack 
            direction="row" 
            spacing={0.5} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ gap: 0.5 }}
          >
            <Tooltip title="Pointer Tool - Select areas">
              <IconButton
                onClick={() => setActiveTool('pointer')}
                size="small"
                sx={{
                  backgroundColor: activeTool === 'pointer' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : isDarkMode 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'pointer' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'pointer' 
                    ? 'none'
                    : isDarkMode
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 2,
                  width: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'pointer'
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      : isDarkMode
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.05)',
                    transform: 'translateY(-1px)',
                    boxShadow: activeTool === 'pointer'
                      ? '0 4px 15px rgba(59, 130, 246, 0.3)'
                      : '0 2px 8px rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <MouseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Pencil Tool - Draw crop area">
              <IconButton
                onClick={() => setActiveTool('pencil')}
                size="small"
                sx={{
                  backgroundColor: activeTool === 'pencil' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : isDarkMode 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'pencil' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'pencil' 
                    ? 'none'
                    : isDarkMode
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 2,
                  width: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'pencil'
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      : isDarkMode
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.05)',
                    transform: 'translateY(-1px)',
                    boxShadow: activeTool === 'pencil'
                      ? '0 4px 15px rgba(59, 130, 246, 0.3)'
                      : '0 2px 8px rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <BrushIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Eraser Tool - Remove areas">
              <IconButton
                onClick={() => setActiveTool('eraser')}
                size="small"
                sx={{
                  backgroundColor: activeTool === 'eraser' 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : isDarkMode 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                  color: activeTool === 'eraser' ? 'white' : theme.palette.text.primary,
                  border: activeTool === 'eraser' 
                    ? 'none'
                    : isDarkMode
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 2,
                  width: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    backgroundColor: activeTool === 'eraser'
                      ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                      : isDarkMode
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(239, 68, 68, 0.05)',
                    transform: 'translateY(-1px)',
                    boxShadow: activeTool === 'eraser'
                      ? '0 4px 15px rgba(239, 68, 68, 0.3)'
                      : '0 2px 8px rgba(239, 68, 68, 0.2)',
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {/* Removed Polygon Tool - not needed in advanced mode */}
            
            <Tooltip title="Auto Crop - Coming Soon">
              <span>
                <IconButton
                disabled={true}
                size="small"
                sx={{
                  backgroundColor: isDarkMode 
                    ? 'rgba(148, 163, 184, 0.1)' 
                    : 'rgba(148, 163, 184, 0.05)',
                  color: theme.palette.text.disabled,
                  border: isDarkMode
                    ? '1px solid rgba(148, 163, 184, 0.2)'
                    : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: 2,
                  width: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:disabled': {
                    backgroundColor: isDarkMode 
                      ? 'rgba(148, 163, 184, 0.1)' 
                      : 'rgba(148, 163, 184, 0.05)',
                    color: theme.palette.text.disabled,
                    transform: 'none',
                  }
                }}
              >
                <AutoFixHighIcon fontSize="small" />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                    color: isDarkMode ? '#22c55e' : '#059669',
                    px: 0.4,
                    py: 0.2,
                    borderRadius: 0.8,
                    fontSize: '0.55rem',
                    fontWeight: 600,
                    border: isDarkMode ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  Soon
                </Typography>
              </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      )}

      {/* Tool Options */}
      {!croppedImage && (activeTool === 'pencil' || activeTool === 'eraser') && (
        <Box sx={{ 
          mb: 1, 
          p: 1.5, 
          backgroundColor: isDarkMode 
            ? 'rgba(148, 163, 184, 0.05)' 
            : 'rgba(148, 163, 184, 0.02)', 
          borderRadius: 2,
          border: isDarkMode
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.15)'
        }}>
          <Typography variant="body2" sx={{ 
            mb: 1, 
            fontWeight: 600,
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            color: theme.palette.text.primary
          }}>
            {activeTool === 'pencil' ? '✏️ Pencil Settings' : '🧽 Eraser Settings'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ 
              minWidth: isMobile ? '50px' : '60px',
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              color: theme.palette.text.secondary
            }}>
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
              sx={{ 
                flexGrow: 1,
                '& .MuiSlider-thumb': {
                  width: isMobile ? 16 : 20,
                  height: isMobile ? 16 : 20,
                },
                '& .MuiSlider-track': {
                  height: isMobile ? 3 : 4,
                },
                '& .MuiSlider-rail': {
                  height: isMobile ? 3 : 4,
                }
              }}
            />
          </Box>
        </Box>
      )}

      {/* Removed Polygon Tool Instructions - not needed in advanced mode */}

      {/* Canvas Container */}
      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          width: '100%',
          height: '100%',
          minHeight: isMobile ? '200px' : '250px',
          background: '#000',
          borderRadius: 0,
          overflow: 'hidden',
          boxShadow: isDarkMode
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {imageUrl ? (
          <>
            <canvas
              ref={canvasRef}
              onClick={(e) => {
                // Removed polygon click handler
              }}
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
              onMouseLeave={(e) => {
                // Removed polygon mouse leave handler
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingStart(e);
                } else if (activeTool === 'pointer') {
                  handlePointerStart(e);
                }
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
                
                if (activeTool === 'pencil' || activeTool === 'eraser') {
                  handleDrawingMove(e);
                } else if (activeTool === 'pointer') {
                  handlePointerMove(e);
                }
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                
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
        spacing={isMobile ? 0.8 : 1.5} 
        justifyContent="center"
        flexWrap="wrap"
        sx={{ mt: 1 }}
      >
        <Button
          variant="contained"
          onClick={() => {
            applyStrokesToCrop();
          }}
          disabled={
            strokes.length === 0 || 
            !!croppedImage
          }
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
              background: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.05)',
              color: theme.palette.text.disabled,
              boxShadow: 'none',
              transform: 'none',
            }
          }}
        >
          📐 Crop Floorplan
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<UndoIcon />}
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          sx={{ 
            borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
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
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
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
            borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
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
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
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
          disabled={strokes.length === 0 && selectedArea.length === 0}
          sx={{ 
            borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)',
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
              backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
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
            borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
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
              borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
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
              background: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
              color: isDarkMode ? '#22c55e' : '#059669',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.7rem',
              fontWeight: 600,
              border: isDarkMode ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            Coming Soon
          </Typography>
        </Button>
      </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AdvancedImageCropper;