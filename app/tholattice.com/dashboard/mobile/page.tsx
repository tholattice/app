import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Loader from "@/components/Loader";

export const metadata = {
  title: "Mobile - Tholattice Dashboard",
  description: "Mobile app analytics and management",
};

export default async function MobilePage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mobile</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Monitor your mobile app performance and user engagement
          </p>
        </div>

        {/* Mobile App Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12.5K</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+15.2%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8.2K</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+8.7%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Session Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.2m</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+12.3%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Crash Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0.8%</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-red-600 dark:text-red-400 text-sm font-medium">+0.2%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* App Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">App Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Load Time</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">1.2s</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 dark:bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: &lt;1.5s</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Memory Usage</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">45MB</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-600 dark:bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: &lt;50MB</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Battery Impact</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Low</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 dark:bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Excellent performance</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Engagement</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Daily Active Users</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">3.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Weekly Active Users</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">5.8K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Active Users</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">8.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Retention Rate (30d)</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">68%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-300">iOS</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">58%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Android</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">42%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">App Store Ratings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">App Store</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">4.2/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Google Play</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">4.0/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent App Updates</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Version 2.1.0 - Performance Improvements</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Improved app loading times and reduced memory usage by 15%</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Released: Dec 15, 2023</span>
                  <span>Downloads: 2.1K</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Version 2.0.5 - Bug Fixes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Fixed crash issues and improved overall stability</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Released: Dec 8, 2023</span>
                  <span>Downloads: 1.8K</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Version 2.0.0 - Major Update</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Complete UI redesign and new features including dark mode</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Released: Nov 25, 2023</span>
                  <span>Downloads: 3.5K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
