import { Suspense } from "react";
import { Roboto } from "next/font/google";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Loader from "@/components/Loader";

import "@/globals.css";

// import { stripe } from "@/lib/stripe";
import DashboardClientWrapper from "./DashboardClientWrapper";
import { DarkModeProvider } from "./contexts/DarkModeContext";

const font = Roboto({ subsets: ["latin"], weight: "100" });

export const metadata = {
  title: {
    template: '%s | Tholattice Dashboard',
    default: 'Tholattice Dashboard',
  },
  description: "Tholattice Company Dashboard",
  icons: {
    icon: "/icon.ico",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Re-enable authentication check with JWT sessions
  if (!session) {
    redirect("/login");
  }

  // Temporarily disable Stripe to avoid database errors
  // const { data: listCustomers } = await stripe.customers.list();
  const listCustomers: any[] = [];

  return (
    <DashboardClientWrapper session={session}>
      <DarkModeProvider>
        <div className={`${font.className} bg-white dark:bg-gray-900 transition-colors duration-200`}>
                  <div className="justify-between bg-white dark:bg-gray-900">
          <Sidebar />
        </div>
        <main className="flex flex-col space-y-16 ml-20 min-h-screen bg-gray-50 dark:bg-gray-800">
          <Header customers={listCustomers} />
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </main>
        </div>
      </DarkModeProvider>
    </DashboardClientWrapper>
  );
}

// Note: Favicons generation needed for Tholattice dashboard, home, and sites route
