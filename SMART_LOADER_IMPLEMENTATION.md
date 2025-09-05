# Smart Page Loader Implementation

## Overview

This implementation adds a smart page loader to every page in the application, with intelligent behavior that:

- Shows a loader on all pages except when login/signup modals are open
- Automatically hides after successful login, registration, or logout
- Provides manual control for testing and specific use cases
- Integrates seamlessly with the existing authentication system

## Components

### 1. SmartPageLoader (`src/components/ui/SmartPageLoader.tsx`)

The main loader component that intelligently determines when to show/hide the loader based on:

- **Modal State**: Hides when login/signup modals are open
- **Authentication Events**: Hides after successful login/register/logout
- **Auth Loading State**: Shows during initial authentication check
- **Context Loading**: Shows when LoadingContext is active
- **Manual Control**: Allows programmatic show/hide

### 2. LoadingContext (`src/contexts/LoadingContext.tsx`)

Provides global loading state management with:
- `isLoading`: Current loading state
- `setLoading(boolean)`: Set loading state
- `startLoading()`: Start loading
- `stopLoading()`: Stop loading

### 3. Loader Utils (`src/utils/loaderUtils.ts`)

Utility functions for manual loader control:
- `loaderUtils.show()`: Show loader manually
- `loaderUtils.hide()`: Hide loader manually
- `loaderUtils.simulateLoading(duration)`: Simulate loading for testing

### 4. Loader Test Component (`src/components/examples/LoaderTestComponent.tsx`)

Test component for demonstrating loader functionality during development.

## Integration

### Layout Integration

The loader is integrated into the root layout (`src/app/layout.tsx`):

```tsx
<LoadingProvider>
  <AuthProvider>
    <SmartPageLoader />
    {/* Rest of app */}
  </AuthProvider>
</LoadingProvider>
```

### Event System

The implementation uses custom events for communication:

- `loginModalStateChange`: Emitted when login modal opens/closes
- `signupModalStateChange`: Emitted when signup modal opens/closes
- `authSuccess`: Emitted after successful login/register
- `authLogout`: Emitted after logout
- `manualLoaderControl`: Emitted for manual control

## Behavior

### When Loader Shows

1. **Initial Page Load**: During authentication check
2. **Context Loading**: When LoadingContext.isLoading is true
3. **Manual Control**: When explicitly shown via loaderUtils
4. **Force Show**: When forceShow prop is true

### When Loader Hides

1. **Login/Signup Modal Open**: Automatically hides when modals are open
2. **After Authentication**: Hides after successful login/register/logout
3. **Manual Control**: When explicitly hidden via loaderUtils
4. **Force Hide**: When forceHide prop is true

### Timing

- **Auth Success**: Loader hides for 1 second after successful auth
- **Logout**: Loader hides for 1 second after logout
- **Auto-hide**: Loader auto-hides after 500ms if not authenticated and no modal is open

## Usage Examples

### Basic Usage

The loader works automatically without any additional code needed.

### Manual Control

```typescript
import { loaderUtils } from '@/utils/loaderUtils';

// Show loader
loaderUtils.show();

// Hide loader
loaderUtils.hide();

// Simulate loading for 3 seconds
loaderUtils.simulateLoading(3000);
```

### Force Control

```tsx
// Force show loader (overrides all other conditions)
<SmartPageLoader forceShow={true} />

// Force hide loader (overrides all other conditions)
<SmartPageLoader forceHide={true} />
```

### Testing

Add the test component to any page for testing:

```tsx
import LoaderTestComponent from '@/components/examples/LoaderTestComponent';

// Add to any page component
<LoaderTestComponent />
```

## Customization

### Styling

The loader uses the existing `PageLoader` component, which can be customized by modifying:
- `src/components/ui/PageLoader.tsx`: Main loader component
- Colors, animations, and styling can be adjusted

### Timing

Adjust timing constants in `SmartPageLoader.tsx`:
- Auth success delay: 1000ms
- Logout delay: 1000ms
- Auto-hide delay: 500ms

## Browser Console Testing

The loader utilities are available globally in the browser console:

```javascript
// Show loader
window.loaderUtils.show();

// Hide loader
window.loaderUtils.hide();

// Simulate loading
window.loaderUtils.simulateLoading(2000);
```

## Events

### Listening to Events

```typescript
// Listen for auth success
window.addEventListener('authSuccess', (event) => {
  console.log('User authenticated:', event.detail);
});

// Listen for modal state changes
window.addEventListener('loginModalStateChange', (event) => {
  console.log('Login modal state:', event.detail);
});
```

## Troubleshooting

### Loader Not Showing

1. Check if LoadingProvider is properly wrapped around the app
2. Verify SmartPageLoader is included in the layout
3. Check browser console for any errors
4. Ensure auth context is properly initialized

### Loader Not Hiding

1. Check if login/signup modals are properly emitting events
2. Verify auth success events are being emitted
3. Check for any JavaScript errors preventing event handling
4. Use manual control to test: `window.loaderUtils.hide()`

### Performance

The loader uses React.useMemo for performance optimization and only re-renders when necessary. Event listeners are properly cleaned up to prevent memory leaks.

## Future Enhancements

1. **Route-based Loading**: Show loader during route transitions
2. **API Loading States**: Integrate with API calls for automatic loading
3. **Progress Indicators**: Add progress bars for long operations
4. **Custom Animations**: Allow custom loader animations per page
5. **Loading Messages**: Show contextual loading messages

## Dependencies

- React 18+
- Next.js 13+
- Material-UI
- react-spinners (for ScaleLoader)
- Existing AuthContext and LoadingContext
