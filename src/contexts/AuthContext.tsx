'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { apiService, User, AuthResponse } from '@/utils/apiService';

// Simple JWT decode function (base64 decode)
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Types
interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<void>;
  createGuestAccount: () => Promise<void>;
  upgradeGuestAccount: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REMEMBER_ME_KEY = 'remember_me';

// Helper functions
const getStorage = (rememberMe?: boolean) => {
  if (typeof window === 'undefined') return localStorage;
  return rememberMe ? localStorage : sessionStorage;
};

const getStoredTokens = () => {
  if (typeof window === 'undefined') return null;
  
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  const storage = getStorage(rememberMe);
  
  const accessToken = storage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = storage.getItem(REFRESH_TOKEN_KEY);
  
  return accessToken && refreshToken ? { access_token: accessToken, refresh_token: refreshToken } : null;
};

const storeTokens = (tokens: AuthTokens, rememberMe: boolean) => {
  if (typeof window === 'undefined') return;
  
  const storage = getStorage(rememberMe);
  storage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  storage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
};

const clearStoredTokens = () => {
  if (typeof window === 'undefined') return;
  
  // Clear from both storages to be safe
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

const getTokenExpiryTime = (token: string): number | null => {
  try {
    const decoded = decodeJWT(token);
    return decoded?.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
};

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  
  // Use ref to track current user state without causing re-renders
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens) throw new Error('No refresh token available');

      const response = await apiService.auth.refresh();
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      
      // Convert AuthResponse to AuthTokens format
      const authTokens: AuthTokens = {
        access_token: response.access_token,
        refresh_token: tokens.refresh_token // Keep the existing refresh token
      };
      
      storeTokens(authTokens, rememberMe);
      
      // Set up refresh timer for new token
      const expiryTime = getTokenExpiryTime(response.access_token);
      if (expiryTime) {
        const refreshTime = expiryTime - (5 * 60 * 1000);
        const now = Date.now();
        
        if (refreshTime > now) {
          const timeout = setTimeout(() => {
            refreshToken();
          }, refreshTime - now);
          setRefreshTimer(timeout);
        }
      }
      
      // Update user if needed - use ref to avoid dependency issues
      if (!userRef.current) {
        const currentUser = await apiService.auth.me();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearStoredTokens();
      setUser(null);
      throw error;
    }
  }, []); // Remove user dependency

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens) {
        setIsLoading(false);
        return;
      }

      // Check if access token is expired
      if (isTokenExpired(tokens.access_token)) {
        // Try to refresh token
        try {
          await refreshToken();
        } catch {
          // If refresh fails, clear tokens and return
          clearStoredTokens();
          setIsLoading(false);
          return;
        }
      } else {
        // Set up refresh timer for existing token
        const expiryTime = getTokenExpiryTime(tokens.access_token);
        if (expiryTime) {
          const refreshTime = expiryTime - (5 * 60 * 1000);
          const now = Date.now();
          
          if (refreshTime > now) {
            const timeout = setTimeout(() => {
              refreshToken();
            }, refreshTime - now);
            setRefreshTimer(timeout);
          }
        }
        
        // Get current user and check if guest
        try {
          const currentUser = await apiService.auth.me();
          setUser(currentUser);
          
          // Check if current user is a guest
          try {
            const guestCheck = await apiService.auth.isGuest();
            setIsGuest(guestCheck.is_guest);
          } catch (error) {
            console.error('Failed to check guest status:', error);
            // Default to false if check fails
            setIsGuest(false);
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
          // Don't clear tokens here, let the user try to refresh
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearStoredTokens();
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  // Login function
  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.login({ email, password });
      
      // Convert AuthResponse to AuthTokens format
      const authTokens: AuthTokens = {
        access_token: response.access_token,
        refresh_token: response.access_token // Use access token as refresh token for now
      };
      
      storeTokens(authTokens, rememberMe);
      
      // Set up refresh timer for new token
      const expiryTime = getTokenExpiryTime(response.access_token);
      if (expiryTime) {
        const refreshTime = expiryTime - (5 * 60 * 1000);
        const now = Date.now();
        
        if (refreshTime > now) {
          const timeout = setTimeout(() => {
            refreshToken();
          }, refreshTime - now);
          setRefreshTimer(timeout);
        }
      }
      
      // Convert response.user to User type by adding missing fields
      const userData: User = {
        ...response.user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(userData);
      setIsGuest(false);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  // Register function
  const register = useCallback(async (name: string, email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.register({ name, email, password });
      
      // Convert AuthResponse to AuthTokens format
      const authTokens: AuthTokens = {
        access_token: response.access_token,
        refresh_token: response.access_token // Use access token as refresh token for now
      };
      
      storeTokens(authTokens, rememberMe);
      
      // Set up refresh timer for new token
      const expiryTime = getTokenExpiryTime(response.access_token);
      if (expiryTime) {
        const refreshTime = expiryTime - (5 * 60 * 1000);
        const now = Date.now();
        
        if (refreshTime > now) {
          const timeout = setTimeout(() => {
            refreshToken();
          }, refreshTime - now);
          setRefreshTimer(timeout);
        }
      }
      
      // Convert response.user to User type by adding missing fields
      const userData: User = {
        ...response.user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(userData);
      setIsGuest(false);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API if user is authenticated
      if (userRef.current) {
        await apiService.auth.logout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      clearStoredTokens();
      setUser(null);
      setIsGuest(false);
      
      // Clear refresh timer
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
    }
  }, [refreshTimer]);

  // Create guest account function
  const createGuestAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.createGuest();
      
      // Convert AuthResponse to AuthTokens format
      const authTokens: AuthTokens = {
        access_token: response.access_token,
        refresh_token: response.access_token // Use access token as refresh token for now
      };
      
      storeTokens(authTokens, false); // Guest accounts use session storage
      
      // Set up refresh timer for new token
      const expiryTime = getTokenExpiryTime(response.access_token);
      if (expiryTime) {
        const refreshTime = expiryTime - (5 * 60 * 1000);
        const now = Date.now();
        
        if (refreshTime > now) {
          const timeout = setTimeout(() => {
            refreshToken();
          }, refreshTime - now);
          setRefreshTimer(timeout);
        }
      }
      
      // Convert response.user to User type by adding missing fields
      const userData: User = {
        ...response.user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(userData);
      setIsGuest(true);
    } catch (error) {
      console.error('Guest account creation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  // Upgrade guest account function
  const upgradeGuestAccount = useCallback(async (name: string, email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.upgradeGuest({ name, email, password });
      
      // Convert AuthResponse to AuthTokens format
      const authTokens: AuthTokens = {
        access_token: response.access_token,
        refresh_token: response.access_token // Use access token as refresh token for now
      };
      
      storeTokens(authTokens, rememberMe);
      
      // Set up refresh timer for new token
      const expiryTime = getTokenExpiryTime(response.access_token);
      if (expiryTime) {
        const refreshTime = expiryTime - (5 * 60 * 1000);
        const now = Date.now();
        
        if (refreshTime > now) {
          const timeout = setTimeout(() => {
            refreshToken();
          }, refreshTime - now);
          setRefreshTimer(timeout);
        }
      }
      
      // Convert response.user to User type by adding missing fields
      const userData: User = {
        ...response.user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(userData);
      setIsGuest(false);
    } catch (error) {
      console.error('Guest account upgrade failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  // Update user function
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  // Handle storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY || e.key === REFRESH_TOKEN_KEY) {
        // Token changed in another tab, reinitialize auth
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeAuth]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [refreshTimer]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isGuest,
    login,
    register,
    createGuestAccount,
    upgradeGuestAccount,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export for convenience
export default useAuth; 