import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { realtimeManager, REALTIME_EVENTS } from "@/lib/realtime";
import { setCachedData } from "@/lib/performance";

interface ScheduleConflict {
  dayName: string;
  location: string;
  startTime: string;
  endTime: string;
}

// Helper function to check for schedule conflicts
async function checkScheduleConflicts(
  masseuseId: string, 
  scheduleData: Array<{
    masseuseId: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    locationId: string;
  }>, 
  selectedLocations: string[]
): Promise<ScheduleConflict[]> {
  const conflicts: ScheduleConflict[] = [];
  
  // Group schedules by date
  const dateGroups = scheduleData.reduce((acc, schedule) => {
    const dateKey = schedule.date.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(schedule);
    return acc;
  }, {} as Record<string, typeof scheduleData>);
  
  // Check for conflicts on each date and location
  for (const [dateKey, schedules] of Object.entries(dateGroups)) {
    // Group schedules by location for this date
    const locationGroups = schedules.reduce((acc, schedule) => {
      if (!acc[schedule.locationId]) {
        acc[schedule.locationId] = [];
      }
      acc[schedule.locationId].push(schedule);
      return acc;
    }, {} as Record<string, typeof schedules>);
    
    // Check for conflicts within each location
    for (const [locationId, locationSchedules] of Object.entries(locationGroups)) {
      if (locationSchedules.length > 1) {
        for (let i = 0; i < locationSchedules.length; i++) {
          for (let j = i + 1; j < locationSchedules.length; j++) {
            const schedule1 = locationSchedules[i];
            const schedule2 = locationSchedules[j];
            
            // Check if schedules overlap within the same location
            if (schedule1.startTime < schedule2.endTime && schedule2.startTime < schedule1.endTime) {
              conflicts.push({
                dayName: new Date(dateKey).toLocaleDateString(),
                location: 'Same location',
                startTime: schedule1.startTime.toTimeString().slice(0, 5),
                endTime: schedule1.endTime.toTimeString().slice(0, 5)
              });
            }
          }
        }
      }
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
    
    // Get user's locations with optimized query
    const userLocations = await prisma.location.findMany({
      where: {
        ownerId: userId
      },
      select: {
        id: true
      }
    });

    const locationIds = userLocations.map(loc => loc.id);

    if (locationIds.length === 0) {
      return NextResponse.json({ employees: [], stats: { total: 0, active: 0, inactive: 0 } });
    }

    // Optimized query to get all data in one go
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get all masseuses with optimized includes
    const masseuses = await prisma.masseuse.findMany({
      where: {
        LocationMasseuse: {
          some: {
            locationId: {
              in: locationIds
            }
          }
        }
      },
      include: {
        servicesOffered: {
          select: {
            type: true,
            addons: true,
            serviceNames: true
          }
        },
        workingHours: {
          orderBy: {
            dayOfWeek: 'asc'
          },
          select: {
            dayOfWeek: true,
            openTime: true,
            closeTime: true
          }
        },
        appointments: {
          where: {
            locationId: {
              in: locationIds
            }
          },
          orderBy: {
            appointmentDate: 'desc'
          },
          take: 5,
          select: {
            appointmentDate: true,
            duration: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        masseuseName: 'asc'
      }
    });

    // Calculate stats using optimized queries
    const [totalEmployees, activeEmployees, inactiveEmployees, totalAppointments, totalRevenue] = await Promise.all([
      // Total employees
      prisma.masseuse.count({
        where: {
          LocationMasseuse: {
            some: {
              locationId: {
                in: locationIds
              }
            }
          }
        }
      }),
      // Active employees (with appointments in last 30 days)
      prisma.masseuse.count({
        where: {
          LocationMasseuse: {
            some: {
              locationId: {
                in: locationIds
              }
            }
          },
          appointments: {
            some: {
              locationId: {
                in: locationIds
              },
              appointmentDate: {
                gte: thirtyDaysAgo
              }
            }
          }
        }
      }),
      // Inactive employees (no appointments in last 30 days)
      prisma.masseuse.count({
        where: {
          LocationMasseuse: {
            some: {
              locationId: {
                in: locationIds
              }
            }
          },
          appointments: {
            none: {
              locationId: {
                in: locationIds
              },
              appointmentDate: {
                gte: thirtyDaysAgo
              }
            }
          }
        }
      }),
      // Total appointments
      prisma.appointment.count({
        where: {
          locationId: {
            in: locationIds
          }
        }
      }),
      // Total revenue
      prisma.appointment.aggregate({
        where: {
          locationId: {
            in: locationIds
          }
        },
        _sum: {
          duration: true
        }
      })
    ]);

    // Transform employees data
    const transformedEmployees = masseuses.map(masseuse => {
      const lastAppointment = masseuse.appointments[0];
      const isActive = lastAppointment && lastAppointment.appointmentDate > thirtyDaysAgo;
      
      // Calculate this month's revenue
      const thisMonthRevenue = masseuse.appointments
        .filter(appt => appt.appointmentDate >= startOfMonth)
        .reduce((sum, appt) => sum + (appt.duration * 80), 0);
      
      return {
        id: masseuse.id,
        name: masseuse.user?.name || masseuse.masseuseName,
        email: masseuse.user?.email || 'No email',
        image: masseuse.user?.image,
        wechatUsername: masseuse.wechatUsername,
        status: isActive ? 'Active' : 'Inactive',
        services: masseuse.servicesOffered.serviceNames,
        workingHours: masseuse.workingHours.map(wh => ({
          day: wh.dayOfWeek,
          startTime: wh.openTime,
          endTime: wh.closeTime
        })),
        lastAppointment: lastAppointment?.appointmentDate,
        appointmentCount: masseuse.appointments.length,
        totalRevenue: masseuse.appointments.reduce((sum, appt) => sum + (appt.duration * 80), 0),
        thisMonthRevenue
      };
    });

    const stats = {
      total: totalEmployees,
      active: activeEmployees,
      inactive: inactiveEmployees,
      totalAppointments,
      totalRevenue: totalRevenue._sum.duration ? totalRevenue._sum.duration * 80 : 0
    };

    // Broadcast stats update
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.STATS_UPDATED,
      data: stats,
      timestamp: Date.now()
    });

    return NextResponse.json({
      employees: transformedEmployees,
      stats
    });

  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { name, email, wechatUsername, phone, status, services, scheduleDates, selectedLocations } = await request.json();

    // Validate required fields
    if (!name || !email || !wechatUsername) {
      return NextResponse.json({ error: "Name, email, and WeChat username are required" }, { status: 400 });
    }

    if (!services || services.length === 0) {
      return NextResponse.json({ error: "At least one service must be selected" }, { status: 400 });
    }

    if (!selectedLocations || selectedLocations.length === 0) {
      return NextResponse.json({ error: "At least one location must be selected" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Get user's locations and validate selected locations
    const userLocations = await prisma.location.findMany({
      where: {
        ownerId: userId,
        id: {
          in: selectedLocations
        }
      },
      select: {
        id: true
      }
    });

    if (userLocations.length === 0) {
      return NextResponse.json({ error: "No valid locations found for user" }, { status: 400 });
    }

    // Check if user with this email already exists
    let existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      // Create new user for the employee
      existingUser = await prisma.user.create({
        data: {
          name,
          email,
          role: ['masseuse']
        }
      });
    }

    // Check if WeChat username is already taken
    const existingMasseuse = await prisma.masseuse.findUnique({
      where: { wechatUsername }
    });

    if (existingMasseuse) {
      return NextResponse.json({ error: "WeChat username is already taken" }, { status: 400 });
    }

    // Separate services into types and addons
    const massageTypes: ("body" | "foot" | "sauna")[] = [];
    const massageAddons: ("cupping" | "backwalking" | "hotstones" | "aromatherapy" | "tigerbalm")[] = [];
    const serviceNames: string[] = []; // Store original service names for display
    
    services.forEach((service: string) => {
      // Add original service name to display list
      serviceNames.push(service);
      
      // Map service names to MassageType enum values
      const typeMap: { [key: string]: string } = {
        "Body Massage": "body",
        "Foot Massage": "foot",
        "Sauna": "sauna"
      };
      
      // Map service names to MassageAddons enum values
      const addonMap: { [key: string]: string } = {
        "Aromatherapy": "aromatherapy",
        "Cupping": "cupping",
        "Hot Stone": "hotstones",
        "Back Walking": "backwalking",
        "Tiger Balm": "tigerbalm"
      };
      
      if (typeMap[service]) {
        massageTypes.push(typeMap[service] as "body" | "foot" | "sauna");
      } else if (addonMap[service]) {
        massageAddons.push(addonMap[service] as "cupping" | "backwalking" | "hotstones" | "aromatherapy" | "tigerbalm");
      } else {
        // For unmapped services, add them as body massage type
        // This handles: "Deep Tissue", "Swedish Massage", "Reflexology"
        if (!massageTypes.includes("body")) {
          massageTypes.push("body");
        }
      }
    });
    
    // Ensure at least one massage type is selected
    if (massageTypes.length === 0) {
      massageTypes.push("body");
    }

    // Create masseuse service record
    const masseuseService = await prisma.masseuseService.create({
      data: {
        type: massageTypes,
        addons: massageAddons,
        serviceNames: serviceNames, // Store original service names
        duration: [60, 90] // Default durations
      }
    });

    // Create the masseuse record
    const newMasseuse = await prisma.masseuse.create({
      data: {
        masseuseName: name,
        masseuseId: existingUser.id,
        wechatUsername,
        masseuseServiceId: masseuseService.id
      }
    });

    // Link masseuse to selected locations
    const locationConnections = userLocations.map(location => ({
      locationId: location.id,
      masseuseId: newMasseuse.id
    }));

    await prisma.locationMasseuse.createMany({
      data: locationConnections
    });

    // Create schedule dates if provided
    if (scheduleDates && scheduleDates.length > 0) {
      // Deduplicate schedules to prevent unique constraint violations
      const uniqueSchedules = scheduleDates.reduce((acc: any[], schedule: any) => {
        const key = `${schedule.date}_${schedule.startTime}_${schedule.endTime}_${schedule.locationId}`;
        if (!acc.find(s => `${s.date}_${s.startTime}_${s.endTime}_${s.locationId}` === key)) {
          acc.push(schedule);
        }
        return acc;
      }, []);

      const scheduleData = uniqueSchedules.map((schedule: any) => ({
        masseuseId: newMasseuse.id,
        date: new Date(schedule.date),
        startTime: new Date(`2000-01-01T${schedule.startTime}`),
        endTime: new Date(`2000-01-01T${schedule.endTime}`),
        locationId: schedule.locationId
      }));

      // Check for schedule conflicts before creating
      const conflicts = await checkScheduleConflicts(newMasseuse.id, scheduleData, selectedLocations);
      if (conflicts.length > 0) {
        return NextResponse.json({ 
          error: "Schedule conflicts detected", 
          conflicts: conflicts.map(c => `${c.dayName} at ${c.location}: ${c.startTime} - ${c.endTime}`)
        }, { status: 409 });
      }

      if (scheduleData.length > 0) {
        await prisma.employeeSchedule.createMany({
          data: scheduleData
        });
      }
    }

    // Fetch the created masseuse with full details
    const createdMasseuse = await prisma.masseuse.findUnique({
      where: { id: newMasseuse.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        },
        servicesOffered: true,
        workingHours: true,
        LocationMasseuse: {
          include: {
            location: true
          }
        }
      }
    });

    // Broadcast employee created event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.EMPLOYEE_CREATED,
      data: createdMasseuse,
      timestamp: Date.now()
    });

    // If schedules were created, also broadcast a schedule update event
    const hasSchedules = scheduleDates && scheduleDates.length > 0;
    
    if (hasSchedules) {
      realtimeManager.broadcastToUser(userId, {
        type: REALTIME_EVENTS.EMPLOYEE_SCHEDULE_UPDATE,
        data: {
          employeeName: name,
          changeType: 'created',
          message: 'New employee schedule created'
        },
        timestamp: Date.now()
      });
    }

    // Clear employee schedules cache to ensure fresh data
    const scheduleCacheKey = `employee_schedules_${userId}`;
    setCachedData(scheduleCacheKey, null, 0);

    // Also broadcast a more specific event to force immediate refresh
    if (hasSchedules) {
      realtimeManager.broadcastToUser(userId, {
        type: 'IMMEDIATE_SCHEDULE_REFRESH',
        data: {
          employeeName: name,
          message: 'New employee schedule created - immediate refresh required'
        },
        timestamp: Date.now()
      });
    }

    return NextResponse.json({ 
      success: true, 
      employee: createdMasseuse,
      hasSchedules
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        if (error.message.includes('wechatUsername')) {
          return NextResponse.json({ error: "WeChat username is already taken" }, { status: 409 });
        }
        if (error.message.includes('email')) {
          return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
        }
      }
    }
    
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { employeeId, updates } = await request.json();

    // Update employee logic here
    // This is a placeholder - implement actual employee update
    const updatedEmployee = {
      id: employeeId,
      ...updates,
      updatedAt: new Date()
    };

    // Broadcast employee updated event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.EMPLOYEE_UPDATED,
      data: updatedEmployee,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true, employee: updatedEmployee });

  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}
