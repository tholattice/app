"use client";

import { useState, useEffect, memo } from "react";
import { 
  ClockIcon, 
  CalendarIcon, 
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
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

const EmployeeSchedule = memo(function EmployeeSchedule() {
  const { data, loading, error, createTimeOffRequest, createScheduleChange, approveRequest } = useEmployeeSchedules();
  const { isConnected } = useRealtime();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set());
  const [modalLoading, setModalLoading] = useState(false);

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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
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
          {/* <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div> */}
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

      {/* Weekly Schedule View */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Schedule</h3>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                  Day
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                  Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {schedule.employeeName}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{schedule.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{schedule.dayOfWeek}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        schedule.isAvailable
                          ? "text-green-600 bg-green-100 dark:bg-green-900/20"
                          : "text-red-600 bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {schedule.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium pr-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setShowScheduleModal(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No schedules</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No employee schedules found.
              </p>
            </div>
          ) : (
            filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {schedule.employeeName}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{schedule.location}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingSchedule(schedule);
                      setShowScheduleModal(true);
                    }}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex-shrink-0"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{schedule.dayOfWeek}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      schedule.isAvailable
                        ? "text-green-600 bg-green-100 dark:bg-green-900/20"
                        : "text-red-600 bg-red-100 dark:bg-red-900/20"
                    }`}
                  >
                    {schedule.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
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
