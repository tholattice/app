import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Loader from "@/components/Loader";

export const metadata = {
  title: "Marketing - Tholattice Dashboard",
  description: "Marketing campaign management and analytics",
};

export default async function MarketingPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketing</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your marketing campaigns and track performance
          </p>
        </div>

        {/* Marketing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+3</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">this month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Reach</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">125K</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+18.5%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+0.8%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">ROI</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">285%</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+12.3%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Campaigns</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Google Ads - Brand Awareness</h4>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Budget:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">$2,500</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Spent:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">$1,850</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Clicks:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">1,247</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">CTR:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">2.8%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Facebook - Lead Generation</h4>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Budget:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">$1,800</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Spent:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">$1,200</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Leads:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">89</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">CPL:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">$13.48</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">LinkedIn - B2B</h4>
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Paused
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Budget:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">$3,000</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Spent:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">$2,100</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Impressions:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">45K</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Engagement:</span>
                    <span className="font-medium ml-1 text-gray-900 dark:text-white">4.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Channel Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Google Ads</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">$8,500</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Facebook</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">$6,200</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">LinkedIn</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">$4,800</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Email Marketing</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">$3,100</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Calendar */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Holiday Promotion</h4>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Scheduled
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Christmas and New Year special offers</p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>Start: Dec 20, 2023</span>
                <br />
                <span>Budget: $5,000</span>
              </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Q1 Product Launch</h4>
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Planning
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">New service line introduction</p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>Start: Jan 15, 2024</span>
                <br />
                <span>Budget: $8,000</span>
              </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Spring Refresh</h4>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Ready
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Seasonal brand refresh campaign</p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>Start: Mar 1, 2024</span>
                <br />
                <span>Budget: $3,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
