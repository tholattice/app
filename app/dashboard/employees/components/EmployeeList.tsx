"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "sonner";
import { REALTIME_EVENTS } from "@/lib/realtime";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";

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
    day: number;
    startTime: Date;
    endTime: Date;
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
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats>({ total: 0, active: 0, totalAppointments: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; employee: Employee | null }>({
    isOpen: false,
    employee: null
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; employee: Employee | null }>({
    isOpen: false,
    employee: null
  });

  // Real-time connection and employee updates
  const { isConnected, error: realtimeError, lastEvent } = useRealtimeEmployees();

  const fetchEmployees = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
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
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Handle real-time employee updates
  useEffect(() => {
    if (lastEvent && (
      lastEvent.type === REALTIME_EVENTS.EMPLOYEE_CREATED ||
      lastEvent.type === REALTIME_EVENTS.EMPLOYEE_UPDATED ||
      lastEvent.type === REALTIME_EVENTS.EMPLOYEE_DELETED ||
      lastEvent.type === REALTIME_EVENTS.STATS_UPDATED ||
      lastEvent.type === REALTIME_EVENTS.EMPLOYEE_SCHEDULE_UPDATE
    )) {
      // Refresh data immediately when we receive a real-time update
      fetchEmployees();
    }
  }, [lastEvent, isConnected, fetchEmployees]);

  useEffect(() => {
    fetchEmployees();

    // Set up polling as fallback for real-time updates (less frequent since we have real-time)
    const pollInterval = setInterval(fetchEmployees, 60000); // Poll every 60 seconds as backup

    return () => clearInterval(pollInterval);
  }, [fetchEmployees]);

  // Force refresh when component mounts (useful when returning from employee creation)
  useEffect(() => {
    const handleFocus = () => {
      fetchEmployees();
    };

    window.addEventListener('focus', handleFocus);
    
    // Also refresh on mount
    handleFocus();

    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchEmployees]);

  // Handle refresh parameter from URL
  useEffect(() => {
    const refreshParam = searchParams.get('refresh');
    if (refreshParam === 'true') {
      fetchEmployees();
      // Remove the refresh parameter from URL
      router.replace('/dashboard/employees');
    }
  }, [searchParams, fetchEmployees, router]);

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

  const handleDeleteEmployee = (employee: Employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, employee: null });
  };

  const handleDeleteSuccess = () => {
    fetchEmployees();
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditModal({ isOpen: true, employee });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, employee: null });
  };

  const handleEditSuccess = () => {
    // Immediate refresh to show updated data
    fetchEmployees(true);
    
    // Also trigger a refresh after a short delay to ensure all data is updated
    setTimeout(() => {
      fetchEmployees(true);
    }, 500);
    
    // One more refresh after 1 second to ensure all updates are reflected
    setTimeout(() => {
      fetchEmployees(true);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4 min-w-0">
          <h2 className="text-lg sm:text-xl text-gray-900 dark:text-white whitespace-nowrap">Employees</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          <button
            onClick={() => fetchEmployees(true)}
            disabled={refreshing}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <div className="flex justify-center sm:justify-start space-x-2">
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
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Active</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats?.active || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Appointments</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <CogIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400" />
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">${(stats?.totalRevenue || 0).toLocaleString()}</p>
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
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 gap-4"
            >
              <div className="flex items-start space-x-4 flex-1 min-w-0">
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {employee.name}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)} self-start sm:self-auto`}
                    >
                      {employee.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <EnvelopeIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                      {employee.appointmentCount} appointments
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <CogIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                      {employee.services.length} services
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400 font-medium">${(employee.totalRevenue || 0).toLocaleString()}</span>
                      <span className="ml-1">total revenue</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">${(employee.thisMonthRevenue || 0).toLocaleString()}</span>
                      <span className="ml-1">this month</span>
                    </div>
                    {employee.lastAppointment && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 sm:col-span-2 lg:col-span-1">
                        <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        Last: {new Date(employee.lastAppointment).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end space-x-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title="Edit Employee"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
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
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white truncate">{selectedEmployee.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 truncate">{selectedEmployee.email}</p>
                  <p className="text-gray-600 dark:text-gray-300 truncate">WeChat: {selectedEmployee.wechatUsername}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              
              {selectedEmployee.workingHours && selectedEmployee.workingHours.length > 0 ? (
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Working Hours</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedEmployee.workingHours.map((hours, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                        {getDayName(hours.day)}: {new Date(hours.startTime).toLocaleTimeString()} - {new Date(hours.endTime).toLocaleTimeString()}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Working Hours</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No working hours scheduled</p>
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

      {/* Delete Employee Modal */}
      {deleteModal.employee && (
        <DeleteEmployeeModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteSuccess}
          employeeName={deleteModal.employee.name}
          employeeId={deleteModal.employee.id}
        />
      )}

      {/* Edit Employee Modal */}
      {editModal.employee && (
        <EditEmployeeModal
          isOpen={editModal.isOpen}
          onClose={closeEditModal}
          onSave={handleEditSuccess}
          employee={editModal.employee}
        />
      )}
    </div>
  );
}
