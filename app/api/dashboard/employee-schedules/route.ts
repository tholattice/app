import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedData, setCachedData, measurePerformance } from "@/lib/performance";
import { realtimeManager, REALTIME_EVENTS } from "@/lib/realtime";

interface ScheduleConflict {
  dayName: string;
  location: string;
  startTime: string;
  endTime: string;
}

// Helper function to check for schedule conflicts
async function checkScheduleConflicts(
  masseuseId: string, 
  dayOfWeek: number,
  newStartTime: Date,
  newEndTime: Date,
  excludeScheduleId?: string
): Promise<ScheduleConflict[]> {
  const conflicts: ScheduleConflict[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get existing weekly schedules for this employee on the same day
  const existingWeeklySchedules = await prisma.workingHours.findMany({
    where: {
      masseuseId,
      dayOfWeek,
      id: excludeScheduleId ? { not: excludeScheduleId } : undefined
    }
  });

  // Check for overlaps with existing weekly schedules
  for (const schedule of existingWeeklySchedules) {
    if (newStartTime < schedule.closeTime && schedule.openTime < newEndTime) {
      conflicts.push({
        dayName: dayNames[dayOfWeek],
        location: 'Existing weekly schedule',
        startTime: schedule.openTime.toTimeString().slice(0, 5),
        endTime: schedule.closeTime.toTimeString().slice(0, 5)
      });
    }
  }

  // Get existing date-based schedules for this employee on the same day of week
  // We need to check all date-based schedules that fall on the same day of week
  const existingDateSchedules = await prisma.employeeSchedule.findMany({
    where: {
      masseuseId,
      id: excludeScheduleId ? { not: excludeScheduleId } : undefined
    }
  });

  // Filter schedules that fall on the same day of week
  const sameDayDateSchedules = existingDateSchedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate.getDay() === dayOfWeek;
  });

  // Check for overlaps with existing date-based schedules
  for (const schedule of sameDayDateSchedules) {
    if (newStartTime < schedule.endTime && schedule.startTime < newEndTime) {
      conflicts.push({
        dayName: dayNames[dayOfWeek],
        location: `Existing date schedule (${schedule.date.toISOString().split('T')[0]})`,
        startTime: schedule.startTime.toTimeString().slice(0, 5),
        endTime: schedule.endTime.toTimeString().slice(0, 5)
      });
    }
  }

  return conflicts;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const masseuseId = searchParams.get('masseuseId');
    const cacheKey = masseuseId ? `employee_schedules_${userId}_${masseuseId}` : `employee_schedules_${userId}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const schedules = await measurePerformance('Employee Schedules Fetch', async () => {
      // Get user's locations with optimized query
      const userLocations = await prisma.location.findMany({
        where: { ownerId: userId },
        select: { id: true }
      });

      const locationIds = userLocations.map(loc => loc.id);

      if (locationIds.length === 0) {
        return { schedules: [], timeOffRequests: [], scheduleChanges: [] };
      }

      // Fetch all schedule data in parallel with optimized queries
      const [workingHours, employeeSchedules, timeOffRequests, scheduleChanges] = await Promise.all([
        // Working hours - only fetch from masseuse locations to avoid duplicates
        prisma.workingHours.findMany({
          where: {
            masseuse: { 
              LocationMasseuse: { 
                some: { 
                  locationId: { in: locationIds } 
                } 
              } 
            }
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } },
                LocationMasseuse: {
                  include: {
                    location: { select: { name: true } }
                  }
                }
              }
            }
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { openTime: 'asc' }
          ]
        }),

        // Employee schedules (new date-based schedules)
        prisma.employeeSchedule.findMany({
          where: {
            locationId: { in: locationIds },
            ...(masseuseId && { masseuseId })
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } }
              }
            },
            location: { select: { name: true } }
          },
          orderBy: [
            { date: 'asc' },
            { startTime: 'asc' }
          ]
        }),

        // Time off requests
        prisma.timeOffRequest.findMany({
          where: {
            masseuse: {
              LocationMasseuse: { some: { locationId: { in: locationIds } } }
            }
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } }
              }
            }
          },
          orderBy: { startDate: 'desc' }
        }),

        // Schedule changes
        prisma.scheduleChange.findMany({
          where: {
            locationId: { in: locationIds }
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } }
              }
            },
            location: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      // Transform working hours to schedule format
      const workingHourSchedules = workingHours.flatMap(wh => {
        const employeeName = wh.masseuse?.user?.name || wh.masseuse?.masseuseName || 'Unknown';
        const locations = wh.masseuse?.LocationMasseuse || [];
        
        // Create a schedule entry for each location the employee works at
        return locations.map(loc => ({
          id: `${wh.id}_${loc.locationId}`, // Unique ID for each location
          employeeId: wh.masseuseId || '',
          employeeName,
          location: loc.location?.name || 'Unknown Location',
          dayOfWeek: getDayName(wh.dayOfWeek),
          startTime: wh.openTime.toTimeString().slice(0, 5),
          endTime: wh.closeTime.toTimeString().slice(0, 5),
          isAvailable: true,
          dayOfWeekNumber: wh.dayOfWeek,
          scheduleType: 'weekly' as const
        }));
      });

      // Transform employee schedules (date-based) to schedule format
      const employeeScheduleSchedules = employeeSchedules.map(es => ({
        id: es.id,
        employeeId: es.masseuseId,
        employeeName: es.masseuse?.user?.name || es.masseuse?.masseuseName || 'Unknown',
        location: es.location?.name || 'Unknown Location',
        locationId: es.locationId,
        date: es.date.toISOString().split('T')[0], // YYYY-MM-DD format
        dayOfWeek: getDayName(es.date.getDay()),
        startTime: es.startTime.toTimeString().slice(0, 5),
        endTime: es.endTime.toTimeString().slice(0, 5),
        isAvailable: true,
        dayOfWeekNumber: es.date.getDay(),
        scheduleType: 'date' as const
      }));

      // Combine both types of schedules
      const schedules = [...workingHourSchedules, ...employeeScheduleSchedules];

      // Transform time off requests
      const transformedTimeOffRequests = timeOffRequests.map(tor => ({
        id: tor.id,
        employeeId: tor.masseuseId,
        employeeName: tor.masseuse?.user?.name || tor.masseuse?.masseuseName || 'Unknown',
        startDate: tor.startDate.toISOString().split('T')[0],
        endDate: tor.endDate.toISOString().split('T')[0],
        reason: tor.reason,
        status: tor.status.toLowerCase() as 'pending' | 'approved' | 'denied' | 'cancelled',
        approvedBy: tor.approvedBy,
        approvedAt: tor.approvedAt?.toISOString(),
        createdAt: tor.createdAt.toISOString()
      }));

      // Transform schedule changes
      const transformedScheduleChanges = scheduleChanges.map(sc => ({
        id: sc.id,
        employeeId: sc.masseuseId,
        employeeName: sc.masseuse?.user?.name || sc.masseuse?.masseuseName || 'Unknown',
        location: sc.location.name,
        dayOfWeek: getDayName(sc.dayOfWeek),
        dayOfWeekNumber: sc.dayOfWeek,
        changeType: sc.changeType.toLowerCase(),
        oldStartTime: sc.oldStartTime?.toTimeString().slice(0, 5),
        oldEndTime: sc.oldEndTime?.toTimeString().slice(0, 5),
        newStartTime: sc.newStartTime?.toTimeString().slice(0, 5),
        newEndTime: sc.newEndTime?.toTimeString().slice(0, 5),
        reason: sc.reason,
        status: sc.status.toLowerCase() as 'pending' | 'approved' | 'denied' | 'cancelled',
        approvedBy: sc.approvedBy,
        approvedAt: sc.approvedAt?.toISOString(),
        createdAt: sc.createdAt.toISOString()
      }));

      return {
        schedules,
        timeOffRequests: transformedTimeOffRequests,
        scheduleChanges: transformedScheduleChanges
      };
    });

    // Cache for 30 seconds
    setCachedData(cacheKey, schedules, 30000);

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching employee schedules:", error);
    return NextResponse.json({ error: "Failed to fetch employee schedules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'timeOffRequest':
        // Validate required fields
        if (!data.masseuseId || !data.startDate || !data.endDate) {
          return NextResponse.json({ error: "Missing required fields for time off request" }, { status: 400 });
        }

        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        if (startDate > endDate) {
          return NextResponse.json({ error: "Start date cannot be after end date" }, { status: 400 });
        }

        // Check if masseuse exists and belongs to user's locations
        const masseuse = await prisma.masseuse.findFirst({
          where: {
            id: data.masseuseId,
            LocationMasseuse: {
              some: {
                location: {
                  ownerId: userId
                }
              }
            }
          }
        });

        if (!masseuse) {
          return NextResponse.json({ error: "Employee not found or not authorized" }, { status: 404 });
        }

        const timeOffRequest = await prisma.timeOffRequest.create({
          data: {
            masseuseId: data.masseuseId,
            startDate: startDate,
            endDate: endDate,
            reason: data.reason || '',
            status: 'PENDING'
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        });

        // Broadcast real-time event
        realtimeManager.broadcastToUser(userId, {
          type: REALTIME_EVENTS.TIME_OFF_REQUEST_CREATED,
          data: {
            id: timeOffRequest.id,
            employeeName: timeOffRequest.masseuse?.user?.name || timeOffRequest.masseuse?.masseuseName,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason
          },
          timestamp: Date.now()
        });

        // Clear cache
        const cacheKey = `employee_schedules_${userId}`;
        setCachedData(cacheKey, null, 0);

        return NextResponse.json({ success: true, data: timeOffRequest });

      case 'scheduleChange':
        // Validate required fields
        if (!data.masseuseId || !data.locationId || data.dayOfWeek === undefined) {
          return NextResponse.json({ error: "Missing required fields for schedule change" }, { status: 400 });
        }

        // Check if masseuse and location belong to user
        const [masseuseForSchedule, location] = await Promise.all([
          prisma.masseuse.findFirst({
            where: {
              id: data.masseuseId,
              LocationMasseuse: {
                some: {
                  location: {
                    ownerId: userId
                  }
                }
              }
            }
          }),
          prisma.location.findFirst({
            where: {
              id: data.locationId,
              ownerId: userId
            }
          })
        ]);

        if (!masseuseForSchedule || !location) {
          return NextResponse.json({ error: "Employee or location not found or not authorized" }, { status: 404 });
        }

        // Check for schedule conflicts if this is an ADD or MODIFY operation
        if (data.changeType.toUpperCase() === 'ADD' || data.changeType.toUpperCase() === 'MODIFY') {
          if (data.newStartTime && data.newEndTime) {
            const newStartTime = new Date(`2024-01-01T${data.newStartTime}`);
            const newEndTime = new Date(`2024-01-01T${data.newEndTime}`);
            
            const conflicts = await checkScheduleConflicts(
              data.masseuseId, 
              data.dayOfWeek, 
              newStartTime, 
              newEndTime
            );
            
            if (conflicts.length > 0) {
              return NextResponse.json({ 
                error: "Schedule conflicts detected", 
                conflicts: conflicts.map(c => `${c.dayName}: ${c.startTime} - ${c.endTime}`)
              }, { status: 409 });
            }
          }
        }

        const scheduleChange = await prisma.scheduleChange.create({
          data: {
            masseuseId: data.masseuseId,
            locationId: data.locationId,
            dayOfWeek: data.dayOfWeek,
            oldStartTime: data.oldStartTime ? new Date(`2024-01-01T${data.oldStartTime}`) : null,
            oldEndTime: data.oldEndTime ? new Date(`2024-01-01T${data.oldEndTime}`) : null,
            newStartTime: data.newStartTime ? new Date(`2024-01-01T${data.newStartTime}`) : null,
            newEndTime: data.newEndTime ? new Date(`2024-01-01T${data.newEndTime}`) : null,
            changeType: data.changeType.toUpperCase(),
            reason: data.reason || '',
            status: 'PENDING'
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } }
              }
            },
            location: { select: { name: true } }
          }
        });

        // Broadcast real-time event
        realtimeManager.broadcastToUser(userId, {
          type: REALTIME_EVENTS.SCHEDULE_CHANGE_CREATED,
          data: {
            id: scheduleChange.id,
            employeeName: scheduleChange.masseuse?.user?.name || scheduleChange.masseuse?.masseuseName,
            dayOfWeek: getDayName(data.dayOfWeek),
            changeType: data.changeType,
            reason: data.reason
          },
          timestamp: Date.now()
        });

        // Clear cache
        const scheduleCacheKey = `employee_schedules_${userId}`;
        setCachedData(scheduleCacheKey, null, 0);

        return NextResponse.json({ success: true, data: scheduleChange });

      default:
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating schedule request:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: "A similar request already exists" }, { status: 409 });
      }
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json({ error: "Invalid employee or location reference" }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: "Failed to create schedule request" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { type, id, action } = body;

    if (!type || !id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['approve', 'deny'].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Must be 'approve' or 'deny'" }, { status: 400 });
    }

    switch (type) {
      case 'timeOffRequest':
        // Get the time off request before updating to get employee name
        const timeOffRequest = await prisma.timeOffRequest.findFirst({
          where: { 
            id,
            masseuse: {
              LocationMasseuse: {
                some: {
                  location: {
                    ownerId: userId
                  }
                }
              }
            }
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        });

        if (!timeOffRequest) {
          return NextResponse.json({ error: "Time off request not found or not authorized" }, { status: 404 });
        }

        const updatedTimeOff = await prisma.timeOffRequest.update({
          where: { id },
          data: {
            status: action === 'approve' ? 'APPROVED' : 'DENIED',
            approvedBy: session.user.id,
            approvedAt: new Date()
          }
        });

        // Broadcast real-time event
        realtimeManager.broadcastToUser(userId, {
          type: action === 'approve' ? REALTIME_EVENTS.REQUEST_APPROVED : REALTIME_EVENTS.REQUEST_DENIED,
          data: {
            id: updatedTimeOff.id,
            employeeName: timeOffRequest.masseuse?.user?.name || timeOffRequest.masseuse?.masseuseName,
            status: action === 'approve' ? 'approved' : 'denied'
          },
          timestamp: Date.now()
        });

        // Clear cache
        const cacheKey = `employee_schedules_${userId}`;
        setCachedData(cacheKey, null, 0);

        return NextResponse.json({ success: true, data: updatedTimeOff });

      case 'scheduleChange':
        // First, get the schedule change details
        const scheduleChange = await prisma.scheduleChange.findFirst({
          where: { 
            id,
            location: {
              ownerId: userId
            }
          },
          include: {
            masseuse: {
              include: {
                user: { select: { name: true } }
              }
            },
            location: true
          }
        });

        if (!scheduleChange) {
          return NextResponse.json({ error: "Schedule change not found or not authorized" }, { status: 404 });
        }

        // Update the schedule change status
        const updatedSchedule = await prisma.scheduleChange.update({
          where: { id },
          data: {
            status: action === 'approve' ? 'APPROVED' : 'DENIED',
            approvedBy: session.user.id,
            approvedAt: new Date()
          }
        });

        // If approved, create or update the actual working hours
        if (action === 'approve') {
          const { changeType, dayOfWeek, newStartTime, newEndTime, masseuseId, locationId } = scheduleChange;

          // Helper function to create valid time strings
          const createTimeString = (timeValue: any) => {
            if (!timeValue) return '09:00:00';
            
            // If it's already a Date object, extract time
            if (timeValue instanceof Date) {
              return timeValue.toTimeString().slice(0, 8);
            }
            
            // If it's a string, ensure it has seconds
            if (typeof timeValue === 'string') {
              if (timeValue.includes(':')) {
                const parts = timeValue.split(':');
                if (parts.length === 2) {
                  return `${timeValue}:00`;
                }
                return timeValue;
              }
            }
            
            // Default fallback
            return '09:00:00';
          };

          const startTimeString = createTimeString(newStartTime);
          const endTimeString = createTimeString(newEndTime);

          // Handle different change types
          switch (changeType) {
            case 'ADD':
              // Create new working hours
              await prisma.workingHours.create({
                data: {
                  dayOfWeek,
                  openTime: new Date(`2024-01-01T${startTimeString}`),
                  closeTime: new Date(`2024-01-01T${endTimeString}`),
                  masseuseId,
                  locationId
                }
              });
              break;

            case 'MODIFY':
              // Update existing working hours
              await prisma.workingHours.upsert({
                where: {
                  masseuseId_dayOfWeek: {
                    masseuseId,
                    dayOfWeek
                  }
                },
                update: {
                  openTime: new Date(`2024-01-01T${startTimeString}`),
                  closeTime: new Date(`2024-01-01T${endTimeString}`)
                },
                create: {
                  dayOfWeek,
                  openTime: new Date(`2024-01-01T${startTimeString}`),
                  closeTime: new Date(`2024-01-01T${endTimeString}`),
                  masseuseId,
                  locationId
                }
              });
              break;

            case 'REMOVE':
              // Delete working hours for this day
              await prisma.workingHours.deleteMany({
                where: {
                  masseuseId,
                  dayOfWeek
                }
              });
              break;

            case 'SWAP':
              // Handle swap logic - this would need more complex logic
              // For now, just update the times
              await prisma.workingHours.upsert({
                where: {
                  masseuseId_dayOfWeek: {
                    masseuseId,
                    dayOfWeek
                  }
                },
                update: {
                  openTime: new Date(`2024-01-01T${startTimeString}`),
                  closeTime: new Date(`2024-01-01T${endTimeString}`)
                },
                create: {
                  dayOfWeek,
                  openTime: new Date(`2024-01-01T${startTimeString}`),
                  closeTime: new Date(`2024-01-01T${endTimeString}`),
                  masseuseId,
                  locationId
                }
              });
              break;
          }

          // Broadcast schedule update event
          realtimeManager.broadcastToUser(userId, {
            type: REALTIME_EVENTS.EMPLOYEE_SCHEDULE_UPDATE,
            data: {
              employeeName: scheduleChange.masseuse?.user?.name || scheduleChange.masseuse?.masseuseName,
              changeType: changeType.toLowerCase(),
              dayOfWeek: getDayName(dayOfWeek)
            },
            timestamp: Date.now()
          });
        } else {
          // Broadcast denial event
          realtimeManager.broadcastToUser(userId, {
            type: REALTIME_EVENTS.REQUEST_DENIED,
            data: {
              id: updatedSchedule.id,
              employeeName: scheduleChange.masseuse?.user?.name || scheduleChange.masseuse?.masseuseName,
              status: 'denied'
            },
            timestamp: Date.now()
          });
        }

        // Clear cache
        const scheduleCacheKey = `employee_schedules_${userId}`;
        setCachedData(scheduleCacheKey, null, 0);

        return NextResponse.json({ success: true, data: updatedSchedule });

      default:
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating schedule request:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: "A similar schedule already exists" }, { status: 409 });
      }
    }
    
    return NextResponse.json({ error: "Failed to update schedule request" }, { status: 500 });
  }
}

function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}
