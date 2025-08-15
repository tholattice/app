"use client";

import { useState, useEffect, memo } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface BusinessMetrics {
  currentMonthAppointments: number;
  previousMonthAppointments: number;
  appointmentGrowth: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  revenueGrowth: number;
  totalMasseuses: number;
  averageAppointmentDuration: number;
}

interface BusinessMetricsProps {
  initialMetrics: BusinessMetrics;
}

const BusinessMetrics = memo(function BusinessMetrics({ initialMetrics }: BusinessMetricsProps) {
  const [metrics, setMetrics] = useState<BusinessMetrics>(initialMetrics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we don't have initial data
    if (initialMetrics.currentMonthAppointments === 0 && initialMetrics.totalMasseuses === 0) {
      const fetchMetrics = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch('/api/dashboard/business-metrics', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch business metrics');
          }
          
          const data = await response.json();
          setMetrics(data);
        } catch (error) {
          console.error("Error fetching business metrics:", error);
          setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchMetrics();
    }
  }, [initialMetrics]);

  const metricCards = [
    {
      name: "Monthly Appointments",
      value: metrics.currentMonthAppointments || 0,
      change: metrics.appointmentGrowth || 0,
      changeType: (metrics.appointmentGrowth || 0) >= 0 ? "increase" : "decrease",
      icon: ArrowTrendingUpIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      name: "Monthly Revenue",
      value: `$${(metrics.currentMonthRevenue || 0).toLocaleString()}`,
      change: metrics.revenueGrowth || 0,
      changeType: (metrics.revenueGrowth || 0) >= 0 ? "increase" : "decrease",
      icon: ArrowTrendingUpIcon,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      name: "Total Masseuses",
      value: metrics.totalMasseuses || 0,
      change: null,
      changeType: null,
      icon: UsersIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      name: "Avg. Duration",
      value: (metrics.averageAppointmentDuration || 0) > 0 ? `${metrics.averageAppointmentDuration} min` : "No data",
      change: null,
      changeType: null,
      icon: ClockIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Metrics
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Business Metrics
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {metricCards.map((metric) => (
          <div
            key={metric.name}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              {metric.change !== null && (
                <div className="flex items-center">
                  {metric.changeType === "increase" ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={`ml-1 text-xs font-medium ${
                      metric.changeType === "increase"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.name}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default BusinessMetrics;
