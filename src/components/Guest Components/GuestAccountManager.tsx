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
  const isLoading = user === undefined; // Use actual loading state from auth context

  useEffect(() => {
    console.log('GuestAccountManager Debug:', {
      isLoading,
      isAuthenticated,
      user: user ? { name: user.name, email: user.email } : null,
      hasGuestAccount: typeof window !== 'undefined' ? sessionStorage.getItem('guest_account_created') : 'N/A',
      bannerDismissed: typeof window !== 'undefined' ? sessionStorage.getItem('guest_banner_dismissed') : 'N/A'
    });

    // Only create guest account if:
    // 1. Not loading (auth initialization is complete)
    // 2. Not authenticated (no user)
    // 3. Running in browser (not SSR)
    // 4. No guest account created yet
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      const hasGuestAccount = sessionStorage.getItem('guest_account_created');
      const bannerDismissed = sessionStorage.getItem('guest_banner_dismissed');
      
      console.log('GuestAccountManager: Checking conditions for guest account creation', {
        hasGuestAccount,
        bannerDismissed,
        shouldCreate: !hasGuestAccount
      });
      
      if (!hasGuestAccount) {
        console.log('GuestAccountManager: Creating guest account...');
        createGuestAccount()
          .then(() => {
            console.log('GuestAccountManager: Guest account created successfully');
            // Mark that we've created a guest account for this session
            sessionStorage.setItem('guest_account_created', 'true');
            // Clear any previously dismissed banner state for new guest account
            sessionStorage.removeItem('guest_banner_dismissed');
          })
          .catch((error) => {
            console.error('Failed to create guest account:', error);
            // Don't retry on failure to avoid infinite loops
          });
      }
    }
  }, [isLoading, isAuthenticated]); // Remove createGuestAccount and user from dependencies

  // Don't render anything while loading to prevent flash
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
