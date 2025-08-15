"use client";

import { useEffect, useState } from 'react';
import { getMemoryUsage } from '@/lib/performance';

interface PerformanceMetrics {
  memoryUsage: { used: number; total: number; percentage: number };
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  className?: string;
}

export default function PerformanceMonitor({ showDetails = false, className = '' }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: { used: 0, total: 0, percentage: 0 },
    loadTime: 0,
    renderTime: 0,
    apiResponseTime: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development' || showDetails) {
      setIsVisible(true);
    }

    // Measure page load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Measure memory usage
    const updateMemoryUsage = () => {
      const memoryUsage = getMemoryUsage();
      setMetrics(prev => ({ ...prev, memoryUsage }));
    };

    updateMemoryUsage();
    const memoryInterval = setInterval(updateMemoryUsage, 5000);

    // Measure render time
    const renderStart = performance.now();
    const renderTime = renderStart - loadTime;
    setMetrics(prev => ({ ...prev, renderTime }));

    return () => {
      clearInterval(memoryInterval);
    };
  }, [showDetails]);

  // Monitor API response times
  useEffect(() => {
    const originalFetch = window.fetch;
    let totalResponseTime = 0;
    let requestCount = 0;

    window.fetch = async (...args) => {
      const start = performance.now();
      try {
        const response = await originalFetch(...args);
        const end = performance.now();
        const responseTime = end - start;
        
        totalResponseTime += responseTime;
        requestCount++;
        
        setMetrics(prev => ({
          ...prev,
          apiResponseTime: totalResponseTime / requestCount
        }));
        
        return response;
      } catch (error) {
        return originalFetch(...args);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!isVisible) return null;

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value <= threshold * 0.7) return 'text-green-600';
    if (value <= threshold) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Performance Monitor
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Load Time:</span>
          <span className={getPerformanceColor(metrics.loadTime, 1000)}>
            {metrics.loadTime.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Render Time:</span>
          <span className={getPerformanceColor(metrics.renderTime, 500)}>
            {metrics.renderTime.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">API Response:</span>
          <span className={getPerformanceColor(metrics.apiResponseTime, 200)}>
            {metrics.apiResponseTime.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Memory:</span>
          <span className={getPerformanceColor(metrics.memoryUsage.percentage, 80)}>
            {metrics.memoryUsage.used}MB ({metrics.memoryUsage.percentage}%)
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div>Total Memory: {metrics.memoryUsage.total}MB</div>
            <div>Performance Score: {calculatePerformanceScore(metrics)}/100</div>
          </div>
        </div>
      )}
    </div>
  );
}

function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100;
  
  // Deduct points for slow load times
  if (metrics.loadTime > 1000) score -= 20;
  else if (metrics.loadTime > 500) score -= 10;
  
  // Deduct points for slow render times
  if (metrics.renderTime > 500) score -= 20;
  else if (metrics.renderTime > 200) score -= 10;
  
  // Deduct points for slow API responses
  if (metrics.apiResponseTime > 200) score -= 20;
  else if (metrics.apiResponseTime > 100) score -= 10;
  
  // Deduct points for high memory usage
  if (metrics.memoryUsage.percentage > 80) score -= 20;
  else if (metrics.memoryUsage.percentage > 60) score -= 10;
  
  return Math.max(0, score);
}
