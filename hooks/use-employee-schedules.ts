import { useState, useEffect, useCallback } from 'react';
import { useRealtime } from './use-realtime';
import { REALTIME_EVENTS } from '@/lib/realtime';

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

interface EmployeeScheduleData {
  schedules: Schedule[];
  timeOffRequests: TimeOffRequest[];
  scheduleChanges: ScheduleChange[];
}

interface UseEmployeeSchedulesReturn {
  data: EmployeeScheduleData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTimeOffRequest: (data: {
    masseuseId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => Promise<boolean>;
  createScheduleChange: (data: {
    masseuseId: string;
    locationId: string;
    dayOfWeek: number;
    oldStartTime?: string;
    oldEndTime?: string;
    newStartTime?: string;
    newEndTime?: string;
    changeType: string;
    reason?: string;
  }) => Promise<boolean>;
  approveRequest: (type: 'timeOffRequest' | 'scheduleChange', id: string, action: 'approve' | 'deny') => Promise<boolean>;
}

export function useEmployeeSchedules(): UseEmployeeSchedulesReturn {
  const [data, setData] = useState<EmployeeScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time connection
  const { isConnected, lastEvent } = useRealtime();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/employee-schedules');
      if (!response.ok) {
        throw new Error('Failed to fetch employee schedules');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching employee schedules:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time updates
  useEffect(() => {
    console.log('Employee schedules hook - lastEvent:', lastEvent, 'isConnected:', isConnected);
    
    if (lastEvent && isConnected) {
      try {
        if (
          lastEvent.type === REALTIME_EVENTS.EMPLOYEE_SCHEDULE_UPDATE ||
          lastEvent.type === REALTIME_EVENTS.TIME_OFF_REQUEST_CREATED ||
          lastEvent.type === REALTIME_EVENTS.SCHEDULE_CHANGE_CREATED ||
          lastEvent.type === REALTIME_EVENTS.REQUEST_APPROVED ||
          lastEvent.type === REALTIME_EVENTS.REQUEST_DENIED ||
          lastEvent.type === REALTIME_EVENTS.EMPLOYEE_CREATED ||
          lastEvent.type === REALTIME_EVENTS.EMPLOYEE_UPDATED ||
          lastEvent.type === 'IMMEDIATE_SCHEDULE_REFRESH'
        ) {
          console.log('Real-time employee schedule event received:', lastEvent);
          console.log('Triggering data refetch...');
          // Refetch data when we receive a real-time update
          fetchData();
        }
      } catch (err) {
        console.error('Error parsing real-time message:', err);
      }
    }
  }, [lastEvent, isConnected, fetchData]);

  const createTimeOffRequest = useCallback(async (requestData: {
    masseuseId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/dashboard/employee-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'timeOffRequest',
          data: requestData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create time off request');
      }

      // Refetch data to get the latest state
      await fetchData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create time off request');
      console.error('Error creating time off request:', err);
      return false;
    }
  }, [fetchData]);

  const createScheduleChange = useCallback(async (changeData: {
    masseuseId: string;
    locationId: string;
    dayOfWeek: number;
    oldStartTime?: string;
    oldEndTime?: string;
    newStartTime?: string;
    newEndTime?: string;
    changeType: string;
    reason?: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/dashboard/employee-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'scheduleChange',
          data: changeData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create schedule change');
      }

      // Refetch data to get the latest state
      await fetchData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create schedule change');
      console.error('Error creating schedule change:', err);
      return false;
    }
  }, [fetchData]);

  const approveRequest = useCallback(async (
    type: 'timeOffRequest' | 'scheduleChange',
    id: string,
    action: 'approve' | 'deny'
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/dashboard/employee-schedules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          id,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} ${type}`);
      }

      // Refetch data to get the latest state
      await fetchData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} ${type}`);
      console.error(`Error ${action}ing ${type}:`, err);
      return false;
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    createTimeOffRequest,
    createScheduleChange,
    approveRequest,
  };
}
