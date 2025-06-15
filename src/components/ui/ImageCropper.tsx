// src/components/ui/ImageCropper.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Box, Typography } from '@mui/material';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImage: any, userInteracted: boolean) => void;
  onImageLoaded?: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onImageLoaded }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [userInteractedWithCrop, setUserInteractedWithCrop] = useState(false);
  const cropperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageUrl) {
      setImageSrc(imageUrl);
      setCrop(undefined);
      setCompletedCrop(undefined);
      setUserInteractedWithCrop(false);
    }
  }, [imageUrl]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('ImageCropper: Image loaded', e.currentTarget.src);
    if (imgRef.current) {
      console.log('ImageCropper: Image element dimensions', imgRef.current.offsetWidth, imgRef.current.offsetHeight);
    }
    if (onImageLoaded) {
      onImageLoaded();
    }
  }, [onImageLoaded]);

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Cropper Container */}
      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          background: '#000',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {imageSrc && (
          <ReactCrop
            key={imageUrl}
            crop={crop}
            onChange={(c) => {
              setCrop(c);
              if (c.width > 0 && c.height > 0) {
                setUserInteractedWithCrop(true);
              }
            }}
            onComplete={(c) => {
              setCompletedCrop(c);
              if (cropperRef.current) {
                console.log('ImageCropper: ReactCrop container dimensions', cropperRef.current.offsetWidth, cropperRef.current.offsetHeight);
              }
              if (userInteractedWithCrop && c.width > 50 && c.height > 50) {
                console.log('ImageCropper: Completed crop dimensions', c.width, c.height);
                onCropComplete(c, true);
              } else if (!userInteractedWithCrop) {
                onCropComplete(null, false);
              }
            }}
            aspect={undefined}
            style={{
              width: '100%',
              height: '100%',
              border: '2px solid blue',
            }}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              onLoad={onImageLoad}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#000',
                border: '2px solid red',
              }}
            />
          </ReactCrop>
        )}
        {!imageSrc && (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            No image to crop. Please upload one.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageCropper;