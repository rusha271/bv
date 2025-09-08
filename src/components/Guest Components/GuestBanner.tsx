'use client';

import React, { useState } from 'react';
import { useAuthUser, useAuthGuest } from '@/contexts/AuthContext';
// import GuestUpgradeModal from './GuestUpgradeModal';
import LogSigComponent from '../Auth/LogSig';
import { useRouter } from 'next/navigation';

export default function GuestBanner() {
  const isGuest = useAuthGuest();
  const user = useAuthUser();
  const [showBanner, setShowBanner] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug logging
  React.useEffect(() => {
    console.log('GuestBanner Debug:', {
      isGuest,
      user: user ? { name: user.name, email: user.email, role: user.role } : null,
      showBanner,
      bannerDismissed: typeof window !== 'undefined' ? sessionStorage.getItem('guest_banner_dismissed') : 'N/A',
      guestAccountCreated: typeof window !== 'undefined' ? sessionStorage.getItem('guest_account_created') : 'N/A',
      debugMode: typeof window !== 'undefined' ? window.location.search.includes('debug=banner') : false,
      willShow: isGuest && showBanner
    });
  }, [isGuest, user, showBanner]);

  // Check if banner was dismissed
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const bannerDismissed = sessionStorage.getItem('guest_banner_dismissed');
      console.log('Banner dismissed check:', bannerDismissed);
      
      // If banner was dismissed but we have a new guest account, reset the banner
      if (bannerDismissed === 'true' && isGuest) {
        const guestAccountCreated = sessionStorage.getItem('guest_account_created');
        if (guestAccountCreated === 'true') {
          console.log('Resetting banner for new guest account');
          sessionStorage.removeItem('guest_banner_dismissed');
          setShowBanner(true);
        } else {
          setShowBanner(false);
        }
      } else if (bannerDismissed === 'true') {
        setShowBanner(false);
      }
    }
  }, [isGuest]);

  // Listen for custom event to open upgrade modal
  React.useEffect(() => {
    const handleOpenUpgrade = () => {
      setShowUpgradeModal(true);
    };

    window.addEventListener('openGuestUpgrade', handleOpenUpgrade);
    return () => {
      window.removeEventListener('openGuestUpgrade', handleOpenUpgrade);
    };
  }, []);

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  // Temporary debug mode - force banner to show for testing
  const debugMode = typeof window !== 'undefined' && window.location.search.includes('debug=banner');
  
  // Debug: Add manual guest account creation button
  const handleCreateGuestAccount = async () => {
    try {
      console.log('Manually creating guest account...');
      // Trigger guest account creation via custom event
      window.dispatchEvent(new CustomEvent('createGuestAccount'));
    } catch (error) {
      console.error('Failed to create guest account manually:', error);
    }
  };

  // Debug: Reset banner state
  const handleResetBanner = () => {
    console.log('Resetting banner state...');
    sessionStorage.removeItem('guest_banner_dismissed');
    setShowBanner(true);
  };
  
  // Don't show banner if user is not a guest or banner is dismissed (unless in debug mode)
  if ((!isGuest || !showBanner) && !debugMode) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 shadow-lg"
      style={{zIndex:12,position:'fixed',bottom:0,left:0,right:0}}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">
                Welcome, {user?.name || 'Guest'}! You're using a temporary guest account.
              </p>
              <p className="text-xs opacity-90">
                Upgrade to save your progress and access all features.
              </p>
              {debugMode && (
                <div className="text-xs opacity-75 mt-1">
                  <p>DEBUG: isGuest={isGuest ? 'true' : 'false'}, showBanner={showBanner ? 'true' : 'false'}</p>
                  <button
                    onClick={handleResetBanner}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mt-1"
                  >
                    Reset Banner
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-blue-600 px-3 py-1 rounded-lg shadow hover:bg-gray-50 transition"
            >
              Upgrade Now
            </button>

            <button
              onClick={() => {
                sessionStorage.setItem('guest_banner_dismissed', 'true');
                setShowBanner(false);
              }}
              className="text-white opacity-75 hover:opacity-100 transition-opacity"
              aria-label="Close banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showUpgradeModal && (
        <LogSigComponent open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      )}
    </>
  );
}
