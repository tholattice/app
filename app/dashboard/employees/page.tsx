import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EmployeeList from "./components/EmployeeList";
import EmployeePermissions from "./components/EmployeePermissions";
import EmployeeSchedule from "./components/EmployeeSchedule";

export default async function EmployeesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Manage your employees, their schedules, and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <EmployeeList />
            <EmployeeSchedule />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            <EmployeePermissions />
          </div>
        </div>
      </div>
    </div>
  );
}
