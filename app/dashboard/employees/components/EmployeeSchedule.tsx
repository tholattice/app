"use client";

import { useState, useEffect, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ClockIcon, 
  CalendarIcon, 
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { useEmployeeSchedules } from "@/hooks/use-employee-schedules";
import { useRealtime } from "@/hooks/use-realtime";
import TimeOffRequestModal from "./TimeOffRequestModal";
import ScheduleChangeModal from "./ScheduleChangeModal";

interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  location: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  dayOfWeekNumber: number;
  date?: string; // YYYY-MM-DD format for date-based schedules
  scheduleType?: 'weekly' | 'date'; // Type of schedule
}

interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

interface ScheduleChange {
  id: string;
  employeeId: string;
  employeeName: string;
  location: string;
  dayOfWeek: string;
  dayOfWeekNumber: number;
  changeType: string;
  oldStartTime?: string;
  oldEndTime?: string;
  newStartTime?: string;
  newEndTime?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

interface EmployeeScheduleSummary {
  employeeId: string;
  employeeName: string;
  totalDays: number;
  locations: string[];
  averageHoursPerDay: number;
  schedules: Schedule[];
  isExpanded: boolean;
}

const EmployeeSchedule = memo(function EmployeeSchedule() {
  const { data, loading, error, refetch, createTimeOffRequest, createScheduleChange, approveRequest } = useEmployeeSchedules();
  const { isConnected } = useRealtime();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set());
  const [modalLoading, setModalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

  const schedules = data?.schedules || [];
  const timeOffRequests = data?.timeOffRequests || [];
  const scheduleChanges = data?.scheduleChanges || [];

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: TimeOffRequest["status"] | ScheduleChange["status"]) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "denied":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "cancelled":
        return "text-gray-600 bg-gray-100 dark:bg-gray-700";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700";
    }
  };

  const handleApproveRequest = async (type: 'timeOffRequest' | 'scheduleChange', id: string, action: 'approve' | 'deny') => {
    setPendingActions(prev => new Set(prev).add(`${type}-${id}-${action}`));
    
    try {
      const success = await approveRequest(type, id, action);
      if (success) {
        // Show success notification
        // Request processed successfully
      }
    } finally {
      setPendingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${type}-${id}-${action}`);
        return newSet;
      });
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (selectedLocation === "all") return true;
    return schedule.location === selectedLocation;
  });

  const locationNames = Array.from(new Set(schedules.map(s => s.location)));

  // Group schedules by employee and create summaries
  const employeeSummaries: EmployeeScheduleSummary[] = Object.values(
    filteredSchedules.reduce((acc, schedule) => {
      if (!acc[schedule.employeeId]) {
        acc[schedule.employeeId] = {
          employeeId: schedule.employeeId,
          employeeName: schedule.employeeName,
          totalDays: 0,
          locations: [],
          averageHoursPerDay: 0,
          schedules: [],
          isExpanded: false
        };
      }
      
      acc[schedule.employeeId].schedules.push(schedule);
      acc[schedule.employeeId].totalDays++;
      
      if (!acc[schedule.employeeId].locations.includes(schedule.location)) {
        acc[schedule.employeeId].locations.push(schedule.location);
      }
      
      return acc;
    }, {} as Record<string, EmployeeScheduleSummary>)
  ).map(summary => {
    // Calculate average hours per day
    const totalHours = summary.schedules.reduce((total, schedule) => {
      const start = new Date(`2000-01-01T${schedule.startTime}`);
      const end = new Date(`2000-01-01T${schedule.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
    
    summary.averageHoursPerDay = summary.totalDays > 0 ? totalHours / summary.totalDays : 0;
    summary.isExpanded = expandedEmployees.has(summary.employeeId);
    
    return summary;
  });

  const toggleEmployeeExpansion = (employeeId: string) => {
    setExpandedEmployees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  // Function to detect schedule conflicts for an employee
  const detectScheduleConflicts = (schedules: Schedule[]) => {
    const conflicts: Array<{ day: string; schedules: Schedule[] }> = [];
    const dayGroups = schedules.reduce((acc, schedule) => {
      if (!acc[schedule.dayOfWeek]) {
        acc[schedule.dayOfWeek] = [];
      }
      acc[schedule.dayOfWeek].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);

    for (const [day, daySchedules] of Object.entries(dayGroups)) {
      if (daySchedules.length > 1) {
        // Check for overlapping schedules on the same day
        const overlappingSchedules = [];
        for (let i = 0; i < daySchedules.length; i++) {
          for (let j = i + 1; j < daySchedules.length; j++) {
            const schedule1 = daySchedules[i];
            const schedule2 = daySchedules[j];
            
            const start1 = new Date(`2000-01-01T${schedule1.startTime}`);
            const end1 = new Date(`2000-01-01T${schedule1.endTime}`);
            const start2 = new Date(`2000-01-01T${schedule2.startTime}`);
            const end2 = new Date(`2000-01-01T${schedule2.endTime}`);
            
            if (start1 < end2 && start2 < end1) {
              overlappingSchedules.push(schedule1, schedule2);
            }
          }
        }
        
        if (overlappingSchedules.length > 0) {
          conflicts.push({
            day,
            schedules: Array.from(new Set(overlappingSchedules))
          });
        }
      }
    }
    
    return conflicts;
  };

  // Extract unique employees and locations for modals
  const [employees, setEmployees] = useState<Array<{ id: string; name: string }>>([]);
  const [locationOptions, setLocationOptions] = useState<Array<{ id: string; name: string }>>([]);
  
  // Fetch employees and locations separately
  useEffect(() => {
    const fetchEmployeesAndLocations = async () => {
      try {
        const [employeesResponse, locationsResponse] = await Promise.all([
          fetch('/api/dashboard/employees'),
          fetch('/api/dashboard/locations')
        ]);
        
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          const employeeOptions = employeesData.employees?.map((emp: any) => ({
            id: emp.id,
            name: emp.name || 'Unknown'
          })) || [];
          setEmployees(employeeOptions);
        }
        
        if (locationsResponse.ok) {
          const locationsData = await locationsResponse.json();
          const locationOptions = locationsData.locations?.map((loc: any) => ({
            id: loc.id,
            name: loc.name
          })) || [];
          setLocationOptions(locationOptions);
        }
      } catch (error) {
        console.error('Error fetching employees and locations:', error);
      }
    };
    
    fetchEmployeesAndLocations();
  }, []);

  // Force refresh when component mounts or window gains focus
  useEffect(() => {
    const handleFocus = () => {
      // Refresh data when component is focused
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    
    // Also refresh on mount
    handleFocus();

    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  // Handle refresh parameter from URL
  useEffect(() => {
    const refreshParam = searchParams.get('refresh');
    if (refreshParam === 'true') {
      // Refresh parameter detected, fetching fresh data
      refetch();
    }
  }, [searchParams, refetch]);

  const handleTimeOffSubmit = async (data: {
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    setModalLoading(true);
    try {
      const success = await createTimeOffRequest({
        masseuseId: data.employeeId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason
      });
      return success;
    } finally {
      setModalLoading(false);
    }
  };

  const handleScheduleChangeSubmit = async (data: {
    employeeId: string;
    locationId: string;
    dayOfWeek: number;
    oldStartTime?: string;
    oldEndTime?: string;
    newStartTime: string;
    newEndTime: string;
    changeType: string;
    reason: string;
  }) => {
    setModalLoading(true);
    try {
      const success = await createScheduleChange({
        masseuseId: data.employeeId,
        locationId: data.locationId,
        dayOfWeek: data.dayOfWeek,
        oldStartTime: data.oldStartTime,
        oldEndTime: data.oldEndTime,
        newStartTime: data.newStartTime,
        newEndTime: data.newEndTime,
        changeType: data.changeType,
        reason: data.reason
      });
      return success;
    } finally {
      setModalLoading(false);
    }
  };

  if (loading || refreshing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          {refreshing && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">Refreshing schedules...</span>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error loading schedules</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      {/* Real-time Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4 min-w-0">
            <h2 className="text-lg sm:text-xl text-gray-900 dark:text-white whitespace-nowrap">Employee Schedules</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            <button
              onClick={async () => {
                setRefreshing(true);
                await refetch();
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 flex items-center space-x-1"
            >
              {refreshing && (
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Locations</option>
            {locationNames.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTimeOffModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors whitespace-nowrap text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Time Off Request</span>
              <span className="sm:hidden">Time Off</span>
            </button>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Schedule Change</span>
              <span className="sm:hidden">Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Employee Schedule Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Employee Schedule Overview</h3>
        
        {employeeSummaries.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No schedules</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No employee schedules found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {employeeSummaries.map((summary) => (
              <div
                key={summary.employeeId}
                className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
              >
                {/* Employee Summary Header */}
                <div 
                  className="bg-gray-50 dark:bg-gray-700 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => toggleEmployeeExpansion(summary.employeeId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                         detectScheduleConflicts(summary.schedules).length > 0 
                           ? 'bg-red-100 dark:bg-red-900/20' 
                           : 'bg-blue-100 dark:bg-blue-900/20'
                       }`}>
                         <UserIcon className={`w-5 h-5 ${
                           detectScheduleConflicts(summary.schedules).length > 0 
                             ? 'text-red-600' 
                             : 'text-blue-600'
                         }`} />
                       </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {summary.employeeName}
                          {detectScheduleConflicts(summary.schedules).length > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">
                              Schedule Conflicts
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                           <span className="flex items-center">
                             <CalendarIcon className="w-3 h-3 mr-1" />
                             {summary.totalDays} days/week
                           </span>
                           <span className="flex items-center">
                             <ClockIcon className="w-3 h-3 mr-1" />
                             {summary.averageHoursPerDay.toFixed(1)} hrs/day avg
                           </span>
                           <span className="flex items-center">
                             <MapPinIcon className="w-3 h-3 mr-1" />
                             {summary.locations.length} location{summary.locations.length !== 1 ? 's' : ''}
                           </span>
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // View detailed schedule
                          setEditingSchedule(summary.schedules[0]);
                          setShowScheduleModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="View Schedule Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {summary.isExpanded ? (
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Schedule Details */}
                {summary.isExpanded && (
                  <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                    <div className="p-4">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Schedule Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {summary.schedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {schedule.scheduleType === 'date' && schedule.date 
                                  ? new Date(schedule.date).toLocaleDateString()
                                  : schedule.dayOfWeek
                                }
                              </span>
                              <button
                                onClick={() => {
                                  setEditingSchedule(schedule);
                                  setShowScheduleModal(true);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                                title="Edit Schedule"
                              >
                                <PencilIcon className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                              <div className="flex items-center">
                                <MapPinIcon className="w-3 h-3 mr-1" />
                                {schedule.location}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                              </div>
                              {schedule.scheduleType === 'date' && (
                                <div className="flex items-center">
                                  <CalendarIcon className="w-3 h-3 mr-1" />
                                  <span className="text-blue-600 dark:text-blue-400">Date-specific</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Time Off Requests */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Time Off Requests</h3>
        <div className="space-y-4">
          {timeOffRequests.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No time off requests</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                All employees are currently available.
              </p>
            </div>
          ) : (
            timeOffRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg gap-4"
              >
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{request.employeeName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{request.reason}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)} self-start sm:self-auto`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  
                  {request.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleApproveRequest('timeOffRequest', request.id, 'approve')}
                        disabled={pendingActions.has(`timeOffRequest-${request.id}-approve`)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {pendingActions.has(`timeOffRequest-${request.id}-approve`) ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                        )}
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApproveRequest('timeOffRequest', request.id, 'deny')}
                        disabled={pendingActions.has(`timeOffRequest-${request.id}-deny`)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {pendingActions.has(`timeOffRequest-${request.id}-deny`) ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <XCircleIcon className="w-3 h-3 mr-1" />
                        )}
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Schedule Changes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Schedule Changes</h3>
        <div className="space-y-4">
          {scheduleChanges.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No schedule changes</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No pending schedule modifications.
              </p>
            </div>
          ) : (
            scheduleChanges.map((change) => (
              <div
                key={change.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg gap-4"
              >
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{change.employeeName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {change.location} - {change.dayOfWeek}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {change.changeType.charAt(0).toUpperCase() + change.changeType.slice(1)}: {
                        change.oldStartTime && change.oldEndTime 
                          ? `${formatTime(change.oldStartTime)} - ${formatTime(change.oldEndTime)}`
                          : 'No previous time'
                      } → {
                        change.newStartTime && change.newEndTime
                          ? `${formatTime(change.newStartTime)} - ${formatTime(change.newEndTime)}`
                          : 'No new time'
                      }
                    </p>
                    {change.reason && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Reason: {change.reason}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(change.status)} self-start sm:self-auto`}
                  >
                    {change.status.charAt(0).toUpperCase() + change.status.slice(1)}
                  </span>
                  
                  {change.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleApproveRequest('scheduleChange', change.id, 'approve')}
                        disabled={pendingActions.has(`scheduleChange-${change.id}-approve`)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {pendingActions.has(`scheduleChange-${change.id}-approve`) ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                        )}
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApproveRequest('scheduleChange', change.id, 'deny')}
                        disabled={pendingActions.has(`scheduleChange-${change.id}-deny`)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {pendingActions.has(`scheduleChange-${change.id}-deny`) ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <XCircleIcon className="w-3 h-3 mr-1" />
                        )}
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <TimeOffRequestModal
        isOpen={showTimeOffModal}
        onClose={() => setShowTimeOffModal(false)}
        onSubmit={handleTimeOffSubmit}
        employees={employees}
        loading={modalLoading}
      />
      
      <ScheduleChangeModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setEditingSchedule(null);
        }}
        onSubmit={handleScheduleChangeSubmit}
        employees={employees}
        locations={locationOptions}
        loading={modalLoading}
        editingSchedule={editingSchedule}
      />
    </div>
  );
});

export default EmployeeSchedule;
