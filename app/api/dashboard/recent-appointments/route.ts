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
      return NextResponse.json([]);
    }

    // Get recent appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        locationId: {
          in: locationIds
        }
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        masseuse: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        location: {
          select: {
            name: true
          }
        },
        massage: {
          select: {
            type: true
          }
        }
      },
      orderBy: {
        appointmentDate: 'desc'
      },
      take: 10
    });

    // Transform appointments data
    const transformedAppointments = appointments.map(appointment => {
      const now = new Date();
      const appointmentDate = new Date(appointment.appointmentDate);
      const isPast = appointmentDate < now;
      const isToday = appointmentDate.toDateString() === now.toDateString();
      
      let status = "Scheduled";
      if (isPast) {
        status = "Completed";
      } else if (isToday) {
        status = "Today";
      }

      return {
        id: appointment.id,
        date: appointment.appointmentDate,
        customerName: appointment.client.user?.name || appointment.client.clientName,
        masseuseName: appointment.masseuse.user?.name || appointment.masseuse.masseuseName,
        service: appointment.massage.type,
        duration: `${appointment.duration} min`,
        status,
        location: appointment.location.name
      };
    });

    // Broadcast appointments update
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.APPOINTMENT_UPDATED,
      data: transformedAppointments,
      timestamp: Date.now()
    });

    return NextResponse.json(transformedAppointments);

  } catch (error) {
    console.error("Error fetching recent appointments:", error);
    return NextResponse.json({ error: "Failed to fetch recent appointments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { appointmentData } = await request.json();

    // Create new appointment logic here
    // This is a placeholder - implement actual appointment creation
    const newAppointment = {
      id: `apt_${Date.now()}`,
      ...appointmentData,
      createdAt: new Date()
    };

    // Broadcast appointment created event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.APPOINTMENT_CREATED,
      data: newAppointment,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true, appointment: newAppointment });

  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { appointmentId, updates } = await request.json();

    // Update appointment logic here
    // This is a placeholder - implement actual appointment update
    const updatedAppointment = {
      id: appointmentId,
      ...updates,
      updatedAt: new Date()
    };

    // Broadcast appointment updated event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.APPOINTMENT_UPDATED,
      data: updatedAppointment,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true, appointment: updatedAppointment });

  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { appointmentId } = await request.json();

    // Cancel appointment logic here
    // This is a placeholder - implement actual appointment cancellation
    const cancelledAppointment = {
      id: appointmentId,
      status: "Cancelled",
      cancelledAt: new Date()
    };

    // Broadcast appointment cancelled event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.APPOINTMENT_CANCELLED,
      data: cancelledAppointment,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true, appointment: cancelledAppointment });

  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}
