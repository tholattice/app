import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Always find user by email since session ID doesn't match database ID
    if (!session.user?.email) {
      return NextResponse.json({ error: "No email in session" }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user!.email! }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const userId = user.id;
    
    // Get user's locations
    const userLocations = await prisma.location.findMany({
      where: {
        ownerId: userId
      }
    });

    const locationIds = userLocations.map(loc => loc.id);

    if (locationIds.length === 0) {
      return NextResponse.json({
        currentMonthAppointments: 0,
        previousMonthAppointments: 0,
        appointmentGrowth: 0,
        currentMonthRevenue: 0,
        previousMonthRevenue: 0,
        revenueGrowth: 0,
        totalMasseuses: 0,
        averageAppointmentDuration: 0
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all metrics in parallel
    const [
      currentMonthAppointments,
      lastMonthAppointments,
      totalMasseuses,
      averageAppointmentDuration
    ] = await Promise.all([
      // Current month appointments
      prisma.appointment.count({
        where: {
          locationId: {
            in: locationIds
          },
          appointmentDate: {
            gte: startOfMonth
          }
        }
      }),
      // Last month appointments
      prisma.appointment.count({
        where: {
          locationId: {
            in: locationIds
          },
          appointmentDate: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      // Total masseuses - count masseuses linked to user's locations
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
      // Average appointment duration
      prisma.appointment.aggregate({
        where: {
          locationId: {
            in: locationIds
          }
        },
        _avg: {
          duration: true
        }
      })
    ]);

    const monthlyAppointmentsGrowth = lastMonthAppointments > 0
      ? ((currentMonthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100
      : 0;

    const monthlyRevenue = currentMonthAppointments * 80; // Assuming $80 per appointment
    const lastMonthRevenue = lastMonthAppointments * 80;
    const monthlyRevenueGrowth = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    return NextResponse.json({
      monthlyRevenue,
      monthlyAppointments: currentMonthAppointments,
      totalMasseuses,
      averageAppointmentDuration: averageAppointmentDuration._avg.duration || 0
    });

  } catch (error) {
    console.error("Error fetching business metrics:", error);
    return NextResponse.json({ error: "Failed to fetch business metrics" }, { status: 500 });
  }
}
