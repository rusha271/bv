# API Service Documentation

This document describes the comprehensive API service layer that matches your FastAPI backend endpoints.

## Overview

The API service is organized into several modules:

1. **`apiClient.ts`** - Base HTTP client with interceptors and error handling
2. **`apiService.ts`** - Organized API methods matching your FastAPI routers
3. **`useApi.ts`** - React hooks for easy API integration
4. **`ApiExample.tsx`** - Example component demonstrating usage

## FastAPI Endpoints Covered

The service covers all your FastAPI routers:

- `/api/auth` - Authentication (login, register, logout, etc.)
- `/api/users` - User management
- `/api/files` - File upload and management
- `/api/floorplan` - Floor plan analysis
- `/api/chat` - Chat functionality
- `/api/blog` - Blog posts
- `/api/legal` - Legal documents
- `/api/analytics` - Analytics and tracking
- `/api/contact` - Contact forms
- `/api/vastu` - Vastu analysis
- `/api/roles` - Role management

## Basic Usage

### 1. Direct API Service Usage

```typescript
import { apiService } from '@/utils/apiService';

// Authentication
const login = async () => {
  try {
    const response = await apiService.auth.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Logged in:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// File upload
const uploadFile = async (file: File) => {
  try {
    const result = await apiService.files.upload(file);
    console.log('File uploaded:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Vastu analysis
const analyzeVastu = async () => {
  try {
    const analysis = await apiService.vastu.analyze({
      property_type: 'residential',
      direction: 'north',
      floor_plan: file // optional
    });
    console.log('Analysis result:', analysis);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};
```

### 2. Using React Hooks

```typescript
import { useAuth, useChat, useVastuAnalysis } from '@/utils/useApi';

const MyComponent = () => {
  // Authentication hook
  const { user, loading, error, login, logout } = useAuth();
  
  // Chat hook
  const { messages, sending, sendMessage } = useChat();
  
  // Vastu analysis hook
  const { analyzing, analyses, analyze } = useVastuAnalysis();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      )}
    </div>
  );
};
```

## Available Hooks

### `useAuth()`
Authentication management with automatic token handling.

```typescript
const {
  user,           // Current user object
  loading,        // Loading state
  error,          // Error message
  login,          // Login function
  register,       // Register function
  logout,         // Logout function
  getCurrentUser  // Get current user function
} = useAuth();
```

### `useChat()`
Chat functionality with message history.

```typescript
const {
  messages,       // Array of chat messages
  sending,        // Sending state
  error,          // Error message
  sendMessage,    // Send message function
  loadHistory,    // Load chat history
  clearHistory    // Clear chat history
} = useChat();
```

### `useVastuAnalysis()`
Vastu analysis with file upload support.

```typescript
const {
  analyzing,      // Analysis in progress
  analyses,       // Array of analysis results
  error,          // Error message
  analyze,        // Analyze function
  loadMyAnalyses  // Load user's analyses
} = useVastuAnalysis();
```

### `useFileUpload()`
File upload with progress tracking.

```typescript
const {
  uploading,      // Upload in progress
  uploadedFiles,  // Array of uploaded files
  error,          // Error message
  uploadFile,     // Upload single file
  uploadMultipleFiles // Upload multiple files
} = useFileUpload();
```

### `useBlog()`
Blog post management.

```typescript
const {
  posts,          // Array of blog posts
  loading,        // Loading state
  error,          // Error message
  loadPosts,      // Load all posts
  createPost      // Create new post
} = useBlog();
```

### `useContact()`
Contact form handling.

```typescript
const {
  sending,        // Sending state
  error,          // Error message
  success,        // Success state
  sendMessage     // Send contact message
} = useContact();
```

### `useAnalytics()`
Analytics and tracking.

```typescript
const {
  data,           // Analytics data
  loading,        // Loading state
  error,          // Error message
  loadDashboard,  // Load dashboard data
  trackEvent      // Track custom events
} = useAnalytics();
```

## API Service Methods

### Authentication (`apiService.auth`)

```typescript
// Login
await apiService.auth.login({ email, password });

// Register
await apiService.auth.register({ name, email, password });

// Logout
await apiService.auth.logout();

// Get current user
await apiService.auth.me();

// Refresh token
await apiService.auth.refresh();

// Forgot password
await apiService.auth.forgotPassword(email);

// Reset password
await apiService.auth.resetPassword(token, newPassword);

// Verify email
await apiService.auth.verifyEmail(token);

// Resend verification
await apiService.auth.resendVerification();
```

### Users (`apiService.users`)

```typescript
// Get all users
await apiService.users.getAll();

// Get user by ID
await apiService.users.getById(id);

// Update user
await apiService.users.update(id, { name, email });

// Delete user
await apiService.users.delete(id);

// Update profile
await apiService.users.updateProfile({ name, email });

// Change password
await apiService.users.changePassword(currentPassword, newPassword);
```

### Files (`apiService.files`)

```typescript
// Upload single file
await apiService.files.upload(file);

// Upload multiple files
await apiService.files.uploadMultiple(files);

// Get file by ID
await apiService.files.getById(id);

// Delete file
await apiService.files.delete(id);

// Get user's files
await apiService.files.getMyFiles();
```

### Floorplan (`apiService.floorplan`)

```typescript
// Get all floorplans
await apiService.floorplan.getAll();

// Get floorplan by ID
await apiService.floorplan.getById(id);

// Create floorplan
await apiService.floorplan.create({
  name: 'My House',
  description: 'Residential property',
  image_file: file
});

// Update floorplan
await apiService.floorplan.update(id, {
  name: 'Updated Name',
  image_file: newFile
});

// Delete floorplan
await apiService.floorplan.delete(id);

// Analyze floorplan
await apiService.floorplan.analyze(id);
```

### Chat (`apiService.chat`)

```typescript
// Send message
await apiService.chat.sendMessage({ message, context });

// Get chat history
await apiService.chat.getHistory();

// Clear history
await apiService.chat.clearHistory();

// Get conversation
await apiService.chat.getConversation(conversationId);

// Get conversations
await apiService.chat.getConversations();
```

### Blog (`apiService.blog`)

```typescript
// Get all posts
await apiService.blog.getAll();

// Get post by ID
await apiService.blog.getById(id);

// Create post
await apiService.blog.create({ title, content, tags });

// Update post
await apiService.blog.update(id, { title, content, tags });

// Delete post
await apiService.blog.delete(id);

// Get posts by tag
await apiService.blog.getByTag(tag);

// Search posts
await apiService.blog.search(query);
```

### Legal (`apiService.legal`)

```typescript
// Get terms of service
await apiService.legal.getTerms();

// Get privacy policy
await apiService.legal.getPrivacy();

// Get disclaimer
await apiService.legal.getDisclaimer();

// Update terms (admin only)
await apiService.legal.updateTerms(content);

// Update privacy (admin only)
await apiService.legal.updatePrivacy(content);

// Update disclaimer (admin only)
await apiService.legal.updateDisclaimer(content);
```

### Analytics (`apiService.analytics`)

```typescript
// Get dashboard data
await apiService.analytics.getDashboard();

// Get page views
await apiService.analytics.getPageViews(startDate, endDate);

// Track event
await apiService.analytics.trackEvent(event, properties);

// Get user analytics
await apiService.analytics.getUserAnalytics();
```

### Contact (`apiService.contact`)

```typescript
// Send message
await apiService.contact.sendMessage({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Inquiry',
  message: 'Hello, I have a question...'
});

// Get messages (admin only)
await apiService.contact.getMessages();

// Get message by ID (admin only)
await apiService.contact.getMessageById(id);

// Delete message (admin only)
await apiService.contact.deleteMessage(id);
```

### Vastu (`apiService.vastu`)

```typescript
// Analyze vastu
await apiService.vastu.analyze({
  property_type: 'residential',
  direction: 'north',
  floor_plan: file // optional
});

// Get analysis by ID
await apiService.vastu.getAnalysis(id);

// Get user's analyses
await apiService.vastu.getMyAnalyses();

// Delete analysis
await apiService.vastu.deleteAnalysis(id);

// Get recommendations
await apiService.vastu.getRecommendations(propertyType, direction);
```

### Roles (`apiService.roles`)

```typescript
// Get all roles
await apiService.roles.getAll();

// Get role by ID
await apiService.roles.getById(id);

// Create role
await apiService.roles.create({ name, permissions });

// Update role
await apiService.roles.update(id, { name, permissions });

// Delete role
await apiService.roles.delete(id);

// Assign role to user
await apiService.roles.assignRole(userId, roleId);

// Remove role from user
await apiService.roles.removeRole(userId, roleId);
```

## Error Handling

All API calls include comprehensive error handling:

```typescript
try {
  const result = await apiService.auth.login({ email, password });
  // Success
} catch (error) {
  // Error object contains:
  // - status: HTTP status code
  // - message: Error message
  // - data: Additional error data
  console.error('Error:', error.message);
}
```

## Configuration

The API client is configured in `apiClient.ts`:

```typescript
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

## Environment Variables

Set your API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Example Component

See `src/components/examples/ApiExample.tsx` for a complete example of how to use all the API services and hooks in a React component.

## TypeScript Support

All API methods are fully typed with TypeScript interfaces for request and response data. The types are defined in `apiService.ts` and can be imported for use in your components. 