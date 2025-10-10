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
  Mail,
  ExternalLink,
  Heart,
  Sparkles,
  Zap
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
  const [activeTab, setActiveTab] = useState<'share' | 'preview'>('share');
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
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Content</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Spread the word about this amazing content</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'share'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Options
            </div>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Preview
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'share' ? (
            <div className="space-y-6">
              {/* Web Share API */}
              <div className="text-center">
                <button
                  onClick={handleWebShare}
                  disabled={isSharing}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSharing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                    <span>{isSharing ? 'Sharing...' : 'Share with Native Apps'}</span>
                  </div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Opens your device's share menu
                </p>
              </div>

              {/* Social Media Platforms */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Share to Social Media
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => handleSocialShare(platform.id)}
                        className={`${platform.color} text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5" />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Copy URL */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Copy Link
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Content Preview */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                {description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{shareUrl}</span>
                </div>
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Share Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Share2 className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Shares</div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Share this content to help others discover amazing Vastu insights
          </p>
        </div>
      </div>
    </div>
  );
}
