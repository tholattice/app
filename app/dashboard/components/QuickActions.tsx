"use client";

import { useState } from "react";
import { 
  PlusIcon, 
  CalendarIcon, 
  UserPlusIcon, 
  ChartBarIcon,
  WifiIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import RealtimeStatus from "./RealtimeStatus";

export default function QuickActions() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Trigger a page refresh or data refetch
    window.location.reload();
  };

  const actions = [
    {
      name: "New Appointment",
      description: "Schedule a new appointment",
      icon: CalendarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      onClick: () => router.push("/dashboard/appointments/new")
    },
    {
      name: "Add Customer",
      description: "Create a new customer profile",
      icon: UserPlusIcon,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      onClick: () => router.push("/dashboard/customers/new")
    },
    {
      name: "Add Employee",
      description: "Add a new employee",
      icon: PlusIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      onClick: () => router.push("/dashboard/employees/new")
    },
    {
      name: "View Analytics",
      description: "Check business analytics",
      icon: ChartBarIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      onClick: () => router.push("/dashboard/analytics")
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Status */}
      <RealtimeStatus />

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-900 dark:text-white">Quick Actions</h3>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={action.onClick}
              className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Connection Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connection Info</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Real-time Updates</span>
            <div className="flex items-center space-x-1">
              <WifiIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Last Update</span>
            <span className="text-sm text-gray-900 dark:text-white">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Auto-refresh</span>
            <span className="text-sm text-gray-900 dark:text-white">Every 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
