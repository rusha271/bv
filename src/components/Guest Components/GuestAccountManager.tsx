'use client';

import { useEffect } from 'react';
import { useAuthUser, useAuthActions } from '@/contexts/AuthContext';

interface GuestAccountManagerProps {
  children: React.ReactNode;
}

export default function GuestAccountManager({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();
  const { createGuestAccount } = useAuthActions();
  
  // Check if user is authenticated
  const isAuthenticated = !!user;
  const isLoading = false; // We don't need loading state for this component

  useEffect(() => {
    // Only create guest account if:
    // 1. Not loading (auth initialization is complete)
    // 2. Not authenticated (no user)
    // 3. Running in browser (not SSR)
    // 4. Banner not dismissed (user hasn't chosen to skip guest account)
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      const hasGuestAccount = sessionStorage.getItem('guest_account_created');
      const bannerDismissed = sessionStorage.getItem('guest_banner_dismissed');
      
      if (!hasGuestAccount && !bannerDismissed) {
        createGuestAccount()
          .then(() => {
            // Mark that we've created a guest account for this session
            sessionStorage.setItem('guest_account_created', 'true');
          })
          .catch((error) => {
            console.error('Failed to create guest account:', error);
            // Don't retry on failure to avoid infinite loops
          });
      }
    }
  }, [isLoading, isAuthenticated, createGuestAccount]);

  // Don't render anything while loading to prevent flash
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
