"use client";

import { Suspense, lazy, ComponentType } from 'react';
import Loader from './Loader';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ComponentType;
  props?: Record<string, any>;
}

export default function LazyComponent({ 
  component, 
  fallback = Loader, 
  props = {} 
}: LazyComponentProps) {
  const LazyLoadedComponent = lazy(component);

  const FallbackComponent = fallback;
  
  return (
    <Suspense fallback={<FallbackComponent />}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  );
}

// Predefined lazy components for common dashboard elements
export const LazyDashboardOverview = lazy(() => import('../app/dashboard/components/DashboardOverview'));
export const LazyBusinessMetrics = lazy(() => import('../app/dashboard/components/BusinessMetrics'));
export const LazyRecentAppointments = lazy(() => import('../app/dashboard/components/RecentAppointments'));
export const LazyQuickActions = lazy(() => import('../app/dashboard/components/QuickActions'));
