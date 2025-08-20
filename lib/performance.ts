// Performance optimization utilities for the dashboard
import React from 'react';

// Simple in-memory cache for API responses with improved error handling
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 30 seconds)
  key?: string; // Custom cache key
}

export function getCachedData<T>(key: string): T | null {
  try {
    const cached = cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T, ttl: number = 30000): void {
  try {
    // Clear cache if data is null (for cache invalidation)
    if (data === null) {
      cache.delete(key);
      return;
    }
    
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  } catch (error) {
    console.error('Error setting cached data:', error);
  }
}

export function clearCache(key?: string): void {
  try {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
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

// Performance monitoring with better error handling
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  try {
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
  } catch (error) {
    const end = performance.now();
    console.error(`${name} failed after ${end - start}ms:`, error);
    throw error;
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
  try {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      const used = Math.round(usage.heapUsed / 1024 / 1024);
      const total = Math.round(usage.heapTotal / 1024 / 1024);
      const percentage = Math.round((used / total) * 100);
      
      return { used, total, percentage };
    }
  } catch (error) {
    console.error('Error getting memory usage:', error);
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

// API rate limiting with improved configuration
export const API_RATE_LIMITS = {
  dashboard: { requests: 200, window: 60000 }, // Increased from 100 to 200 requests per minute
  appointments: { requests: 100, window: 60000 }, // Increased from 50 to 100
  customers: { requests: 60, window: 60000 }, // Increased from 30 to 60
  employees: { requests: 60, window: 60000 } // New limit for employee operations
};

// Cache configuration
export const CACHE_CONFIG = {
  defaultTTL: 30000, // 30 seconds
  shortTTL: 10000, // 10 seconds for frequently changing data
  longTTL: 300000, // 5 minutes for static data
  maxCacheSize: 100 // Maximum number of cached items
};

// Clean up cache periodically to prevent memory leaks
setInterval(() => {
  try {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    cache.forEach((value, key) => {
      if (now - value.timestamp > value.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => cache.delete(key));
    
    // Limit cache size
    if (cache.size > CACHE_CONFIG.maxCacheSize) {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, cache.size - CACHE_CONFIG.maxCacheSize);
      toDelete.forEach(([key]) => cache.delete(key));
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}, 60000); // Clean up every minute
