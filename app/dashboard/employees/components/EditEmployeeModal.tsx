"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Save, Calendar, MapPin } from "lucide-react";
import ScheduleCalendar from "./ScheduleCalendar";
import CreateLocationModal from "./CreateLocationModal";

interface Location {
  id: string;
  name: string;
}

interface ScheduleDate {
  id: string;
  date: string; // YYYY-MM-DD format
  startTime: string;
  endTime: string;
  locationId: string;
  locationName: string;
}

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
  phone?: string;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  employee: Employee | null;
}

export default function EditEmployeeModal({ 
  isOpen, 
  onClose, 
  onSave, 
  employee 
}: EditEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wechatUsername: "",
    phone: "",
    status: "active",
    services: [] as string[],
    selectedLocations: [] as string[],
    scheduleDates: [] as ScheduleDate[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const availableServices = [
    "Body Massage",
    "Foot Massage", 
    "Deep Tissue",
    "Swedish Massage",
    "Hot Stone",
    "Aromatherapy",
    "Cupping",
    "Reflexology"
  ];

  // Initialize form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        wechatUsername: employee.wechatUsername,
        phone: employee.phone || "",
        status: employee.status,
        services: employee.services,
        selectedLocations: [],
        scheduleDates: []
      });
      
      // Reset saved state
      setIsSaved(false);
      
      // Fetch existing schedules for this employee
      fetchEmployeeSchedules(employee.id);
    }
  }, [employee]);

  // Fetch existing schedules for the employee
  const fetchEmployeeSchedules = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/dashboard/employee-schedules?masseuseId=${employeeId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Convert the schedules to the format expected by the form
        const convertedSchedules: ScheduleDate[] = data.schedules
          .filter((schedule: any) => schedule.scheduleType === 'date')
          .map((schedule: any) => ({
            id: schedule.id,
            date: schedule.date, // Already in YYYY-MM-DD format
            startTime: schedule.startTime, // Already in HH:MM format
            endTime: schedule.endTime, // Already in HH:MM format
            locationId: schedule.locationId,
            locationName: schedule.location
          }));
        
        setFormData(prev => ({
          ...prev,
          scheduleDates: convertedSchedules
        }));
      } else {
        console.error('Failed to fetch schedules:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employee schedules:', error);
    }
  };

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/dashboard/locations');
        if (response.ok) {
          const data = await response.json();
          setLocations(data.locations || []);
        }
      } catch (error) {
        toast.error('Failed to load locations');
      } finally {
        setLoadingLocations(false);
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleScheduleSave = (schedules: ScheduleDate[]) => {
    setFormData(prev => ({
      ...prev,
      scheduleDates: schedules
    }));
    setShowCalendar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employee) return;

    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.wechatUsername.trim()) {
      toast.error('WeChat username is required');
      return;
    }
    if (formData.services.length === 0) {
      toast.error('At least one service must be selected');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        name: formData.name,
        email: formData.email,
        wechatUsername: formData.wechatUsername,
        phone: formData.phone,
        status: formData.status,
        services: formData.services,
        scheduleDates: formData.scheduleDates
      };
      
      const response = await fetch(`/api/dashboard/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update employee');
      }

      toast.success(`Employee ${formData.name} updated successfully`);
      
      // Refresh the employee data in the modal to show updated information
      if (employee) {
        await fetchEmployeeSchedules(employee.id);
      }
      
      onSave();
      setIsSaved(true);
      
      // Auto-close after 2 seconds to show updated data
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationCreated = () => {
    // Refresh locations after creating a new one
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/dashboard/locations');
        if (response.ok) {
          const data = await response.json();
          setLocations(data.locations || []);
        }
      } catch (error) {
        toast.error('Failed to load locations');
      }
    };
    fetchLocations();
  };

  if (!isOpen || !employee) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Employee: {employee.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter employee name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label htmlFor="wechatUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WeChat Username *
                  </label>
                  <input
                    type="text"
                    id="wechatUsername"
                    name="wechatUsername"
                    value={formData.wechatUsername}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter WeChat username"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Services Offered *</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableServices.map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Schedule</h3>
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  disabled={locations.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {locations.length === 0 ? 'No Locations Available' : 'Set Schedule'}
                </button>
              </div>
              
              {locations.length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
                  You need to create at least one location first.{' '}
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(true)}
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    Create a location
                  </button>{' '}
                  to continue.
                </p>
              )}
              
              {formData.scheduleDates.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.scheduleDates.length} schedule(s) set across {new Set(formData.scheduleDates.map(s => s.locationName)).size} location(s)
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {Object.entries(
                      formData.scheduleDates.reduce((acc, schedule) => {
                        if (!acc[schedule.locationName]) {
                          acc[schedule.locationName] = [];
                        }
                        acc[schedule.locationName].push(schedule);
                        return acc;
                      }, {} as Record<string, typeof formData.scheduleDates>)
                    ).map(([locationName, schedules]) => (
                      <div key={locationName} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {locationName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({schedules.length} schedule{schedules.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {schedules.map((schedule) => (
                            <div key={schedule.id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-300">
                                {new Date(schedule.date).toLocaleDateString()} • {schedule.startTime} - {schedule.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No schedules set</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              {isSaved ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <div className="w-4 h-4 mr-2">✓</div>
                    <span className="text-sm font-medium">Changes saved successfully!</span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Schedule Calendar Modal */}
      {showCalendar && (
        <ScheduleCalendar
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
          onSave={handleScheduleSave}
          employeeName={employee.name}
          locations={locations}
          existingSchedules={formData.scheduleDates}
        />
      )}

      {/* Create Location Modal */}
      {showLocationModal && (
        <CreateLocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onLocationCreated={handleLocationCreated}
        />
      )}
    </>
  );
}
