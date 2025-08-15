"use client";
import React, { Suspense, lazy, ComponentType, ReactNode } from 'react';
import Loader from './Loader';

interface PerformanceWrapperProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
  errorBoundary?: boolean;
}

export default function PerformanceWrapper({
  component,
  fallback = <Loader />,
  props = {},
  errorBoundary = true
}: PerformanceWrapperProps) {
  const LazyComponent = lazy(component);
  
  const ComponentWithErrorBoundary = () => {
    if (errorBoundary) {
      return (
        <ErrorBoundary fallback={fallback}>
          <LazyComponent {...props} />
        </ErrorBoundary>
      );
    }
    return <LazyComponent {...props} />;
  };

  return (
    <Suspense fallback={fallback}>
      <ComponentWithErrorBoundary />
    </Suspense>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('PerformanceWrapper Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
