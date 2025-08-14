"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  WifiIcon
} from "@heroicons/react/24/outline";
import { useRealtimeEmployees } from "@/hooks/use-realtime";
import Image from "next/image";

interface Employee {
  id: string;
  name: string;
  email: string;
  image?: string;
  status: string;
  totalRevenue: number;
  thisMonthRevenue: number;
  lastAppointment?: Date;
  appointmentCount: number;
  services: string[];
  workingHours: {
    dayOfWeek: number;
    openTime: Date;
    closeTime: Date;
  }[];
  wechatUsername: string;
}

interface EmployeeStats {
  total: number;
  active: number;
  totalAppointments: number;
  totalRevenue: number;
}

export default function EmployeeList() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats>({ total: 0, active: 0, totalAppointments: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Real-time connection
  const { isConnected, error: realtimeError } = useRealtimeEmployees();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/dashboard/employees');
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        
        const data = await response.json();
        setEmployees(data.employees);
        setStats(data.stats);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();

    // Set up polling as fallback for real-time updates
    const pollInterval = setInterval(fetchEmployees, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "inactive":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  };

  const filteredEmployees = employees.filter(employee => {
    if (filter === "all") return true;
    return employee.status.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
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
            Error Loading Employees
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
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employees</h2>
          
          {/* Real-time status indicator */}
          <div className="flex items-center space-x-1">
            <WifiIcon className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <div className="flex space-x-2">
            {["all", "active", "inactive"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => router.push('/dashboard/employees/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats?.active || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Appointments</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            <CogIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">${(stats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-8">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create some test data to see employees here.
            </p>
          </div>
        ) : (
          filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {employee.image ? (
                    <Image 
                      src={employee.image} 
                      alt={employee.name} 
                      className="w-12 h-12 rounded-full"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full ${getAvatarColor(employee.name)} flex items-center justify-center`}>
                      <span className="text-white font-medium">{getInitials(employee.name)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {employee.name}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}
                    >
                      {employee.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <EnvelopeIcon className="w-3 h-3 mr-1" />
                      {employee.email}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {employee.appointmentCount} appointments
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <CogIcon className="w-3 h-3 mr-1" />
                      {employee.services.length} services
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400 font-medium">${(employee.totalRevenue || 0).toLocaleString()}</span>
                      <span className="ml-1">total revenue</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">${(employee.thisMonthRevenue || 0).toLocaleString()}</span>
                      <span className="ml-1">this month</span>
                    </div>
                    {employee.lastAppointment && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Last: {new Date(employee.lastAppointment).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Edit employee: ${employee.name}`)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title="Edit Employee"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
                      alert(`Employee ${employee.name} deleted`);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete Employee"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Details</h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedEmployee.image ? (
                  <Image 
                    src={selectedEmployee.image} 
                    alt={selectedEmployee.name} 
                    className="w-16 h-16 rounded-full"
                    width={64}
                    height={64}
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full ${getAvatarColor(selectedEmployee.name)} flex items-center justify-center`}>
                    <span className="text-white font-medium text-lg">{getInitials(selectedEmployee.name)}</span>
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white">{selectedEmployee.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedEmployee.email}</p>
                  <p className="text-gray-600 dark:text-gray-300">WeChat: {selectedEmployee.wechatUsername}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Performance</h5>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Total Revenue:</span> ${selectedEmployee.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">This Month:</span> ${selectedEmployee.thisMonthRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Appointments:</span> {selectedEmployee.appointmentCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Status:</span> {selectedEmployee.status}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Services Offered</h5>
                  <div className="space-y-1">
                    {selectedEmployee.services.map((service, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedEmployee.workingHours.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Working Hours</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEmployee.workingHours.map((hours, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                        {getDayName(hours.dayOfWeek)}: {new Date(hours.openTime).toLocaleTimeString()} - {new Date(hours.closeTime).toLocaleTimeString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
}
