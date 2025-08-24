# Guest Account System

This document describes the Guest Account system implementation for the Brahma Vastu application.

## Overview

The Guest Account system allows visitors to use the application without creating a permanent account. When a visitor enters the site without logging in, the system automatically creates a temporary guest account with limited permissions.

## Features

### 1. Automatic Guest Account Creation
- Creates temporary guest accounts for unauthenticated visitors
- Uses session storage to prevent duplicate guest account creation
- Guest accounts have unique email addresses (guest_<uuid>@example.com)

### 2. Guest Account Upgrade
- Guests can upgrade their temporary account to a permanent account
- Preserves all guest account data during upgrade
- Seamless transition from guest to full user

### 3. Role-Based Access Control
- Four user roles: Admin, User, Consultant, Guest
- Permission-based access control for different features
- Guest accounts have limited access to features

### 4. UI Components
- Guest banner showing upgrade option
- Upgrade modal with form validation
- Protected routes with role-based restrictions

## Architecture

### Backend API Endpoints

The system expects these backend endpoints to be implemented:

```typescript
// Guest Account Endpoints
POST /api/auth/guest/create
- Creates a new guest account
- Returns AuthResponse with access token and user data

POST /api/auth/guest/upgrade
- Upgrades guest account to full account
- Body: { name: string, email: string, password: string }
- Returns AuthResponse with new access token

GET /api/auth/guest/check
- Checks if current user is a guest
- Returns { is_guest: boolean }
```

### Frontend Components

#### 1. GuestAccountManager
- Automatically creates guest accounts for unauthenticated visitors
- Manages guest account lifecycle
- Prevents duplicate guest account creation

#### 2. GuestBanner
- Shows banner for guest users
- Provides upgrade option
- Can be dismissed for the session

#### 3. GuestUpgradeModal
- Form for upgrading guest account
- Validation for name, email, and password
- Success feedback and error handling

#### 4. ProtectedRoute
- Role-based access control
- Permission checking
- Guest account restrictions

### Authentication Context Updates

The AuthContext has been extended with guest account functionality:

```typescript
interface AuthContextType {
  // ... existing properties
  isGuest: boolean;
  createGuestAccount: () => Promise<void>;
  upgradeGuestAccount: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<void>;
}
```

## Database Schema

The user table should support guest accounts with these fields:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_encrypted VARCHAR(255), -- NULL for guest accounts
  oauth_provider VARCHAR(50), -- 'guest' for guest accounts
  oauth_id VARCHAR(255),
  role_id VARCHAR(50) NOT NULL, -- 'guest', 'user', 'consultant', 'admin'
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Permissions System

### Permission Levels

1. **Guest Permissions**
   - View public content
   - Basic feature access
   - Limited functionality

2. **User Permissions**
   - All guest permissions
   - Save preferences
   - Full feature access
   - Data persistence

3. **Consultant Permissions**
   - All user permissions
   - Manage clients
   - View analytics
   - Enhanced features

4. **Admin Permissions**
   - All permissions
   - Manage users
   - System configuration
   - Admin dashboard access

### Usage Examples

```typescript
import { hasPermission, PERMISSIONS } from '@/utils/permissions';

// Check if user can save preferences
const canSavePreferences = hasPermission(user, 'SAVE_PREFERENCES');

// Check if user can access admin features
const canAccessAdmin = hasPermission(user, 'VIEW_ADMIN_DASHBOARD');

// Protected route with permission check
<ProtectedRoute requiredPermission="MANAGE_USERS">
  <AdminPanel />
</ProtectedRoute>
```

## Implementation Guide

### 1. Setup Guest Account Manager

Add to your layout:

```typescript
import GuestAccountManager from '@/components/GuestAccountManager';

<AuthProvider>
  <GuestAccountManager>
    {/* Your app content */}
  </GuestAccountManager>
</AuthProvider>
```

### 2. Add Guest Banner

```typescript
import GuestBanner from '@/components/GuestBanner';

<GuestBanner />
```

### 3. Protect Routes

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

// Allow guests
<ProtectedRoute allowGuests={true}>
  <PublicPage />
</ProtectedRoute>

// Require full account
<ProtectedRoute allowGuests={false}>
  <PrivatePage />
</ProtectedRoute>

// Require specific role
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>

// Require specific permission
<ProtectedRoute requiredPermission="MANAGE_USERS">
  <UserManagement />
</ProtectedRoute>
```

### 4. Handle Guest Upgrades

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { upgradeGuestAccount } = useAuth();

const handleUpgrade = async (name: string, email: string, password: string) => {
  try {
    await upgradeGuestAccount(name, email, password, true);
    // Account upgraded successfully
  } catch (error) {
    // Handle error
  }
};
```

## Security Considerations

1. **Guest Account Expiration**
   - Guest accounts should have limited lifespan
   - Implement cleanup for expired guest accounts
   - Consider session-based expiration

2. **Rate Limiting**
   - Limit guest account creation rate
   - Prevent abuse of guest account system
   - Implement IP-based restrictions

3. **Data Privacy**
   - Guest accounts should not store sensitive data
   - Clear data when guest accounts expire
   - Implement data retention policies

4. **Upgrade Security**
   - Validate email uniqueness during upgrade
   - Ensure secure password requirements
   - Implement email verification for upgrades

## Testing

### Test Cases

1. **Guest Account Creation**
   - Verify automatic creation for unauthenticated users
   - Test duplicate prevention
   - Validate guest account properties

2. **Guest Account Upgrade**
   - Test upgrade flow with valid data
   - Test validation errors
   - Verify data preservation during upgrade

3. **Permission System**
   - Test role-based access control
   - Verify permission inheritance
   - Test guest account restrictions

4. **UI Components**
   - Test banner display/hide logic
   - Test modal functionality
   - Test responsive design

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import GuestBanner from '@/components/GuestBanner';

test('shows upgrade button for guest users', () => {
  render(
    <AuthProvider>
      <GuestBanner />
    </AuthProvider>
  );
  
  expect(screen.getByText('Upgrade Account')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Guest accounts not created**
   - Check if backend endpoints are implemented
   - Verify API service configuration
   - Check browser console for errors

2. **Upgrade fails**
   - Validate form data
   - Check backend validation
   - Verify email uniqueness

3. **Permissions not working**
   - Check user role assignment
   - Verify permission definitions
   - Test permission checking logic

### Debug Mode

Enable debug logging:

```typescript
// In development
localStorage.setItem('debug_guest_accounts', 'true');
```

## Future Enhancements

1. **Guest Account Analytics**
   - Track guest account usage
   - Monitor upgrade conversion rates
   - Analyze user behavior patterns

2. **Advanced Guest Features**
   - Guest account customization
   - Temporary data storage
   - Social login integration

3. **Automated Cleanup**
   - Scheduled guest account cleanup
   - Data retention policies
   - Performance optimization

## Support

For issues or questions about the Guest Account system, please refer to:
- API documentation
- Component documentation
- Backend implementation guide
