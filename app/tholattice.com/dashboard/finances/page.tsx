import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Loader from "@/components/Loader";

export const metadata = {
  title: "Finances - Tholattice Dashboard",
  description: "Financial management and reporting",
};

export default async function FinancesPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finances</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your revenue, expenses, and financial performance
          </p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$124,500</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+12.5%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$18,750</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+8.2%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$45,200</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-red-600 dark:text-red-400 text-sm font-medium">+3.1%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$79,300</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+15.8%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Service</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Digital Marketing</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">$45,200</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Website Development</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">$38,500</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">SEO Services</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">$28,300</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Consulting</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">$12,500</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Acme Corp</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Digital Marketing Package</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">+$2,500</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">TechStart Inc</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Website Development</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">+$5,000</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Marketing Tools</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Software Subscription</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">-$150</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Goals */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Revenue Goal</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">$20,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 dark:bg-green-500 h-2 rounded-full" style={{ width: '93.75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">93.75% complete</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Profit Margin Goal</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">65%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: '63.7%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">63.7% current</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Customer Acquisition</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">25/month</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 dark:bg-yellow-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">20 acquired this month</p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
