'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Box, CircularProgress } from '@mui/material';
import { getImageUrl, createImageFallbackChain } from '@/utils/imageUtils';

interface RobustImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const RobustImage: React.FC<RobustImageProps> = ({
  src,
  alt,
  width,
  height,
  fallbackSrc = '/images/bv.png',
  style,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    console.warn(`Image failed to load: ${imageSrc}`);
    
    const fallbackChain = createImageFallbackChain(imageSrc, fallbackSrc);
    const currentIndex = fallbackChain.indexOf(imageSrc);
    
    if (currentIndex < fallbackChain.length - 1) {
      // Try next image in fallback chain
      const nextImage = fallbackChain[currentIndex + 1];
      console.log(`Falling back to: ${nextImage}`);
      setImageSrc(nextImage);
      setRetryCount(0);
    } else if (retryCount < maxRetries) {
      // Retry with the same URL
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        setImageSrc(prev => prev); // Force re-render
      }, 1000 * retryCount); // Exponential backoff
    } else {
      // All options exhausted
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }
  }, [imageSrc, fallbackSrc, retryCount, onError]);

  // Reset state when src changes
  React.useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const finalSrc = getImageUrl(imageSrc);

  if (hasError) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: 1,
          ...style,
        }}
        className={className}
      >
        <Box
          sx={{
            width: width * 0.6,
            height: height * 0.6,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          No Image
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        ...style,
      }}
      className={className}
    >
      {isLoading && (
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <CircularProgress size={Math.min(width, height) * 0.3} />
        </Box>
      )}
      
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...style,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
};

export default RobustImage;
