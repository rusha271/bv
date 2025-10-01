'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthUser, useAuthLoading, useAuthActions } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import PageLoader from './PageLoader';

interface SmartPageLoaderProps {
  // Optional: Allow manual override
  forceShow?: boolean;
  forceHide?: boolean;
}

const SmartPageLoader: React.FC<SmartPageLoaderProps> = ({ 
  forceShow = false, 
  forceHide = false 
}) => {
  const pathname = usePathname();
  const authLoading = useAuthLoading();
  const { isLoading: contextLoading, setLoading } = useLoading();
  const user = useAuthUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [recentlyAuthenticated, setRecentlyAuthenticated] = useState(false);
  const [recentlyLoggedOut, setRecentlyLoggedOut] = useState(false);
  const [manualControl, setManualControl] = useState<{ show: boolean; hide: boolean }>({ show: false, hide: false });

  // Listen for login/signup modal state changes - optimized with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleModalStateChange = (event: Event) => {
      // Clear previous timeout to debounce rapid events
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const customEvent = event as CustomEvent;
        const { type, isOpen } = customEvent.detail;
        if (type === 'login') {
          setIsLoginModalOpen(isOpen);
        } else if (type === 'signup') {
          setIsSignupModalOpen(isOpen);
        }
      }, 16); // ~60fps debouncing
    };

    // Listen for custom events from LogSig component
    window.addEventListener('loginModalStateChange', handleModalStateChange, { passive: true });
    window.addEventListener('signupModalStateChange', handleModalStateChange, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('loginModalStateChange', handleModalStateChange);
      window.removeEventListener('signupModalStateChange', handleModalStateChange);
    };
  }, []);

  // Listen for authentication success events - optimized with requestAnimationFrame
  useEffect(() => {
    let authSuccessTimer: NodeJS.Timeout;
    let authLogoutTimer: NodeJS.Timeout;
    
    const handleAuthSuccess = (event: Event) => {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => {
        setRecentlyAuthenticated(true);
        setRecentlyLoggedOut(false);
        
        // Reset the flag after a short delay
        authSuccessTimer = setTimeout(() => {
          setRecentlyAuthenticated(false);
        }, 1000);
      });
    };

    const handleAuthLogout = (event: Event) => {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => {
        setRecentlyLoggedOut(true);
        setRecentlyAuthenticated(false);
        
        // Reset the flag after a short delay
        authLogoutTimer = setTimeout(() => {
          setRecentlyLoggedOut(false);
        }, 1000);
      });
    };

    window.addEventListener('authSuccess', handleAuthSuccess, { passive: true });
    window.addEventListener('authLogout', handleAuthLogout, { passive: true });

    return () => {
      clearTimeout(authSuccessTimer);
      clearTimeout(authLogoutTimer);
      window.removeEventListener('authSuccess', handleAuthSuccess);
      window.removeEventListener('authLogout', handleAuthLogout);
    };
  }, []);

  // Listen for manual loader control - optimized with requestAnimationFrame
  useEffect(() => {
    const handleManualControl = (event: Event) => {
      // Use requestAnimationFrame to batch DOM updates and prevent forced reflow
      requestAnimationFrame(() => {
        const customEvent = event as CustomEvent;
        const { action } = customEvent.detail;
        
        if (action === 'show') {
          setManualControl({ show: true, hide: false });
        } else if (action === 'hide') {
          setManualControl({ show: false, hide: true });
        }
      });
    };

    window.addEventListener('manualLoaderControl', handleManualControl, { passive: true });

    return () => {
      window.removeEventListener('manualLoaderControl', handleManualControl);
    };
  }, []);

  // Determine if loader should be shown
// Determine if loader should be shown
const shouldShowLoader = React.useMemo(() => {
    // Manual hide takes precedence
    if (manualControl.hide || forceHide) {
      // console.log('Loader hidden due to manualControl.hide or forceHide');
      return false;
    }
    
    // Manual show takes precedence over other conditions
    if (manualControl.show || forceShow) {
      //  console.log('Loader shown due to manualControl.show or forceShow');
      return true;
    }
    
    // Don't show loader on login, signup, or logout pages
    const excludedPaths = ['/login', '/signup', '/logout'];
    if (excludedPaths.includes(pathname)) {
      // console.log(`Loader hidden: Current pathname (${pathname}) is in excluded paths`);
      return false;
    }
    
    // Don't show loader if login/signup modal is open
    if (isLoginModalOpen || isSignupModalOpen) {
      // console.log('Loader hidden: Login or signup modal is open');
      return false;
    }
    
    // Don't show loader if user just authenticated or logged out
    if (recentlyAuthenticated || recentlyLoggedOut) {
      // console.log('Loader hidden: Recently authenticated or logged out');
      return false;
    }
    
    // Show loader if auth is loading (initial load)
    if (authLoading) {
      // console.log('Loader shown: Auth is loading');
      return true;
    }
    
    // Show loader if context loading is active
    if (contextLoading) {
      // console.log('Loader shown: Context loading is active');
      return true;
    }
    
    // Hide loader by default once initial checks are complete
    // console.log(`Loader hidden: Default case for pathname ${pathname}`);
    return false;
  }, [
    manualControl,
    forceShow,
    forceHide,
    pathname,
    isLoginModalOpen,
    isSignupModalOpen,
    recentlyAuthenticated,
    recentlyLoggedOut,
    authLoading,
    contextLoading
  ]);
  
  // Auto-hide loader after initial auth check
  useEffect(() => {
    if (!authLoading && !contextLoading && user !== undefined) {
      // console.log('Auto-hiding loader: Auth and context loading complete, user state resolved');
      setLoading(false); // Ensure loading state is set to false in LoadingContext
    }
  }, [authLoading, contextLoading, user, setLoading]);

  return <PageLoader loading={shouldShowLoader} />;
};

export default SmartPageLoader;
