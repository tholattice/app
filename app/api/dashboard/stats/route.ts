import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      return NextResponse.json({ 
        totalAppointments: 0, 
        totalCustomers: 0, 
        totalRevenue: 0, 
        upcomingAppointments: 0 
      });
    }

    // Fetch all stats in parallel
    const [
      totalAppointments,
      totalCustomers,
      upcomingAppointments
    ] = await Promise.all([
      // Total appointments
      prisma.appointment.count({
        where: {
          locationId: {
            in: locationIds
          }
        }
      }),
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
      // Upcoming appointments
      prisma.appointment.count({
        where: {
          locationId: {
            in: locationIds
          },
          appointmentDate: {
            gte: new Date()
          }
        }
      })
    ]);

    // Calculate total revenue from actual appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        locationId: {
          in: locationIds
        }
      },
      select: {
        duration: true
      }
    });

    const totalRevenue = appointments.reduce((sum, appt) => sum + (appt.duration * 80), 0);

    return NextResponse.json({
      totalAppointments,
      totalCustomers,
      totalRevenue,
      upcomingAppointments
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}
