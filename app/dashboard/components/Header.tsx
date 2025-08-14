"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  BellIcon, 
  CogIcon, 
  UserCircleIcon,
  WifiIcon,
  ChevronDownIcon,
  UserIcon,
  KeyIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import DarkModeToggle from "./DarkModeToggle";
import RealtimeNotification from "./RealtimeNotification";
import ProfileImage from "./ProfileImage";

interface HeaderProps {
  children?: React.ReactNode;
  customers?: any[];
}

export default function Header({ children, customers }: HeaderProps) {
  const params = useParams();
  const [customerName, setCustomerName] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Simulate real-time connection status
    const checkConnection = () => {
      setIsConnected(Math.random() > 0.1); // 90% chance of being connected
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCustomerName = async () => {
      if (params.custID) {
        try {
          const response = await fetch(`/api/dashboard/customers/${params.custID}`);
          if (response.ok) {
            const data = await response.json();
            setCustomerName(data.name || "Customer");
          }
        } catch (error) {
          console.error("Error fetching customer:", error);
        }
      }
    };

    fetchCustomerName();
  }, [params.custID]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (showSettings) {
      setShowSettings(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Customer name if on customer page */}
          <div className="flex items-center">
            {params.custID && customerName && (
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {customerName}
                </span>
              </div>
            )}
          </div>

          {/* Center - Children content */}
          <div className="flex-1 flex justify-center">
            {children}
          </div>

          {/* Right side - Actions with proper alignment */}
          <div className="flex items-center space-x-3">
            {/* Real-time Connection Status */}
            <div className="flex items-center space-x-1">
              <WifiIcon className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* Real-time Notifications */}
            <RealtimeNotification />

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={handleSettingsClick}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CogIcon className="w-5 h-5" />
              </button>

              {/* Settings Dropdown Menu */}
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        // Navigate to profile settings
                        window.location.href = '/dashboard/settings';
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UserIcon className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        // Navigate to account settings
                        window.location.href = '/dashboard/settings/account';
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <KeyIcon className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        // Navigate to help/support
                        window.location.href = '/dashboard/help';
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <QuestionMarkCircleIcon className="w-4 h-4 mr-3" />
                      Help & Support
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Image - properly aligned */}
            <div className="flex items-center">
              <ProfileImage size="sm" />
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        />
      )}
    </header>
  );
}
