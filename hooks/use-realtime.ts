import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeEvent, REALTIME_EVENTS } from '@/lib/realtime';

interface UseRealtimeOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  connectionId: string | null;
  connect: () => void;
  disconnect: () => void;
  sendEvent: (eventType: string, data: any) => Promise<void>;
  lastEvent: RealtimeEvent | null;
  error: string | null;
}

export function useRealtime(options: UseRealtimeOptions = {}): UseRealtimeReturn {
  const {
    autoConnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      setError(null);
      const eventSource = new EventSource('/api/realtime/connect');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        // Connection established successfully
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'connection_established') {
            setConnectionId(data.connectionId);
          } else if (data.type === 'heartbeat') {
            // Handle heartbeat - connection is alive
          } else {
            // Handle real events
            setLastEvent(data);
          }
        } catch (parseError) {
          // Error parsing realtime event - silently handle
        }
      };

      eventSource.onerror = (error) => {
        setIsConnected(false);
        setError('Connection error occurred');
        
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            // Attempting to reconnect
            connect();
          }, reconnectInterval);
        } else {
          setError('Max reconnection attempts reached');
        }
      };

    } catch (error) {
      setError('Failed to establish connection');
    }
  }, [reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionId(null);
    setError(null);
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendEvent = useCallback(async (eventType: string, data: any) => {
    try {
      const response = await fetch('/api/realtime/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventType, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to send event');
      }
    } catch (error) {
      throw error;
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    connectionId,
    connect,
    disconnect,
    sendEvent,
    lastEvent,
    error
  };
}

// Specialized hooks for different data types
export function useRealtimeAppointments() {
  const { lastEvent, ...realtime } = useRealtime();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (lastEvent && (
      lastEvent.type === REALTIME_EVENTS.APPOINTMENT_CREATED ||
      lastEvent.type === REALTIME_EVENTS.APPOINTMENT_UPDATED ||
      lastEvent.type === REALTIME_EVENTS.APPOINTMENT_CANCELLED
    )) {
      // Update appointments based on event type
      setAppointments(prev => {
        switch (lastEvent.type) {
          case REALTIME_EVENTS.APPOINTMENT_CREATED:
            return [...prev, lastEvent.data];
          case REALTIME_EVENTS.APPOINTMENT_UPDATED:
            return prev.map(apt => 
              apt.id === lastEvent.data.id ? { ...apt, ...lastEvent.data } : apt
            );
          case REALTIME_EVENTS.APPOINTMENT_CANCELLED:
            return prev.filter(apt => apt.id !== lastEvent.data.id);
          default:
            return prev;
        }
      });
    }
  }, [lastEvent]);

  return { appointments, setAppointments, ...realtime };
}

export function useRealtimeCustomers() {
  const { lastEvent, ...realtime } = useRealtime();
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (lastEvent && (
      lastEvent.type === REALTIME_EVENTS.CUSTOMER_CREATED ||
      lastEvent.type === REALTIME_EVENTS.CUSTOMER_UPDATED
    )) {
      setCustomers(prev => {
        switch (lastEvent.type) {
          case REALTIME_EVENTS.CUSTOMER_CREATED:
            return [...prev, lastEvent.data];
          case REALTIME_EVENTS.CUSTOMER_UPDATED:
            return prev.map(customer => 
              customer.id === lastEvent.data.id ? { ...customer, ...lastEvent.data } : customer
            );
          default:
            return prev;
        }
      });
    }
  }, [lastEvent]);

  return { customers, setCustomers, lastEvent, ...realtime };
}

export function useRealtimeEmployees() {
  const { lastEvent, ...realtime } = useRealtime();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (lastEvent && (
      lastEvent.type === REALTIME_EVENTS.EMPLOYEE_CREATED ||
      lastEvent.type === REALTIME_EVENTS.EMPLOYEE_UPDATED
    )) {
      setEmployees(prev => {
        switch (lastEvent.type) {
          case REALTIME_EVENTS.EMPLOYEE_CREATED:
            return [...prev, lastEvent.data];
          case REALTIME_EVENTS.EMPLOYEE_UPDATED:
            return prev.map(employee => 
              employee.id === lastEvent.data.id ? { ...employee, ...lastEvent.data } : employee
            );
          default:
            return prev;
        }
      });
    }
  }, [lastEvent]);

  return { employees, setEmployees, lastEvent, ...realtime };
}

export function useRealtimeStats() {
  const { lastEvent, ...realtime } = useRealtime();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (lastEvent && lastEvent.type === REALTIME_EVENTS.STATS_UPDATED) {
      setStats(lastEvent.data);
    }
  }, [lastEvent]);

  return { stats, setStats, lastEvent, ...realtime };
}
