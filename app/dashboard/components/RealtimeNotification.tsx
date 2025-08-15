"use client";

import { useState, useEffect } from "react";
import { WifiIcon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRealtime } from "@/hooks/use-realtime";
import { REALTIME_EVENTS } from "@/lib/realtime";

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function RealtimeNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { isConnected, lastEvent, error: realtimeError } = useRealtime();

  // Load notifications from localStorage on component mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('dashboard-notifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        // Validate the parsed data structure
        if (Array.isArray(parsed) && parsed.every(n => 
          typeof n === 'object' && 
          typeof n.id === 'string' && 
          typeof n.type === 'string' && 
          typeof n.message === 'string' &&
          typeof n.read === 'boolean'
        )) {
          // Convert timestamp strings back to Date objects
          const notificationsWithDates = parsed.map(n => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
          setNotifications(notificationsWithDates);
          setUnreadCount(notificationsWithDates.filter((n: Notification) => !n.read).length);
        }
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      // Only save if notifications array is valid
      if (Array.isArray(notifications)) {
        localStorage.setItem('dashboard-notifications', JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  useEffect(() => {
    if (lastEvent) {
      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        type: lastEvent.type,
        message: getNotificationMessage(lastEvent),
        timestamp: new Date(lastEvent.timestamp),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
      setUnreadCount(prev => prev + 1);
    }
  }, [lastEvent]);

  const getNotificationMessage = (event: any) => {
    switch (event.type) {
      case REALTIME_EVENTS.APPOINTMENT_CREATED:
        return `New appointment created: ${event.data.customerName || 'Customer'} - ${event.data.service || 'Service'}`;
      case REALTIME_EVENTS.APPOINTMENT_UPDATED:
        return `Appointment updated: ${event.data.customerName || 'Customer'} - ${event.data.service || 'Service'}`;
      case REALTIME_EVENTS.APPOINTMENT_CANCELLED:
        return `Appointment cancelled: ${event.data.customerName || 'Customer'} - ${event.data.service || 'Service'}`;
      case REALTIME_EVENTS.CUSTOMER_CREATED:
        return `New customer added: ${event.data.name || 'Customer'}`;
      case REALTIME_EVENTS.CUSTOMER_UPDATED:
        return `Customer updated: ${event.data.name || 'Customer'}`;
      case REALTIME_EVENTS.EMPLOYEE_CREATED:
        return `New employee added: ${event.data.name || 'Employee'}`;
      case REALTIME_EVENTS.EMPLOYEE_UPDATED:
        return `Employee updated: ${event.data.name || 'Employee'}`;
      case REALTIME_EVENTS.REVENUE_UPDATED:
        return `Revenue updated: $${event.data.amount?.toLocaleString() || '0'}`;
      case REALTIME_EVENTS.STATS_UPDATED:
        return 'Business stats updated';
      // Employee Schedule Notifications
      case 'time_off_request_created':
        return `${event.data.employeeName || 'Employee'} requested time off from ${event.data.startDate} to ${event.data.endDate}`;
      case 'schedule_change_created':
        return `${event.data.employeeName || 'Employee'} requested a schedule change for ${event.data.dayOfWeek}`;
      case 'request_approved':
        return `Time off request for ${event.data.employeeName || 'Employee'} has been approved`;
      case 'request_denied':
        return `Time off request for ${event.data.employeeName || 'Employee'} has been denied`;
      case 'employee_schedule_update':
        return 'Employee schedule has been updated';
      default:
        return 'New update received';
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== id);
      const newUnreadCount = filtered.filter(n => !n.read).length;
      setUnreadCount(newUnreadCount);
      return filtered;
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case REALTIME_EVENTS.APPOINTMENT_CREATED:
      case REALTIME_EVENTS.APPOINTMENT_UPDATED:
      case REALTIME_EVENTS.APPOINTMENT_CANCELLED:
        return "📅";
      case REALTIME_EVENTS.CUSTOMER_CREATED:
      case REALTIME_EVENTS.CUSTOMER_UPDATED:
        return "👤";
      case REALTIME_EVENTS.EMPLOYEE_CREATED:
      case REALTIME_EVENTS.EMPLOYEE_UPDATED:
        return "👨‍💼";
      case REALTIME_EVENTS.REVENUE_UPDATED:
        return "💰";
      case REALTIME_EVENTS.STATS_UPDATED:
        return "📊";
      // Employee Schedule Icons
      case 'time_off_request_created':
      case 'request_approved':
      case 'request_denied':
        return "📋";
      case 'schedule_change_created':
      case 'employee_schedule_update':
        return "⏰";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case REALTIME_EVENTS.APPOINTMENT_CREATED:
      case REALTIME_EVENTS.CUSTOMER_CREATED:
      case REALTIME_EVENTS.EMPLOYEE_CREATED:
        return "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800";
      case REALTIME_EVENTS.APPOINTMENT_CANCELLED:
        return "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800";
      case REALTIME_EVENTS.REVENUE_UPDATED:
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800";
      // Employee Schedule Colors
      case 'time_off_request_created':
      case 'schedule_change_created':
        return "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800";
      case 'request_approved':
        return "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800";
      case 'request_denied':
        return "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800";
      case 'employee_schedule_update':
        return "border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800";
      default:
        return "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        
        {/* Connection Status Indicator */}
        <div className="absolute -top-1 -right-1">
          <WifiIcon className={`w-3 h-3 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Live' : 'Offline'}
                </span>
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <BellIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 mb-2 rounded-lg border ${getNotificationColor(notification.type)} transition-all duration-200 ${
                      !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.timestamp instanceof Date 
                              ? notification.timestamp.toLocaleTimeString()
                              : new Date(notification.timestamp).toLocaleTimeString()
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Error Display */}
          {realtimeError && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center space-x-2">
                <WifiIcon className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  Connection issue: {realtimeError}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
