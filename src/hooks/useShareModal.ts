'use client';

import { useState, useCallback } from 'react';

interface ShareModalData {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  hashtags?: string[];
}

export function useShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareModalData>({
    title: '',
    description: '',
    url: '',
    image: '',
    hashtags: [],
  });

  const openShareModal = useCallback((data: ShareModalData) => {
    setShareData(data);
    setIsOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setIsOpen(false);
    // Reset data after a short delay to allow for smooth closing animation
    setTimeout(() => {
      setShareData({
        title: '',
        description: '',
        url: '',
        image: '',
        hashtags: [],
      });
    }, 300);
  }, []);

  return {
    isOpen,
    shareData,
    openShareModal,
    closeShareModal,
  };
}
