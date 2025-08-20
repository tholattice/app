export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: number;
}

export interface RealtimeConnection {
  id: string;
  userId: string;
  events: RealtimeEvent[];
  lastActivity: number;
}

export class RealtimeManager {
  private connections: Map<string, RealtimeConnection> = new Map();
  private eventListeners: Map<string, Set<(event: RealtimeEvent) => void>> = new Map();

  // Add a new connection
  addConnection(connectionId: string, userId: string): RealtimeConnection {
    const connection: RealtimeConnection = {
      id: connectionId,
      userId,
      events: [],
      lastActivity: Date.now()
    };
    
    this.connections.set(connectionId, connection);
    return connection;
  }

  // Remove a connection
  removeConnection(connectionId: string): boolean {
    return this.connections.delete(connectionId);
  }

  // Get connection by ID
  getConnection(connectionId: string): RealtimeConnection | undefined {
    return this.connections.get(connectionId);
  }

  // Get all connections for a user
  getUserConnections(userId: string): RealtimeConnection[] {
    return Array.from(this.connections.values()).filter(conn => conn.userId === userId);
  }

  // Broadcast event to all connections of a user
  broadcastToUser(userId: string, event: RealtimeEvent): void {
    const userConnections = this.getUserConnections(userId);
    userConnections.forEach(connection => {
      this.sendEvent(connection.id, event);
    });
  }

  // Send event to specific connection
  sendEvent(connectionId: string, event: RealtimeEvent): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.events.push(event);
      connection.lastActivity = Date.now();
      
      // Notify event listeners
      const listeners = this.eventListeners.get(connectionId);
      if (listeners) {
        listeners.forEach(listener => listener(event));
      }
    }
  }

  // Add event listener for a connection
  addEventListener(connectionId: string, listener: (event: RealtimeEvent) => void): void {
    if (!this.eventListeners.has(connectionId)) {
      this.eventListeners.set(connectionId, new Set());
    }
    this.eventListeners.get(connectionId)!.add(listener);
  }

  // Remove event listener
  removeEventListener(connectionId: string, listener: (event: RealtimeEvent) => void): void {
    const listeners = this.eventListeners.get(connectionId);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  // Clean up inactive connections (older than 5 minutes)
  cleanupInactiveConnections(): void {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    Array.from(this.connections.entries()).forEach(([connectionId, connection]) => {
      if (now - connection.lastActivity > fiveMinutes) {
        this.removeConnection(connectionId);
        this.eventListeners.delete(connectionId);
      }
    });
  }

  // Get all active connections
  getAllConnections(): RealtimeConnection[] {
    return Array.from(this.connections.values());
  }

  // Get connection count
  getConnectionCount(): number {
    return this.connections.size;
  }
}

// Global realtime manager instance
export const realtimeManager = new RealtimeManager();

// Clean up inactive connections every minute
setInterval(() => {
  realtimeManager.cleanupInactiveConnections();
}, 60000);

// Event types
export const REALTIME_EVENTS = {
  APPOINTMENT_CREATED: 'appointment_created',
  APPOINTMENT_UPDATED: 'appointment_updated',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  CUSTOMER_CREATED: 'customer_created',
  CUSTOMER_UPDATED: 'customer_updated',
  EMPLOYEE_CREATED: 'employee_created',
  EMPLOYEE_UPDATED: 'employee_updated',
  EMPLOYEE_DELETED: 'employee_deleted',
  REVENUE_UPDATED: 'revenue_updated',
  STATS_UPDATED: 'stats_updated',
  NOTIFICATION: 'notification',
  // Employee Schedule Events
  TIME_OFF_REQUEST_CREATED: 'time_off_request_created',
  SCHEDULE_CHANGE_CREATED: 'schedule_change_created',
  REQUEST_APPROVED: 'request_approved',
  REQUEST_DENIED: 'request_denied',
  EMPLOYEE_SCHEDULE_UPDATE: 'employee_schedule_update'
} as const;

export type RealtimeEventType = typeof REALTIME_EVENTS[keyof typeof REALTIME_EVENTS];
