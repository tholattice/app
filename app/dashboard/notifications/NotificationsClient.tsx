"use client";

import { useRouter } from "next/navigation";

export default function NotificationsClient() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage appointment notifications and alerts
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.84 0 1.6.37 2.12.97l-7.07 7.07-7.07-7.07zM4.19 19.81A2 2 0 016.03 21h11.94c.84 0 1.6-.37 2.12-.97l-7.07-7.07-7.07 7.07z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Notification Management</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This feature is coming soon. You&apos;ll be able to manage notifications here.
            </p>
            <div className="mt-6">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
