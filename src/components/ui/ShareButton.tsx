'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, Heart, Sparkles, Zap } from 'lucide-react';
import { shareContent, generatePageShareData, ShareData, showShareToast } from '@/utils/shareUtils';
import ShareModal from '@/components/Modals/ShareModal';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'text' | 'floating' | 'gradient';
  children?: React.ReactNode;
  showAnimation?: boolean;
  showParticles?: boolean;
  useModal?: boolean;
  image?: string;
  hashtags?: string[];
}

export default function ShareButton({
  title,
  description,
  url = '',
  className = '',
  size = 'md',
  variant = 'icon',
  children,
  showAnimation = true,
  showParticles = false,
  useModal = false,
  image,
  hashtags = [],
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Generate particles for animation
  const generateParticles = () => {
    if (!showParticles || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      delay: i * 50,
    }));
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => setParticles([]), 1000);
  };

  const handleShare = async () => {
    if (useModal) {
      setShowModal(true);
      return;
    }

    setIsSharing(true);
    
    if (showParticles) {
      generateParticles();
    }
    
    try {
      const shareData = generatePageShareData(title, description, url);
      const result = await shareContent(shareData);
      
      if (result.success) {
        if (result.method === 'clipboard') {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        
        // Show success toast
        showShareToast(result.message, 'success');
      } else {
        // Show error toast
        showShareToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showShareToast('Failed to share content. Please try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-2 text-sm';
      case 'lg':
        return 'p-4 text-lg';
      default:
        return 'p-3 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'relative overflow-hidden transition-all duration-300 ease-out';
    
    switch (variant) {
      case 'floating':
        return `${baseClasses} bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 border border-gray-200 dark:border-gray-700`;
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105`;
      case 'button':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg`;
      case 'text':
        return `${baseClasses} text-blue-600 hover:text-blue-700 underline flex items-center gap-1 hover:scale-105`;
      default:
        return `${baseClasses} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hover:scale-105 shadow-sm hover:shadow-md`;
    }
  };

  const renderIcon = () => {
    if (copied) {
      return (
        <div className="relative">
          <Check className="w-4 h-4 text-green-600 animate-bounce" />
          {showAnimation && (
            <div className="absolute inset-0 w-4 h-4 border-2 border-green-400 rounded-full animate-ping opacity-75" />
          )}
        </div>
      );
    }
    if (isSharing) {
      return (
        <div className="relative">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          {showAnimation && (
            <div className="absolute inset-0 w-4 h-4 border-2 border-blue-400 rounded-full animate-pulse" />
          )}
        </div>
      );
    }
    return (
      <div className="relative">
        <Share2 className={`w-4 h-4 transition-transform duration-200 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
        {showAnimation && isHovered && (
          <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-yellow-400 animate-pulse" />
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (children) {
      return children;
    }
    
    if (variant === 'text') {
      return (
        <>
          {renderIcon()}
          <span className="transition-all duration-200">{copied ? 'Copied!' : 'Share'}</span>
        </>
      );
    }
    
    if (variant === 'button' || variant === 'floating' || variant === 'gradient') {
      return (
        <>
          {renderIcon()}
          <span className="transition-all duration-200 font-medium">{copied ? 'Copied!' : 'Share'}</span>
        </>
      );
    }
    
    return renderIcon();
  };

  // Render particles
  const renderParticles = () => {
    if (!showParticles || particles.length === 0) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"
            style={{
              left: particle.x,
              top: particle.y,
              animationDelay: `${particle.delay}ms`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleShare}
        disabled={isSharing}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${className}
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          group
        `}
        title={copied ? 'URL copied to clipboard!' : 'Share this page'}
        aria-label={copied ? 'URL copied to clipboard!' : 'Share this page'}
      >
        {renderContent()}
        
        {/* Animated background for gradient variant */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        )}
        
        {/* Ripple effect */}
        {showAnimation && (
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150" />
          </div>
        )}
      </button>
      
      {renderParticles()}
      
      {/* Share Modal */}
      {useModal && (
        <ShareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={title}
          description={description}
          url={url}
          image={image}
          hashtags={hashtags}
        />
      )}
    </>
  );
}

// Convenience components for specific use cases
export function BlogShareButton({ 
  title, 
  description, 
  postId, 
  variant = 'gradient',
  showParticles = true,
  useModal = true,
  hashtags = ['Vastu', 'FengShui', 'HomeDesign'],
  ...props 
}: Omit<ShareButtonProps, 'url'> & { postId: string }) {
  return (
    <ShareButton
      title={title}
      description={description}
      url={`/blog/${postId}`}
      variant={variant}
      showParticles={showParticles}
      useModal={useModal}
      hashtags={hashtags}
      {...props}
    />
  );
}

export function VideoShareButton({ 
  title, 
  description, 
  videoId, 
  variant = 'floating',
  showAnimation = true,
  useModal = true,
  hashtags = ['Vastu', 'Video', 'Tutorial'],
  ...props 
}: Omit<ShareButtonProps, 'url'> & { videoId: string }) {
  return (
    <ShareButton
      title={title}
      description={description}
      url={`/video/${videoId}`}
      variant={variant}
      showAnimation={showAnimation}
      useModal={useModal}
      hashtags={hashtags}
      {...props}
    />
  );
}

// New modern share button variants
export function FloatingShareButton(props: ShareButtonProps) {
  return <ShareButton {...props} variant="floating" showAnimation={true} useModal={true} />;
}

export function GradientShareButton(props: ShareButtonProps) {
  return <ShareButton {...props} variant="gradient" showParticles={true} useModal={true} />;
}

// Modal-only share button
export function ModalShareButton(props: ShareButtonProps) {
  return <ShareButton {...props} useModal={true} variant="button" />;
}
