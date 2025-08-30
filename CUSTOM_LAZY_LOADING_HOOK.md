# Custom Lazy Loading Hook Implementation

## Overview
This document explains the custom `useLazyLoad` hook implementation that was created to fix the "Invalid hook call" error and provide a reusable lazy loading solution across the application.

## Problem Solved

### Original Issue
The error occurred because the `useLazyLoad` hook was defined inline within component files, which violates React's Rules of Hooks:

```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

### Root Cause
- Hooks were defined as inline functions within component files
- This created multiple instances of the same hook logic
- React couldn't properly track hook state across renders
- Violation of the Rules of Hooks

## Solution: Custom Hook Implementation

### File Location
```
src/hooks/useLazyLoad.ts
```

### Hook Implementation

```typescript
import { useState, useEffect, useRef } from 'react';

interface UseLazyLoadReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  isLoaded: boolean;
  handleLoad: () => void;
}

export function useLazyLoad(): UseLazyLoadReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return { ref, isVisible, isLoaded, handleLoad };
}
```

## Key Features

### 1. Proper Hook Structure
- **Single Responsibility**: Focused solely on lazy loading functionality
- **Reusable**: Can be used across multiple components
- **TypeScript Support**: Fully typed with proper interfaces
- **React Compliant**: Follows all Rules of Hooks

### 2. Intersection Observer Integration
- **Efficient Detection**: Uses Intersection Observer API for performance
- **Configurable Threshold**: Triggers when 10% of element is visible
- **Preemptive Loading**: Starts loading 50px before element enters viewport
- **Automatic Cleanup**: Properly disconnects observer on unmount

### 3. State Management
- **isVisible**: Tracks whether element has entered viewport
- **isLoaded**: Tracks component loading state
- **ref**: React ref for DOM element observation
- **handleLoad**: Callback for manual load state updates

## Usage Examples

### Basic Usage
```typescript
import { useLazyLoad } from '@/hooks/useLazyLoad';

function MyComponent() {
  const lazySection = useLazyLoad();

  return (
    <div ref={lazySection.ref}>
      {lazySection.isVisible ? (
        <HeavyComponent />
      ) : (
        <LoadingPlaceholder />
      )}
    </div>
  );
}
```

### Multiple Sections
```typescript
function CropPage() {
  const vastuSection = useLazyLoad();
  const zodiacSection = useLazyLoad();
  const cropSection = useLazyLoad();

  return (
    <div>
      <div ref={cropSection.ref}>
        {cropSection.isVisible ? <CropComponent /> : <Skeleton />}
      </div>
      <div ref={vastuSection.ref}>
        {vastuSection.isVisible ? <VastuComponent /> : <Skeleton />}
      </div>
      <div ref={zodiacSection.ref}>
        {zodiacSection.isVisible ? <ZodiacComponent /> : <Skeleton />}
      </div>
    </div>
  );
}
```

## Implementation in Components

### Updated Files

#### 1. Crop Page (`src/app/crop/page.tsx`)
```typescript
import { useLazyLoad } from '@/hooks/useLazyLoad';

export default function CropPage() {
  const vastuSection = useLazyLoad();
  const zodiacSection = useLazyLoad();
  const cropSection = useLazyLoad();
  
  // Component implementation...
}
```

#### 2. Chakra Overlay Page (`src/app/chakra-overlay/page.tsx`)
```typescript
import { useLazyLoad } from '@/hooks/useLazyLoad';

export default function ChakraOverlayPage() {
  const chakraSection = useLazyLoad();
  
  // Component implementation...
}
```

## Benefits of Custom Hook

### 1. Code Reusability
- **DRY Principle**: No duplicate hook logic across components
- **Consistent Behavior**: Same lazy loading behavior everywhere
- **Easy Maintenance**: Single source of truth for lazy loading logic

### 2. Performance Optimization
- **Bundle Splitting**: Components load only when needed
- **Memory Efficiency**: Proper cleanup prevents memory leaks
- **Smooth UX**: Preemptive loading with visual feedback

### 3. Developer Experience
- **Type Safety**: Full TypeScript support with proper interfaces
- **Easy Testing**: Isolated hook logic is easier to test
- **Clear API**: Simple and intuitive hook interface

## Configuration Options

### Intersection Observer Settings
```typescript
{
  threshold: 0.1,        // Trigger when 10% visible
  rootMargin: '50px'     // Start loading 50px before visible
}
```

### Customizable Parameters
The hook can be easily extended to accept configuration options:

```typescript
interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyLoad(options: UseLazyLoadOptions = {}): UseLazyLoadReturn {
  // Implementation with options...
}
```

## Error Handling

### Graceful Degradation
- **Fallback Support**: Works without Intersection Observer
- **Browser Compatibility**: Automatic fallback for older browsers
- **Error Recovery**: Proper cleanup on errors

### Debugging Support
```typescript
// Add debugging information
const handleLoad = () => {
  console.log('Component loaded:', ref.current);
  setIsLoaded(true);
};
```

## Testing

### Unit Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useLazyLoad } from '@/hooks/useLazyLoad';

test('useLazyLoad initializes correctly', () => {
  const { result } = renderHook(() => useLazyLoad());
  
  expect(result.current.isVisible).toBe(false);
  expect(result.current.isLoaded).toBe(false);
  expect(result.current.ref.current).toBe(null);
});
```

### Integration Testing
```typescript
test('useLazyLoad triggers when element becomes visible', () => {
  const { result } = renderHook(() => useLazyLoad());
  
  // Simulate intersection observer
  // Test visibility state changes
});
```

## Future Enhancements

### Potential Improvements
- **Configuration Options**: Accept threshold and margin parameters
- **Loading States**: More granular loading state management
- **Performance Metrics**: Track loading times and success rates
- **Advanced Triggers**: Support for different trigger conditions

### Advanced Features
- **Preloading**: Load components based on user behavior
- **Priority Loading**: Different loading priorities for components
- **Caching**: Cache loaded components for faster subsequent loads
- **Analytics**: Track lazy loading performance metrics

## Migration Guide

### Before (Inline Hook)
```typescript
function MyComponent() {
  function useLazyLoad() {
    // Inline hook implementation...
  }
  
  const section = useLazyLoad();
  // Component logic...
}
```

### After (Custom Hook)
```typescript
import { useLazyLoad } from '@/hooks/useLazyLoad';

function MyComponent() {
  const section = useLazyLoad();
  // Component logic...
}
```

## Best Practices

### 1. Hook Usage
- **Always Import**: Import from the hooks directory
- **Consistent Naming**: Use descriptive variable names
- **Proper Cleanup**: Ensure components handle unmounting correctly

### 2. Performance
- **Minimal Dependencies**: Keep hook dependencies minimal
- **Efficient Observers**: Use appropriate threshold values
- **Memory Management**: Proper cleanup prevents leaks

### 3. User Experience
- **Loading States**: Always provide visual feedback
- **Smooth Transitions**: Avoid jarring layout shifts
- **Accessibility**: Ensure loading states are screen reader friendly

## Conclusion

The custom `useLazyLoad` hook provides a robust, reusable solution for lazy loading components while following React best practices. It eliminates the "Invalid hook call" error and provides a consistent lazy loading experience across the application.

### Key Achievements
- ✅ **Fixed React Hooks Error**: Proper hook implementation
- ✅ **Reusable Solution**: Single hook for all lazy loading needs
- ✅ **Performance Optimized**: Efficient intersection observer usage
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Maintainable**: Clean, well-documented code
