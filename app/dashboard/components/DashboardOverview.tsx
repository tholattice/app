"use client";

import { useState, useEffect, memo } from "react";
import {
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import { useRealtimeStats } from "@/hooks/use-realtime";

interface DashboardStats {
  totalAppointments: number;
  totalCustomers: number;
  totalRevenue: number;
  upcomingAppointments: number;
}

interface DashboardOverviewProps {
  initialStats: DashboardStats;
}

const DashboardOverview = memo(function DashboardOverview({ initialStats }: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Real-time connection
  const { isConnected, error: realtimeError } = useRealtimeStats();

  useEffect(() => {
    // Only fetch if we don't have initial data
    if (initialStats.totalAppointments === 0 && initialStats.totalCustomers === 0) {
      const fetchStats = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch('/api/dashboard/stats');
          
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard statistics');
          }
          
          const data = await response.json();
          setStats(data);
          setLastUpdated(new Date());
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
          setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }

    // Set up polling as fallback for real-time updates (only if we have initial data)
    if (initialStats.totalAppointments > 0 || initialStats.totalCustomers > 0) {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch('/api/dashboard/stats');
          if (response.ok) {
            const data = await response.json();
            setStats(data);
            setLastUpdated(new Date());
          }
        } catch (error) {
          console.error("Error polling dashboard stats:", error);
        }
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(pollInterval);
    }
  }, [initialStats]);

  const statCards = [
    {
      name: "Total Appointments",
      value: stats.totalAppointments,
      icon: CalendarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      name: "Total Customers",
      value: stats.totalCustomers,
      icon: UsersIcon,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      name: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      name: "Upcoming Appointments",
      value: stats.upcomingAppointments,
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            Error Loading Data
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Business Overview
        </h2>
        <div className="flex items-center space-x-2">
          {/* Real-time status indicator */}
          <div className="flex items-center space-x-1">
            <WifiIcon className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          
          {/* Last updated timestamp */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time error display */}
      {realtimeError && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <WifiIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Real-time connection issue: {realtimeError}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default DashboardOverview;

