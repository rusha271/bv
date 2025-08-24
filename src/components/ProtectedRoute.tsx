'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, PERMISSIONS, isGuestUser } from '@/utils/permissions';
import { User } from '@/utils/apiService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof typeof PERMISSIONS;
  requiredRole?: 'admin' | 'user' | 'consultant' | 'guest';
  allowGuests?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  allowGuests = false,
  fallback,
  redirectTo
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, isGuest } = useAuth();

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (redirectTo) {
      // In a real app, you'd use Next.js router here
      window.location.href = redirectTo;
      return null;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access this page.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check if guests are allowed
  if (!allowGuests && isGuestUser(user)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-yellow-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Guest Account Restricted</h2>
          <p className="text-gray-600 mb-6">
            This feature requires a full account. Please upgrade your guest account to continue.
          </p>
          <button
            onClick={() => {
              // Trigger guest upgrade modal
              const event = new CustomEvent('openGuestUpgrade');
              window.dispatchEvent(event);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Upgrade Account
          </button>
        </div>
      </div>
    );
  }

  // Check required role
  if (requiredRole && user.role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have the required role to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: <span className="font-semibold">{requiredRole}</span>
          </p>
        </div>
      </div>
    );
  }

  // Check required permission
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have the required permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required permission: <span className="font-semibold">{PERMISSIONS[requiredPermission].description}</span>
          </p>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

export default ProtectedRoute;
