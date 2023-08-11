import { Suspense } from "react";
import { cookies } from "next/headers";

import { Roboto } from "next/font/google";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Loader from "@/app/components/Loader";

import "@/app/globals.css";

import { stripe } from "@/libs/stripe";

import SupabaseProvider from "@/providers/SupabaseProvider";
import SupabaseAuthProvider from "@/providers/SupabaseAuthProvider";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/SupabaseServer";

const font = Roboto({ subsets: ["latin"], weight: "100" });

export const metadata = {
  title: "Tholattice Dashboard",
  description: "Tholattice Company Dashboard",
  icons: {
    icon: "/icon.ico",
  },
};

// const getUser = async () => {
//   const {data: {user}} = await supabase.auth.getUser()
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = createServerComponentClient<Database>({ cookies });
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: listCustomers } = await stripe.customers.list();
  // const listInvoices = await stripe.invoices.list();
  // const listSubscriptions = await stripe.subscriptions.list({ status: "all" });

  return (
    <html lang="en">
      <body className={font.className}>
        <SupabaseProvider>
          <SupabaseAuthProvider serverSession={session}>
            <div className="justify-between bg-white">
              <Sidebar />
            </div>
            <main className="flex flex-col space-y-16 ml-20 min-h-screen">
              <Header customers={...listCustomers} />
              {/* <Header /> */}
              <Suspense fallback={<Loader />}>{children}</Suspense>
            </main>
          </SupabaseAuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

// TODO: Add favicons generation to Tholattice dashboard,home, and sites route
