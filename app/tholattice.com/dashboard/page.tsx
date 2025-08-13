import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {session.user?.name || session.user?.email}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your massage business from one central dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Customers
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active customers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            This Month&apos;s Revenue
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">$0</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">From appointments</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Upcoming Appointments
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">0</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Next 7 days</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">Add New Customer</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Create a new customer profile</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">Schedule Appointment</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Book a new appointment</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">View Analytics</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Check business performance</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
