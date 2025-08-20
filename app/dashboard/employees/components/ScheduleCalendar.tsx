"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon as ChevronRightIconSolid
} from "@heroicons/react/24/outline";

interface ScheduleDate {
  id: string;
  date: string; // YYYY-MM-DD format
  startTime: string;
  endTime: string;
  locationId: string;
  locationName: string;
}

interface ScheduleCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedules: ScheduleDate[]) => void;
  employeeName: string;
  locations: Array<{ id: string; name: string }>;
  existingSchedules?: ScheduleDate[];
}

export default function ScheduleCalendar({
  isOpen,
  onClose,
  onSave,
  employeeName,
  locations,
  existingSchedules = []
}: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<ScheduleDate[]>(existingSchedules);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDates.some(schedule => schedule.date === dateStr);
  };

  const isDateHighlighted = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDate === dateStr;
  };

  const getSchedulesForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDates.filter(schedule => schedule.date === dateStr);
  };

  const checkForConflicts = (newSchedule: ScheduleDate): { hasConflict: boolean; message: string } => {
    const dateStr = newSchedule.date;
    const existingSchedules = selectedDates.filter(s => s.date === dateStr);
    
    for (const existing of existingSchedules) {
      // Check for exact duplicates (same time, any location)
      if (existing.startTime === newSchedule.startTime && 
          existing.endTime === newSchedule.endTime) {
        return {
          hasConflict: true,
          message: `Duplicate schedule detected: ${newSchedule.startTime} - ${newSchedule.endTime} on ${new Date(dateStr).toLocaleDateString()}`
        };
      }
      
      // Check for overlapping schedules (any location)
      const newStart = new Date(`2000-01-01T${newSchedule.startTime}`);
      const newEnd = new Date(`2000-01-01T${newSchedule.endTime}`);
      const existingStart = new Date(`2000-01-01T${existing.startTime}`);
      const existingEnd = new Date(`2000-01-01T${existing.endTime}`);
      
      if (newStart < existingEnd && existingStart < newEnd) {
        return {
          hasConflict: true,
          message: `Schedule overlap detected: ${newSchedule.startTime} - ${newSchedule.endTime} overlaps with existing schedule ${existing.startTime} - ${existing.endTime} on ${new Date(dateStr).toLocaleDateString()}`
        };
      }
    }
    
    return { hasConflict: false, message: "" };
  };

  const groupSchedulesByLocation = () => {
    const groups: Record<string, ScheduleDate[]> = {};
    selectedDates.forEach(schedule => {
      if (!groups[schedule.locationName]) {
        groups[schedule.locationName] = [];
      }
      groups[schedule.locationName].push(schedule);
    });
    return groups;
  };

  const toggleLocationExpansion = (locationName: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(locationName)) {
      newExpanded.delete(locationName);
    } else {
      newExpanded.add(locationName);
    }
    setExpandedLocations(newExpanded);
  };

  const addScheduleForSelectedDate = () => {
    if (!selectedDate || !selectedLocation) {
      toast.error("Please select a date and location first");
      return;
    }
    
    // Create new schedule
    const newSchedule: ScheduleDate = {
      id: `schedule_${selectedDate}_${Date.now()}`,
      date: selectedDate,
      startTime,
      endTime,
      locationId: selectedLocation,
      locationName: locations.find(l => l.id === selectedLocation)?.name || ''
    };
    
    // Check for conflicts
    const conflict = checkForConflicts(newSchedule);
    if (conflict.hasConflict) {
      toast.error("Schedule Conflict", {
        description: conflict.message
      });
      return;
    }
    
    // Add the schedule if no conflicts
    setSelectedDates(prev => [...prev, newSchedule]);
    toast.success("Schedule Added", {
      description: `${newSchedule.locationName} on ${new Date(selectedDate).toLocaleDateString()} at ${startTime} - ${endTime}`
    });
    setSelectedDate(null); // Clear selected date after adding schedule
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
  };

  const removeSchedule = (scheduleId: string) => {
    setSelectedDates(prev => prev.filter(s => s.id !== scheduleId));
  };

  const updateSchedule = (scheduleId: string, updates: Partial<ScheduleDate>) => {
    setSelectedDates(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, ...updates } : s
    ));
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Schedule Calendar - {employeeName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Today
              </button>
            </div>

            {/* Location and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Add Schedule Button */}
            <div className="flex justify-center">
              <button
                onClick={addScheduleForSelectedDate}
                disabled={!selectedDate || !selectedLocation}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Schedule for Selected Date
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
              
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`p-2 min-h-[60px] border border-gray-200 dark:border-gray-600 ${
                    day 
                      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                       <div className={`text-sm font-medium ${
                        isDateSelected(day) 
                          ? 'text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center mx-auto'
                          : isDateHighlighted(day)
                          ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 rounded-full w-6 h-6 flex items-center justify-center mx-auto'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {isDateSelected(day) 
                          ? getSchedulesForDate(day).length 
                          : day.getDate()
                        }
                      </div>
                      {isDateSelected(day) && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {getSchedulesForDate(day).length} schedule{getSchedulesForDate(day).length !== 1 ? 's' : ''}
                        </div>
                      )}
                      {isDateHighlighted(day) && !isDateSelected(day) && (
                        <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          Selected
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Schedules */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Selected Schedules ({selectedDates.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedDates.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No schedules selected. Click on dates in the calendar to add schedules.
                </p>
              ) : (
                Object.entries(groupSchedulesByLocation()).map(([locationName, schedules]) => (
                  <div key={locationName} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => toggleLocationExpansion(locationName)}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {locationName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({schedules.length} schedule{schedules.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {expandedLocations.has(locationName) ? (
                          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRightIconSolid className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedLocations.has(locationName) && (
                      <div className="border-t border-gray-200 dark:border-gray-600">
                        {schedules
                          .sort((a, b) => a.date.localeCompare(b.date))
                          .map((schedule) => (
                            <div
                              key={schedule.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-900 dark:text-white">
                                  {new Date(schedule.date).toLocaleDateString()}
                                </span>
                                <ClockIcon className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSchedule(schedule.id);
                                }}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedDates)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Schedules
          </button>
        </div>
      </div>
    </div>
  );
}
