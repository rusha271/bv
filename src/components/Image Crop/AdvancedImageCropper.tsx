'use client';

import React from 'react';
import { Box } from '@mui/material';
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

const AdvancedImageCropper: React.FC<AdvancedImageCropperProps> = ({ 
  imageUrl, 
  onImageLoaded, 
  onCropComplete 
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ImageCropper 
        imageUrl={imageUrl}
        onImageLoaded={onImageLoaded}
        onCropComplete={onCropComplete}
      />
    </Box>
  );
};

export default AdvancedImageCropper;