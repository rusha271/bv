'use client';

import React from 'react';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorDisplay
          error={this.state.error?.message || 'An unexpected error occurred'}
          title="Something went wrong"
          variant="paper"
          onRetry={() => this.setState({ hasError: false, error: undefined })}
          retryText="Try Again"
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
