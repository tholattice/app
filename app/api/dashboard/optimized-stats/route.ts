import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedData, setCachedData, measurePerformance } from "@/lib/performance";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const cacheKey = `dashboard_data_${userId}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Fetch fresh data with performance monitoring
    const dashboardData = await measurePerformance('Dashboard Data Fetch', async () => {
      // Get user's locations
      const userLocations = await prisma.location.findMany({
        where: { ownerId: userId }
      });

      const locationIds = userLocations.map(loc => loc.id);

      if (locationIds.length === 0) {
        return {
          stats: { totalAppointments: 0, totalCustomers: 0, totalRevenue: 0, upcomingAppointments: 0 },
          metrics: { currentMonthAppointments: 0, previousMonthAppointments: 0, appointmentGrowth: 0, currentMonthRevenue: 0, previousMonthRevenue: 0, revenueGrowth: 0, totalMasseuses: 0, averageAppointmentDuration: 0 },
          appointments: []
        };
      }

      // Fetch all data in parallel with optimized queries
      const [stats, metrics, appointments] = await Promise.all([
        // Stats query - optimized with select
        (async () => {
          const [totalAppointments, totalCustomers, upcomingAppointments] = await Promise.all([
            prisma.appointment.count({ where: { locationId: { in: locationIds } } }),
            prisma.client.count({
              where: {
                clientLocations: { some: { locationId: { in: locationIds } } }
              }
            }),
            prisma.appointment.count({
              where: {
                locationId: { in: locationIds },
                appointmentDate: { gte: new Date() }
              }
            })
          ]);

          // Optimized revenue calculation
          const revenueData = await prisma.appointment.aggregate({
            where: { locationId: { in: locationIds } },
            _sum: { duration: true }
          });

          const totalRevenue = (revenueData._sum.duration || 0) * 80;

          return { totalAppointments, totalCustomers, totalRevenue, upcomingAppointments };
        })(),

        // Metrics query - optimized
        (async () => {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

          const [currentMonthAppointments, lastMonthAppointments, totalMasseuses, averageAppointmentDuration] = await Promise.all([
            prisma.appointment.count({
              where: {
                locationId: { in: locationIds },
                appointmentDate: { gte: startOfMonth }
              }
            }),
            prisma.appointment.count({
              where: {
                locationId: { in: locationIds },
                appointmentDate: { gte: startOfLastMonth, lte: endOfLastMonth }
              }
            }),
            prisma.masseuse.count({
              where: {
                LocationMasseuse: { some: { locationId: { in: locationIds } } }
              }
            }),
            prisma.appointment.aggregate({
              where: { locationId: { in: locationIds } },
              _avg: { duration: true }
            })
          ]);

          const appointmentGrowth = lastMonthAppointments > 0
            ? ((currentMonthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100
            : 0;

          const currentMonthRevenue = currentMonthAppointments * 80;
          const previousMonthRevenue = lastMonthAppointments * 80;
          const revenueGrowth = previousMonthRevenue > 0
            ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
            : 0;

          return {
            currentMonthAppointments,
            previousMonthAppointments: lastMonthAppointments,
            appointmentGrowth,
            currentMonthRevenue,
            previousMonthRevenue,
            revenueGrowth,
            totalMasseuses,
            averageAppointmentDuration: averageAppointmentDuration._avg.duration || 0
          };
        })(),

        // Recent appointments query - optimized with select
        (async () => {
          const appointments = await prisma.appointment.findMany({
            where: { locationId: { in: locationIds } },
            select: {
              id: true,
              appointmentDate: true,
              duration: true,
              client: {
                select: {
                  clientName: true,
                  user: { select: { name: true } }
                }
              },
              masseuse: {
                select: {
                  masseuseName: true,
                  user: { select: { name: true } }
                }
              },
              location: { select: { name: true } },
              massage: { select: { type: true } }
            },
            orderBy: { appointmentDate: 'desc' },
            take: 10
          });

          return appointments.map(appointment => {
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
              date: appointment.appointmentDate.toISOString(),
              customerName: appointment.client.user?.name || appointment.client.clientName,
              masseuseName: appointment.masseuse.user?.name || appointment.masseuse.masseuseName,
              service: appointment.massage.type,
              duration: `${appointment.duration} min`,
              status,
              location: appointment.location.name
            };
          });
        })()
      ]);

      return { stats, metrics, appointments };
    });

    // Cache the result for 30 seconds
    setCachedData(cacheKey, dashboardData, 30000);

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("Error fetching optimized dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
