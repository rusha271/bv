import { User } from '@/utils/apiService';

export type UserRole = 'admin' | 'user' | 'consultant' | 'guest';

export interface Permission {
  name: string;
  description: string;
  roles: UserRole[];
}

// Define permissions for different features
export const PERMISSIONS = {
  // Guest permissions (limited access)
  VIEW_PUBLIC_CONTENT: {
    name: 'view_public_content',
    description: 'View public content and basic features',
    roles: ['guest', 'user', 'consultant', 'admin']
  },
  
  // User permissions (standard access)
  SAVE_PREFERENCES: {
    name: 'save_preferences',
    description: 'Save user preferences and settings',
    roles: ['user', 'consultant', 'admin']
  },
  
  ACCESS_FULL_FEATURES: {
    name: 'access_full_features',
    description: 'Access all application features',
    roles: ['user', 'consultant', 'admin']
  },
  
  // Consultant permissions (enhanced access)
  MANAGE_CLIENTS: {
    name: 'manage_clients',
    description: 'Manage client accounts and data',
    roles: ['consultant', 'admin']
  },
  
  VIEW_ANALYTICS: {
    name: 'view_analytics',
    description: 'View detailed analytics and reports',
    roles: ['consultant', 'admin']
  },
  
  // Admin permissions (full access)
  MANAGE_USERS: {
    name: 'manage_users',
    description: 'Manage all user accounts',
    roles: ['admin']
  },
  
  MANAGE_SYSTEM: {
    name: 'manage_system',
    description: 'Manage system settings and configuration',
    roles: ['admin']
  },
  
  VIEW_ADMIN_DASHBOARD: {
    name: 'view_admin_dashboard',
    description: 'Access admin dashboard',
    roles: ['admin']
  }
} as const;

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User | null, permissionName: keyof typeof PERMISSIONS): boolean {
  if (!user) return false;
  
  const permission = PERMISSIONS[permissionName];
  if (!permission) return false;
  
  const userRole = user.role?.name || user.role;
  return permission.roles.includes(userRole as UserRole);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissionNames: (keyof typeof PERMISSIONS)[]): boolean {
  return permissionNames.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissionNames: (keyof typeof PERMISSIONS)[]): boolean {
  return permissionNames.every(permission => hasPermission(user, permission));
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: User | null): string[] {
  if (!user) return [];
  
  const userRole = user.role?.name || user.role;
  return Object.entries(PERMISSIONS)
    .filter(([_, permission]) => permission.roles.includes(userRole as UserRole))
    .map(([_, permission]) => permission.name);
}

/**
 * Check if user is a guest
 */
export function isGuestUser(user: User | null): boolean {
  return user?.role?.name === 'guest' || user?.role === 'guest';
}

/**
 * Check if user is an admin
 */
export function isAdminUser(user: User | null): boolean {
  return user?.role?.name === 'admin' || user?.role === 'admin';
}

/**
 * Check if user is a consultant
 */
export function isConsultantUser(user: User | null): boolean {
  return user?.role?.name === 'consultant' || user?.role === 'consultant';
}

/**
 * Check if user is a regular user (not guest, admin, or consultant)
 */
export function isRegularUser(user: User | null): boolean {
  return user?.role?.name === 'user' || user?.role === 'user';
}

/**
 * Get user role display name
 */
export function getUserRoleDisplayName(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'consultant':
      return 'Consultant';
    case 'user':
      return 'User';
    case 'guest':
      return 'Guest';
    default:
      return 'Unknown';
  }
}

/**
 * Get user role color for UI
 */
export function getUserRoleColor(role: string): string {
  switch (role) {
    case 'admin':
      return 'text-red-600 bg-red-100';
    case 'consultant':
      return 'text-purple-600 bg-purple-100';
    case 'user':
      return 'text-blue-600 bg-blue-100';
    case 'guest':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}
