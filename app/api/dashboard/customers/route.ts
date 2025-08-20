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
      return NextResponse.json({ customers: [], stats: { total: 0, active: 0, newThisMonth: 0, churned: 0 } });
    }

    // Optimized query to get all data in one go
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // Get all clients with their appointments in a single optimized query
    const clients = await prisma.client.findMany({
      where: {
        clientLocations: {
          some: {
            locationId: {
              in: locationIds
            }
          }
        }
      },
      include: {
        appointment: {
          where: {
            locationId: {
              in: locationIds
            }
          },
          orderBy: {
            appointmentDate: 'desc'
          },
          take: 10 // Limit to recent appointments for performance
        },
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        clientName: 'asc'
      }
    });

    // Calculate stats using optimized queries
    const [totalCustomers, activeCustomers, newThisMonth, churnedCustomers] = await Promise.all([
      // Total customers
      prisma.client.count({
        where: {
          clientLocations: {
            some: {
              locationId: {
                in: locationIds
              }
            }
          }
        }
      }),
      // Active customers (with appointments in last 30 days)
      prisma.client.count({
        where: {
          clientLocations: {
            some: {
              locationId: {
                in: locationIds
              }
            }
          },
          appointment: {
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
      // New customers this month
      prisma.client.count({
        where: {
          clientLocations: {
            some: {
              locationId: {
                in: locationIds
              }
            }
          },
          user: {
            createdAt: {
              gte: startOfMonth
            }
          }
        }
      }),
      // Churned customers (no appointments in last 90 days but had appointments before)
      prisma.client.count({
        where: {
          clientLocations: {
            some: {
              locationId: {
                in: locationIds
              }
            }
          },
          appointment: {
            some: {
              locationId: {
                in: locationIds
              },
              appointmentDate: {
                lt: ninetyDaysAgo
              }
            }
          },
          NOT: {
            appointment: {
              some: {
                locationId: {
                  in: locationIds
                },
                appointmentDate: {
                  gte: ninetyDaysAgo
                }
              }
            }
          }
        }
      })
    ]);

    // Transform customers data
    const transformedCustomers = clients.map(client => {
      const lastAppointment = client.appointment[0];
      const isActive = lastAppointment && lastAppointment.appointmentDate > thirtyDaysAgo;
      
      return {
        id: client.id,
        name: client.user?.name || client.clientName,
        email: client.user?.email || 'No email',
        image: client.user?.image,
        status: isActive ? 'Active' : 'Inactive',
        totalRevenue: client.appointment.reduce((sum, appt) => sum + (appt.duration * 80), 0),
        lastAppointment: lastAppointment?.appointmentDate,
        appointmentCount: client.appointment.length,
        joined: client.user?.createdAt
      };
    });

    const stats = {
      total: totalCustomers,
      active: activeCustomers,
      newThisMonth,
      churned: churnedCustomers
    };

    // Broadcast stats update
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.STATS_UPDATED,
      data: stats,
      timestamp: Date.now()
    });

    return NextResponse.json({
      customers: transformedCustomers,
      stats
    });

  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { name, email, phone, company, status } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Get user's locations
    const userLocations = await prisma.location.findMany({
      where: {
        ownerId: userId
      },
      select: {
        id: true
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
      // Create new user for the customer
      existingUser = await prisma.user.create({
        data: {
          name,
          email,
          role: ['client']
        }
      });
    }

    // Create the client record
    const newClient = await prisma.client.create({
      data: {
        clientName: name,
        clientId: existingUser.id
      }
    });

    // Link client to all user locations
    const locationConnections = userLocations.map(location => ({
      clientId: newClient.id,
      locationId: location.id
    }));

    await prisma.locationClient.createMany({
      data: locationConnections
    });

    // Fetch the created client with full details
    const createdClient = await prisma.client.findUnique({
      where: { id: newClient.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        },
        clientLocations: {
          include: {
            location: true
          }
        }
      }
    });

    // Broadcast customer created event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.CUSTOMER_CREATED,
      data: createdClient,
      timestamp: Date.now()
    });

    return NextResponse.json({ 
      success: true, 
      customer: createdClient 
    });

  } catch (error) {
    console.error("Error creating customer:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: "A customer with this email already exists" }, { status: 409 });
      }
    }
    
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { customerId, updates } = await request.json();

    // Update customer logic here
    // This is a placeholder - implement actual customer update
    const updatedCustomer = {
      id: customerId,
      ...updates,
      updatedAt: new Date()
    };

    // Broadcast customer updated event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.CUSTOMER_UPDATED,
      data: updatedCustomer,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true, customer: updatedCustomer });

  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
