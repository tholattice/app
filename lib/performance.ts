// Performance optimization utilities for the dashboard
import React from 'react';

// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 30 seconds)
  key?: string; // Custom cache key
}

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

export function setCachedData<T>(key: string, data: T, ttl: number = 30000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Debounce utility for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for frequent operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy loading utility for components
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  return React.lazy(() => 
    importFunc().catch(() => {
      if (fallback) {
        return { default: fallback as T };
      }
      throw new Error('Failed to load component');
    })
  );
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
}

// Performance monitoring
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
    return result;
  }
}

// Database query optimization helpers
export function optimizePrismaQuery(query: any) {
  // Add select only needed fields
  if (!query.select && !query.include) {
    console.warn('Consider adding select or include to optimize Prisma query');
  }
  
  // Add pagination for large datasets
  if (!query.take && !query.skip) {
    console.warn('Consider adding pagination (take/skip) for large datasets');
  }
  
  return query;
}

// Memory usage monitoring
export function getMemoryUsage(): { used: number; total: number; percentage: number } {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    const used = Math.round(usage.heapUsed / 1024 / 1024);
    const total = Math.round(usage.heapTotal / 1024 / 1024);
    const percentage = Math.round((used / total) * 100);
    
    return { used, total, percentage };
  }
  
  return { used: 0, total: 0, percentage: 0 };
}

// Bundle size optimization
export const BUNDLE_ANALYZER = process.env.ANALYZE === 'true';

// Image optimization
export const IMAGE_OPTIMIZATION = {
  quality: 75,
  format: 'webp' as const,
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  domains: ['localhost', 'vercel.app', 'tholattice.com']
};

// API rate limiting
export const API_RATE_LIMITS = {
  dashboard: { requests: 100, window: 60000 }, // 100 requests per minute
  appointments: { requests: 50, window: 60000 },
  customers: { requests: 30, window: 60000 }
};
