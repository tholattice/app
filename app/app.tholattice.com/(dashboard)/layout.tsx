import { Suspense } from "react";
import { Roboto } from "next/font/google";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Loader from "@/components/Loader";

import "@/globals.css";

import { stripe } from "@/lib/stripe";
import ProfileImage from "./components/ProfileImage";

const font = Roboto({ subsets: ["latin"], weight: "100" });

export const metadata = {
  title: "Tholattice Dashboard",
  description: "Tholattice Company Dashboard",
  icons: {
    icon: "/icon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: listCustomers } = await stripe.customers.list();

  return (
    <div className={font.className}>
      <div className="justify-between bg-white">
        <Sidebar />
      </div>
      <main className="flex flex-col space-y-16 ml-20 min-h-screen">
        <Header customers={listCustomers}>
          <ProfileImage />
        </Header>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </main>
    </div>
  );
}

// TODO: Add favicons generation to Tholattice dashboard,home, and sites route
