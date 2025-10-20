import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for better code splitting
const DashboardOverview = dynamic(() => import("./components/DashboardOverview"), {
  loading: () => <Loader />,
  ssr: true
});

const BusinessMetrics = dynamic(() => import("./components/BusinessMetrics"), {
  loading: () => <Loader />,
  ssr: true
});

const RecentAppointments = dynamic(() => import("./components/RecentAppointments"), {
  loading: () => <Loader />,
  ssr: true
});

const QuickActions = dynamic(() => import("./components/QuickActions"), {
  loading: () => <Loader />,
  ssr: true
});
import Loader from "@/components/Loader";

// Cache dashboard data for 30 seconds
export const revalidate = 30;

async function getDashboardData(userId: string) {
  try {

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
    const [
      stats,
      metrics,
      appointments
    ] = await Promise.all([
      // Stats query
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

        const appointments = await prisma.appointment.findMany({
          where: { locationId: { in: locationIds } },
          select: { duration: true }
        });

        const totalRevenue = appointments.reduce((sum, appt) => sum + (appt.duration * 80), 0);

        return { totalAppointments, totalCustomers, totalRevenue, upcomingAppointments };
      })(),

      // Metrics query
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

      // Recent appointments query
      (async () => {
        const appointments = await prisma.appointment.findMany({
          where: { locationId: { in: locationIds } },
          include: {
            client: { include: { user: { select: { name: true } } } },
            masseuse: { include: { user: { select: { name: true } } } },
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
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export default async function DashboardPage() {
  const session = await auth();

  // Re-enable authentication
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const dashboardData = await getDashboardData(userId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {session?.user?.name || "Business Owner"}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage your massage business, appointments, and employees
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<Loader />}>
              <DashboardOverview initialStats={dashboardData.stats} />
            </Suspense>
            <Suspense fallback={<Loader />}>
              <BusinessMetrics initialMetrics={dashboardData.metrics} />
            </Suspense>
            <Suspense fallback={<Loader />}>
              <RecentAppointments initialAppointments={dashboardData.appointments} />
            </Suspense>
          </div>
          <div className="lg:col-span-1">
            <Suspense fallback={<Loader />}>
              <QuickActions />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
