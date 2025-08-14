"use client";

import { useState, useEffect } from "react";
import { 
  ClockIcon, 
  CalendarIcon, 
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  location: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "denied";
}

export default function EmployeeSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  useEffect(() => {
    // Note: Real schedule data should be fetched from API
    const fetchScheduleData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockSchedules: Schedule[] = [
          {
            id: "1",
            employeeId: "1",
            employeeName: "Sarah Johnson",
            location: "Main Location",
            dayOfWeek: "Monday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            id: "2",
            employeeId: "1",
            employeeName: "Sarah Johnson",
            location: "Main Location",
            dayOfWeek: "Tuesday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            id: "3",
            employeeId: "2",
            employeeName: "Mike Chen",
            location: "Main Location",
            dayOfWeek: "Monday",
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            id: "4",
            employeeId: "2",
            employeeName: "Mike Chen",
            location: "Main Location",
            dayOfWeek: "Tuesday",
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            id: "5",
            employeeId: "3",
            employeeName: "Lisa Wang",
            location: "Main Location",
            dayOfWeek: "Monday",
            startTime: "11:00",
            endTime: "19:00",
            isAvailable: false,
          },
        ];

        const mockTimeOffRequests: TimeOffRequest[] = [
          {
            id: "1",
            employeeId: "3",
            employeeName: "Lisa Wang",
            startDate: "2024-01-15",
            endDate: "2024-01-19",
            reason: "Vacation",
            status: "approved",
          },
          {
            id: "2",
            employeeId: "1",
            employeeName: "Sarah Johnson",
            startDate: "2024-01-22",
            endDate: "2024-01-22",
            reason: "Doctor appointment",
            status: "pending",
          },
        ];

        setSchedules(mockSchedules);
        setTimeOffRequests(mockTimeOffRequests);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: TimeOffRequest["status"]) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "denied":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700";
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (selectedLocation === "all") return true;
    return schedule.location === selectedLocation;
  });

  const locations = Array.from(new Set(schedules.map(s => s.location)));

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employee Schedules</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Weekly Schedule View */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {schedule.employeeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {schedule.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {schedule.dayOfWeek}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => alert(`Edit schedule for ${schedule.employeeName}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Delete schedule for ${schedule.employeeName}?`)) {
                            alert(`Schedule deleted for ${schedule.employeeName}`);
                          }
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Off Requests */}
      <div>
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
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{request.employeeName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{request.reason}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => alert(`Time off request approved for ${request.employeeName}`)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => alert(`Time off request denied for ${request.employeeName}`)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
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
    </div>
  );
}
