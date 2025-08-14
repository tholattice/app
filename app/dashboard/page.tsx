import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardOverview from "./components/DashboardOverview";
import BusinessMetrics from "./components/BusinessMetrics";
import RecentAppointments from "./components/RecentAppointments";
import QuickActions from "./components/QuickActions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

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
            <DashboardOverview />
            <BusinessMetrics />
            <RecentAppointments />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
