import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { realtimeManager, REALTIME_EVENTS } from "@/lib/realtime";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get user's locations
    const userLocations = await prisma.location.findMany({
      where: {
        ownerId: userId
      }
    });

    const locationIds = userLocations.map(loc => loc.id);

    if (locationIds.length === 0) {
      return NextResponse.json({ employees: [], stats: { total: 0, active: 0, inactive: 0 } });
    }

    // Get all masseuses for the user's locations
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
        servicesOffered: true,
        workingHours: {
          orderBy: {
            dayOfWeek: 'asc'
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
          take: 5
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

    // Calculate stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
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
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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
      const isActive = lastAppointment && lastAppointment.appointmentDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
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
        services: masseuse.servicesOffered.type,
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
    const { name, email, wechatUsername, phone, status, services, workingHours } = await request.json();

    // Validate required fields
    if (!name || !email || !wechatUsername) {
      return NextResponse.json({ error: "Name, email, and WeChat username are required" }, { status: 400 });
    }

    if (!services || services.length === 0) {
      return NextResponse.json({ error: "At least one service must be selected" }, { status: 400 });
    }

    // Get user's locations
    const userLocations = await prisma.location.findMany({
      where: {
        ownerId: userId
      }
    });

    if (userLocations.length === 0) {
      return NextResponse.json({ error: "No locations found for user" }, { status: 400 });
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

    // Create masseuse service record
    const masseuseService = await prisma.masseuseService.create({
      data: {
        type: services.map((service: string) => {
          // Map service names to MassageType enum values
          const serviceMap: { [key: string]: string } = {
            "Body Massage": "body",
            "Foot Massage": "foot",
            "Deep Tissue": "deeptissue",
            "Swedish Massage": "swedish",
            "Hot Stone": "hotstone",
            "Aromatherapy": "aromatherapy",
            "Cupping": "cupping",
            "Reflexology": "reflexology"
          };
          return serviceMap[service] || "body";
        }),
        addons: [],
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

    // Link masseuse to all user locations
    const locationConnections = userLocations.map(location => ({
      locationId: location.id,
      masseuseId: newMasseuse.id
    }));

    await prisma.locationMasseuse.createMany({
      data: locationConnections
    });

    // Create working hours if provided
    if (workingHours) {
      const workingHoursData = Object.entries(workingHours)
        .filter(([_, hours]) => (hours as any).enabled)
        .map(([day, hours]) => {
          const dayMap: { [key: string]: number } = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 0
          };
          
          const hoursData = hours as { start: string; end: string };
          
          return {
            masseuseId: newMasseuse.id,
            dayOfWeek: dayMap[day],
            openTime: new Date(`2000-01-01T${hoursData.start}`),
            closeTime: new Date(`2000-01-01T${hoursData.end}`)
          };
        });

      if (workingHoursData.length > 0) {
        await prisma.workingHours.createMany({
          data: workingHoursData
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

    return NextResponse.json({ 
      success: true, 
      employee: createdMasseuse 
    });

  } catch (error) {
    console.error("Error creating employee:", error);
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
