import { useAuth } from '@/contexts/AuthContext';
import { useState, useCallback } from 'react';

export function useGuestAccount() {
  const { isGuest, user, createGuestAccount, upgradeGuestAccount } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const upgradeAccount = useCallback(async (
    name: string,
    email: string,
    password: string,
    rememberMe = false
  ) => {
    if (!isGuest) {
      throw new Error('Only guest accounts can be upgraded');
    }

    setIsUpgrading(true);
    try {
      await upgradeGuestAccount(name, email, password, rememberMe);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  }, [isGuest, upgradeGuestAccount]);

  const createGuest = useCallback(async () => {
    try {
      await createGuestAccount();
      return true;
    } catch (error) {
      throw error;
    }
  }, [createGuestAccount]);

  const clearGuestSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('guest_account_created');
      sessionStorage.removeItem('guest_banner_dismissed');
    }
  }, []);

  const dismissGuestBanner = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('guest_banner_dismissed', 'true');
    }
  }, []);

  return {
    isGuest,
    user,
    isUpgrading,
    upgradeAccount,
    createGuest,
    clearGuestSession,
    dismissGuestBanner,
  };
}

export default useGuestAccount;
