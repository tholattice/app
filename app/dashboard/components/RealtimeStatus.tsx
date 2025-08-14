"use client";

import { useState, useEffect } from "react";
import { WifiIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRealtime } from "@/hooks/use-realtime";

interface SystemStatus {
  database: boolean;
  api: boolean;
  realtime: boolean;
  lastCheck: Date;
}

export default function RealtimeStatus() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: true,
    api: true,
    realtime: false,
    lastCheck: new Date()
  });

  const { isConnected, error: realtimeError } = useRealtime();

  useEffect(() => {
    const checkSystemHealth = async () => {
      const newStatus = {
        database: true,
        api: true,
        realtime: isConnected,
        lastCheck: new Date()
      };
      
      // Check database connection - requires authentication
      try {
        const dbResponse = await fetch('/api/health');
        newStatus.database = dbResponse.ok;
      } catch (error) {
        newStatus.database = false;
      }

      // Check API health - requires authentication
      try {
        const apiResponse = await fetch('/api/health');
        newStatus.api = apiResponse.ok;
      } catch (error) {
        newStatus.api = false;
      }

      setSystemStatus(newStatus);
    };

    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // Check every 60 seconds instead of 30

    return () => clearInterval(interval);
  }, [isConnected]);

  const getOverallStatus = () => {
    if (systemStatus.database && systemStatus.api && systemStatus.realtime) {
      return { status: 'healthy', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' };
    } else if (systemStatus.database && systemStatus.api) {
      return { status: 'degraded', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' };
    } else {
      return { status: 'down', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className={`p-3 rounded-lg border ${overallStatus.bgColor} border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WifiIcon className={`w-4 h-4 ${overallStatus.color}`} />
          <span className={`text-sm font-medium ${overallStatus.color}`}>
            System Status: {overallStatus.status.charAt(0).toUpperCase() + overallStatus.status.slice(1)}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Last check: {systemStatus.lastCheck.toLocaleTimeString()}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <div className="flex items-center space-x-1">
          {systemStatus.database ? (
            <CheckCircleIcon className="w-3 h-3 text-green-500" />
          ) : (
            <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
          )}
          <span className="text-xs text-gray-600 dark:text-gray-300">Database</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {systemStatus.api ? (
            <CheckCircleIcon className="w-3 h-3 text-green-500" />
          ) : (
            <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
          )}
          <span className="text-xs text-gray-600 dark:text-gray-300">API</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {systemStatus.realtime ? (
            <CheckCircleIcon className="w-3 h-3 text-green-500" />
          ) : (
            <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
          )}
          <span className="text-xs text-gray-600 dark:text-gray-300">Real-time</span>
        </div>
      </div>

      {realtimeError && (
        <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
          <div className="flex items-center space-x-1">
            <ExclamationTriangleIcon className="w-3 h-3" />
            <span>Real-time connection issue: {realtimeError}</span>
          </div>
        </div>
      )}
    </div>
  );
}
