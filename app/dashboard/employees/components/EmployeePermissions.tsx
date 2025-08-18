"use client";

import { useState } from "react";
import { 
  ShieldCheckIcon, 
  UserIcon, 
  CalendarIcon, 
  CogIcon,
  ChartBarIcon,
  BellIcon,
  ClockIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "management" | "customer" | "appointment" | "personal" | "analytics";
  icon: any;
}

export default function EmployeePermissions() {
  const [selectedRole, setSelectedRole] = useState<"owner" | "admin" | "masseuse" | "client">("masseuse");

  const permissions: Permission[] = [
    // Management Permissions
    {
      id: "view_all_bookings",
      name: "View All Bookings",
      description: "See all appointments across the business",
      category: "management",
      icon: CalendarIcon,
    },
    {
      id: "manage_employees",
      name: "Manage Employees",
      description: "Add, edit, and remove employees",
      category: "management",
      icon: UserIcon,
    },
    {
      id: "manage_customers",
      name: "Manage Customers",
      description: "Create and edit customer profiles",
      category: "management",
      icon: UserIcon,
    },
    {
      id: "view_analytics",
      name: "View Analytics",
      description: "Access business performance data",
      category: "analytics",
      icon: ChartBarIcon,
    },
    {
      id: "manage_business_settings",
      name: "Manage Business Settings",
      description: "Configure business hours, services, and locations",
      category: "management",
      icon: CogIcon,
    },
    
    // Customer Permissions
    {
      id: "view_customer_profiles",
      name: "View Customer Profiles",
      description: "Access customer information and history",
      category: "customer",
      icon: UserIcon,
    },
    
    // Appointment Permissions
    {
      id: "update_appointment_status",
      name: "Update Appointment Status",
      description: "Mark appointments as started, completed, or cancelled",
      category: "appointment",
      icon: CalendarIcon,
    },
    {
      id: "add_appointment_notes",
      name: "Add Appointment Notes",
      description: "Add notes and comments to appointments",
      category: "appointment",
      icon: CalendarIcon,
    },
    
    // Personal Permissions
    {
      id: "view_own_schedule",
      name: "View Own Schedule",
      description: "See personal appointment schedule",
      category: "personal",
      icon: ClockIcon,
    },
    {
      id: "view_own_earnings",
      name: "View Own Earnings",
      description: "Access personal earnings and commission data",
      category: "personal",
      icon: CurrencyDollarIcon,
    },
    {
      id: "request_time_off",
      name: "Request Time Off",
      description: "Submit time off requests",
      category: "personal",
      icon: CalendarIcon,
    },
    {
      id: "update_availability",
      name: "Update Availability",
      description: "Modify personal working hours and availability",
      category: "personal",
      icon: ClockIcon,
    },
  ];

  const rolePermissions: Record<string, string[]> = {
    owner: permissions.map(p => p.id),
    admin: [
      "view_all_bookings",
      "manage_employees", 
      "manage_customers",
      "view_analytics",
      "view_customer_profiles",
      "update_appointment_status",
      "add_appointment_notes",
      "view_own_schedule",
      "view_own_earnings",
      "request_time_off",
      "update_availability"
    ],
    masseuse: [
      "view_customer_profiles",
      "update_appointment_status",
      "add_appointment_notes",
      "view_own_schedule",
      "view_own_earnings",
      "request_time_off",
      "update_availability"
    ],
    client: []
  };

  const getCategoryColor = (category: Permission["category"]) => {
    switch (category) {
      case "management":
        return "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
      case "customer":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "appointment":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "personal":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
      case "analytics":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-700";
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl text-gray-900 dark:text-white mb-6">Permission Management</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Role Template
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="masseuse">Masseuse</option>
          <option value="client">Client</option>
        </select>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([category, perms]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
              {category} Permissions
            </h3>
            <div className="space-y-2">
              {perms.map((permission) => {
                const isEnabled = rolePermissions[selectedRole].includes(permission.id);
                return (
                  <div
                    key={permission.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      isEnabled 
                        ? "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20" 
                        : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(permission.category)}`}>
                        <permission.icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {permission.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                isEnabled
                                  ? "text-green-600 bg-green-100 dark:bg-green-900/20"
                                  : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600"
                              }`}
                            >
                              {isEnabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Permission Guidelines</h3>
        <div className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
          <p>• <strong>Owner:</strong> Full access to all features and settings</p>
          <p>• <strong>Admin:</strong> Can manage employees, customers, and view analytics</p>
          <p>• <strong>Masseuse:</strong> Can manage their appointments and view customer info</p>
          <p>• <strong>Client:</strong> Limited access to their own bookings</p>
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Save Permission Changes
        </button>
      </div>
    </div>
  );
}
