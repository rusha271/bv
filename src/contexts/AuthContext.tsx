'use client';

import React, { createContext, useContext, useEffect, useReducer, useCallback, useRef, useMemo } from 'react';
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

// Auth state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
  refreshTimer: NodeJS.Timeout | null;
}

// Auth action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_GUEST'; payload: boolean }
  | { type: 'SET_REFRESH_TIMER'; payload: NodeJS.Timeout | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; isGuest: boolean } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_TIMER' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_GUEST':
      return { ...state, isGuest: action.payload };
    case 'SET_REFRESH_TIMER':
      return { ...state, refreshTimer: action.payload };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload.user, 
        isGuest: action.payload.isGuest,
        isLoading: false 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isGuest: false, 
        refreshTimer: null 
      };
    case 'CLEAR_TIMER':
      return { ...state, refreshTimer: null };
    default:
      return state;
  }
};

// Initial state - set isLoading to false to prevent hydration mismatch
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isGuest: false,
  refreshTimer: null,
};

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { user, isLoading, isGuest, refreshTimer } = state;
  
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
          dispatch({ type: 'SET_REFRESH_TIMER', payload: timeout });
        }
      }
      
      // Update user if needed - use ref to avoid dependency issues
      if (!userRef.current) {
        try {
          const currentUser = await apiService.auth.me();
          dispatch({ type: 'SET_USER', payload: currentUser });
        } catch (error) {
          console.error('Failed to get user after token refresh:', error);
          // Don't throw here, just log the error
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearStoredTokens();
      dispatch({ type: 'SET_USER', payload: null });
      throw error;
    }
  }, []); // Remove user dependency

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens) {
        dispatch({ type: 'SET_LOADING', payload: false });
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
          dispatch({ type: 'SET_LOADING', payload: false });
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
            dispatch({ type: 'SET_REFRESH_TIMER', payload: timeout });
          }
        }
        
        // Get current user and check if guest
        try {
          const currentUser = await apiService.auth.me();
          
          // Decode JWT to get user role and other claims
          const decodedToken = decodeJWT(tokens.access_token);
          const userRole = decodedToken?.role || currentUser.role?.name || 'user';
          
          // Update user with role from JWT
          const userWithRole: User = {
            ...currentUser,
            role: { id: 1, name: userRole }
          };
          
          dispatch({ type: 'SET_USER', payload: userWithRole });
          
          // Check if current user is a guest - use JWT claim if available to avoid extra API call
          const isGuestFromJWT = decodedToken?.is_guest;
          if (isGuestFromJWT !== undefined) {
            dispatch({ type: 'SET_GUEST', payload: isGuestFromJWT });
          } else {
            // Only make API call if JWT doesn't contain guest info
            try {
              const guestCheck = await apiService.auth.isGuest();
              dispatch({ type: 'SET_GUEST', payload: guestCheck.is_guest });
            } catch (error) {
              // Silently handle guest status check failure
              // console.error('Failed to check guest status:', error);
              // Default to false if check fails
              dispatch({ type: 'SET_GUEST', payload: false });
            }
          }
        } catch (error) {
          // Silently handle user fetch failure during initialization
          // console.error('Failed to get current user:', error);
          // Don't clear tokens here, let the user try to refresh
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearStoredTokens();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [refreshToken]);

  // Login function - optimized to batch state updates
  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await apiService.auth.login({ email, password });
      const authTokens: AuthTokens = { access_token: response.access_token, refresh_token: response.refresh_token };
      storeTokens(authTokens, rememberMe);
  
      const expiryTime = getTokenExpiryTime(response.access_token);
      if (expiryTime) {
        const refreshTime = expiryTime - (5 * 60 * 1000);
        if (refreshTime > Date.now()) {
          const timeout = setTimeout(refreshToken, refreshTime - Date.now());
          dispatch({ type: 'SET_REFRESH_TIMER', payload: timeout });
        }
      }
  
      // Decode JWT to get user role and other claims
      const decodedToken = decodeJWT(response.access_token);
      const userRole = decodedToken?.role || response.user.role || 'user';
      
      const userData: User = {
        ...response.user,
        role: { id: 1, name: userRole },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
  
      // Batch all state updates in a single dispatch
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: userData, 
          isGuest: false 
        } 
      });

      // Emit login success event for SmartPageLoader
      window.dispatchEvent(new CustomEvent('authSuccess', { 
        detail: { type: 'login', user: userData } 
      }));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [refreshToken]);
  
  // Register function - optimized to batch state updates
  const register = useCallback(async (name: string, email: string, password: string, rememberMe = false) => {
    try {
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
          dispatch({ type: 'SET_REFRESH_TIMER', payload: timeout });
        }
      }
      
      // Decode JWT to get user role and other claims
      const decodedToken = decodeJWT(response.access_token);
      const userRole = decodedToken?.role || response.user.role || 'user';
      
      // Convert response.user to User type by adding missing fields and converting role
      const userData: User = {
        ...response.user,
        role: { id: 1, name: userRole },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Batch all state updates in a single dispatch
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: userData, 
          isGuest: false 
        } 
      });

      // Emit registration success event for SmartPageLoader
      window.dispatchEvent(new CustomEvent('authSuccess', { 
        detail: { type: 'register', user: userData } 
      }));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, [refreshToken]);

  // Logout function - optimized to batch state updates
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
      
      // Batch all state updates in a single dispatch
      dispatch({ type: 'LOGOUT' });

      // Emit logout event for SmartPageLoader
      window.dispatchEvent(new CustomEvent('authLogout', { 
        detail: { type: 'logout' } 
      }));
    }
  }, []);

  // Create guest account function - optimized to batch state updates
  const createGuestAccount = useCallback(async () => {
    try {
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
          dispatch({ type: 'SET_REFRESH_TIMER', payload: timeout });
        }
      }
      
      // Decode JWT to get user role and other claims
      const decodedToken = decodeJWT(response.access_token);
      const userRole = decodedToken?.role || response.user.role || 'user';
      
      // Convert response.user to User type by adding missing fields and converting role
      const userData: User = {
        ...response.user,
        role: { id: 1, name: userRole },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Batch all state updates in a single dispatch
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: userData, 
          isGuest: true 
        } 
      });
    } catch (error) {
      console.error('Guest account creation failed:', error);
      throw error;
    }
  }, [refreshToken]);

  // Upgrade guest account function - optimized to batch state updates
  const upgradeGuestAccount = useCallback(async (name: string, email: string, password: string, rememberMe = false) => {
    try {
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
          dispatch({ type: 'SET_REFRESH_TIMER', payload: timeout });
        }
      }
      
      // Decode JWT to get user role and other claims
      const decodedToken = decodeJWT(response.access_token);
      const userRole = decodedToken?.role || response.user.role || 'user';
      
      // Convert response.user to User type by adding missing fields and converting role
      const userData: User = {
        ...response.user,
        role: { id: 1, name: userRole },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Batch all state updates in a single dispatch
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: userData, 
          isGuest: false 
        } 
      });
    } catch (error) {
      console.error('Guest account upgrade failed:', error);
      throw error;
    }
  }, [refreshToken]);

  // Update user function
  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
  }, [user]);

  // Handle storage changes (cross-tab sync) - optimized with debouncing
  useEffect(() => {
    let storageTimeout: NodeJS.Timeout;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY || e.key === REFRESH_TOKEN_KEY) {
        // Debounce storage changes to prevent excessive re-initialization
        clearTimeout(storageTimeout);
        storageTimeout = setTimeout(() => {
          // Use requestAnimationFrame to batch DOM updates
          requestAnimationFrame(() => {
            initializeAuth();
          });
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange, { passive: true });
    return () => {
      clearTimeout(storageTimeout);
      window.removeEventListener('storage', handleStorageChange);
    };
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

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(() => ({
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
  }), [user, isLoading, isGuest, login, register, createGuestAccount, upgradeGuestAccount, logout, refreshToken, updateUser]);

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

// Selective auth hooks to prevent unnecessary re-renders
export function useAuthUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthUser must be used within an AuthProvider');
  }
  return context.user;
}

export function useAuthLoading() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthLoading must be used within an AuthProvider');
  }
  return context.isLoading;
}

export function useAuthGuest() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthGuest must be used within an AuthProvider');
  }
  return context.isGuest;
}

export function useAuthActions() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return {
    login: context.login,
    register: context.register,
    createGuestAccount: context.createGuestAccount,
    upgradeGuestAccount: context.upgradeGuestAccount,
    logout: context.logout,
    refreshToken: context.refreshToken,
    updateUser: context.updateUser,
  };
}

// Export for convenience
export default useAuth; 