"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

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

interface ScheduleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    employeeId: string;
    locationId: string;
    dayOfWeek: number;
    oldStartTime?: string;
    oldEndTime?: string;
    newStartTime: string;
    newEndTime: string;
    changeType: string;
    reason: string;
  }) => Promise<boolean>;
  employees: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string }>;
  loading?: boolean;
  editingSchedule?: Schedule | null;
}

export default function ScheduleChangeModal({
  isOpen,
  onClose,
  onSubmit,
  employees,
  locations,
  loading = false,
  editingSchedule = null
}: ScheduleChangeModalProps) {
  const isEditMode = !!editingSchedule;
  
  const [formData, setFormData] = useState({
    employeeId: editingSchedule?.employeeId || "",
    locationId: editingSchedule ? locations.find(loc => loc.name === editingSchedule.location)?.id || "" : "",
    dayOfWeek: editingSchedule?.dayOfWeekNumber || 1,
    oldStartTime: editingSchedule?.startTime || "",
    oldEndTime: editingSchedule?.endTime || "",
    newStartTime: editingSchedule?.startTime || "",
    newEndTime: editingSchedule?.endTime || "",
    changeType: "MODIFY",
    reason: ""
  });

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Update form data when editingSchedule changes
  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        employeeId: editingSchedule.employeeId,
        locationId: locations.find(loc => loc.name === editingSchedule.location)?.id || "",
        dayOfWeek: editingSchedule.dayOfWeekNumber,
        oldStartTime: editingSchedule.startTime,
        oldEndTime: editingSchedule.endTime,
        newStartTime: editingSchedule.startTime,
        newEndTime: editingSchedule.endTime,
        changeType: "MODIFY",
        reason: ""
      });
    }
  }, [editingSchedule, locations]);

  const daysOfWeek = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" }
  ];

  const changeTypes = isEditMode 
    ? [
        { value: "MODIFY", label: "Modify Schedule" },
        { value: "REMOVE", label: "Remove Schedule" }
      ]
    : [
        { value: "ADD", label: "Add Schedule" },
        { value: "MODIFY", label: "Modify Schedule" },
        { value: "REMOVE", label: "Remove Schedule" }
      ];

  // Function to check for schedule conflicts
  const checkForConflicts = () => {
    if (formData.changeType === "ADD" || formData.changeType === "MODIFY") {
      if (formData.newStartTime && formData.newEndTime) {
        const startTime = new Date(`2000-01-01T${formData.newStartTime}`);
        const endTime = new Date(`2000-01-01T${formData.newEndTime}`);
        
        // Basic validation - check if start time is before end time
        if (startTime >= endTime) {
          setConflictWarning("Start time must be before end time");
          return true;
        }
        
        // Check if the time range is reasonable (not more than 24 hours)
        const hoursDiff = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 24) {
          setConflictWarning("Schedule cannot exceed 24 hours");
          return true;
        }
        
        setConflictWarning(null);
        return false;
      }
    }
    setConflictWarning(null);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for conflicts before submitting
    if (checkForConflicts()) {
      return;
    }
    if (!formData.employeeId || !formData.locationId || !formData.newStartTime || !formData.newEndTime) {
      return;
    }

    try {
      const success = await onSubmit(formData);
      if (success) {
        setFormData({
          employeeId: "",
          locationId: "",
          dayOfWeek: 1,
          oldStartTime: "",
          oldEndTime: "",
          newStartTime: "",
          newEndTime: "",
          changeType: "MODIFY",
          reason: ""
        });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting schedule change:', error);
    }
  };

  const handleTimeChange = (field: 'newStartTime' | 'newEndTime', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Check for conflicts after a short delay
    setTimeout(() => checkForConflicts(), 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Schedule' : 'Schedule Change Request'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {conflictWarning && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">
                ⚠️ {conflictWarning}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white ${
                isEditMode 
                  ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-700'
              }`}
              required
              disabled={isEditMode}
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                value={formData.locationId}
                onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
                className={`w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white ${
                  isEditMode 
                    ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-white dark:bg-gray-700'
                }`}
                required
                disabled={isEditMode}
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Day of Week
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white ${
                isEditMode 
                  ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-700'
              }`}
              required
              disabled={isEditMode}
            >
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Change Type
            </label>
            <select
              value={formData.changeType}
              onChange={(e) => setFormData(prev => ({ ...prev, changeType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              {changeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {formData.changeType === "MODIFY" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Start Time
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    value={formData.oldStartTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, oldStartTime: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white ${
                      isEditMode 
                        ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-700'
                    }`}
                    disabled={isEditMode}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current End Time
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    value={formData.oldEndTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, oldEndTime: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white ${
                      isEditMode 
                        ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-700'
                    }`}
                    disabled={isEditMode}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Start Time
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.newStartTime}
                  onChange={(e) => handleTimeChange('newStartTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New End Time
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.newEndTime}
                  onChange={(e) => handleTimeChange('newEndTime', e.target.value)}
                  min={formData.newStartTime}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter reason for schedule change..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.employeeId || !formData.locationId || !formData.newStartTime || !formData.newEndTime}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
