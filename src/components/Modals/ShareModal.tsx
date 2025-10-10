'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Send, 
  Mail
} from 'lucide-react';
import { 
  shareContent, 
  shareToSocial, 
  generatePageShareData, 
  getShareUrl,
  showShareToast,
  ShareData,
  SocialShareData 
} from '@/utils/shareUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  hashtags?: string[];
}

const socialPlatforms = [
  {
    id: 'facebook' as const,
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-blue-600',
  },
  {
    id: 'twitter' as const,
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-sky-500 hover:bg-sky-600',
    textColor: 'text-sky-500',
  },
  {
    id: 'linkedin' as const,
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700 hover:bg-blue-800',
    textColor: 'text-blue-700',
  },
  {
    id: 'whatsapp' as const,
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-600 hover:bg-green-700',
    textColor: 'text-green-600',
  },
  {
    id: 'telegram' as const,
    name: 'Telegram',
    icon: Send,
    color: 'bg-blue-500 hover:bg-blue-600',
    textColor: 'text-blue-500',
  },
  {
    id: 'email' as const,
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-600 hover:bg-gray-700',
    textColor: 'text-gray-600',
  },
];

export default function ShareModal({
  isOpen,
  onClose,
  title,
  description,
  url = '',
  image,
  hashtags = [],
}: ShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share'>('share');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fullUrl = getShareUrl(url);
      setShareUrl(fullUrl);
    }
  }, [isOpen, url]);

  const handleWebShare = async () => {
    setIsSharing(true);
    try {
      const shareData = generatePageShareData(title, description, url);
      const result = await shareContent(shareData);
      
      if (result.success) {
        showShareToast(result.message, 'success');
        onClose();
      } else {
        showShareToast(result.message, 'error');
      }
    } catch (error) {
      showShareToast('Failed to share content. Please try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialShare = async (platform: typeof socialPlatforms[0]['id']) => {
    try {
      const socialData: SocialShareData = {
        platform,
        url,
        title,
        description,
        image,
        hashtags,
      };
      
      const result = await shareToSocial(socialData);
      
      if (result.success) {
        showShareToast(result.message, 'success');
        onClose();
      } else {
        showShareToast(result.message, 'error');
      }
    } catch (error) {
      showShareToast('Failed to share content. Please try again.', 'error');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showShareToast('URL copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showShareToast('Failed to copy URL. Please try again.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full mx-2 max-h-[85vh] overflow-hidden sm:max-w-md sm:mx-4 sm:max-h-[90vh]">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-200 dark:border-gray-700 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors sm:top-4 sm:right-4"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:p-2">
              <Share2 className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">Share Content</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Spread the word about this amazing content</p>
            </div>
          </div>
        </div>


        {/* Content */}
        <div className="p-4 max-h-80 overflow-y-auto sm:p-6 sm:max-h-96">
          <div className="space-y-4 sm:space-y-6">
              {/* Web Share API */}
              <div className="text-center">
                <button
                  onClick={handleWebShare}
                  disabled={isSharing}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl sm:py-3 sm:px-6 sm:rounded-xl"
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {isSharing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin sm:w-5 sm:h-5" />
                    ) : (
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span className="text-sm sm:text-base">{isSharing ? 'Sharing...' : 'Share with Native Apps'}</span>
                  </div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
                  Opens your device's share menu
                </p>
              </div>

              {/* Social Media Platforms */}
              <div>
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 sm:text-sm sm:mb-3">
                  Share to Social Media
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {socialPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => handleSocialShare(platform.id)}
                        className={`${platform.color} text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg sm:p-3`}
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs font-medium sm:text-sm">{platform.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Copy URL */}
              <div>
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 sm:text-sm sm:mb-3">
                  Copy Link
                </h3>
                <div className="flex gap-1 sm:gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 sm:px-3 sm:py-2 sm:rounded-lg sm:text-sm"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className={`px-3 py-1.5 rounded-md transition-all duration-300 sm:px-4 sm:py-2 sm:rounded-lg ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 sm:p-4">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Share this content to help others discover amazing Vastu insights
          </p>
        </div>
      </div>
    </div>
  );
}
