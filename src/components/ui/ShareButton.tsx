'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { shareContent, generatePageShareData, ShareData } from '@/utils/shareUtils';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'text';
  children?: React.ReactNode;
}

export default function ShareButton({
  title,
  description,
  url = '',
  className = '',
  size = 'md',
  variant = 'icon',
  children,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const shareData = generatePageShareData(title, description, url);
      const wasShared = await shareContent(shareData);
      
      if (!wasShared) {
        // URL was copied to clipboard
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5 text-sm';
      case 'lg':
        return 'p-3 text-lg';
      default:
        return 'p-2 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors';
      case 'text':
        return 'text-blue-600 hover:text-blue-700 underline flex items-center gap-1 transition-colors';
      default:
        return 'hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors';
    }
  };

  const renderIcon = () => {
    if (copied) {
      return <Check className="w-4 h-4 text-green-600" />;
    }
    if (isSharing) {
      return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
    }
    return <Share2 className="w-4 h-4" />;
  };

  const renderContent = () => {
    if (children) {
      return children;
    }
    
    if (variant === 'text') {
      return (
        <>
          {renderIcon()}
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </>
      );
    }
    
    if (variant === 'button') {
      return (
        <>
          {renderIcon()}
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </>
      );
    }
    
    return renderIcon();
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${className}
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      title={copied ? 'URL copied to clipboard!' : 'Share this page'}
    >
      {renderContent()}
    </button>
  );
}

// Convenience components for specific use cases
export function BlogShareButton({ 
  title, 
  description, 
  postId, 
  ...props 
}: Omit<ShareButtonProps, 'url'> & { postId: string }) {
  return (
    <ShareButton
      title={title}
      description={description}
      url={`/blog/${postId}`}
      {...props}
    />
  );
}

export function VideoShareButton({ 
  title, 
  description, 
  videoId, 
  ...props 
}: Omit<ShareButtonProps, 'url'> & { videoId: string }) {
  return (
    <ShareButton
      title={title}
      description={description}
      url={`/video/${videoId}`}
      {...props}
    />
  );
}
