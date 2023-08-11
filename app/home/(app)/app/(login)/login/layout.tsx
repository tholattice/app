import { cookies } from "next/headers";

import { Roboto } from "next/font/google";
import "@/app/globals.css";

import SupabaseProvider from "@/providers/SupabaseProvider";
import SupabaseAuthProvider from "@/providers/SupabaseAuthProvider";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/supabase";
import { cn } from "@/utils/merge";

const font = Roboto({ subsets: ["latin"], weight: "100" });

export const metadata = {
  title: "Tholattice Login",
  description: "Tholattice Login",
  icons: {
    icon: "/icon.ico",
  },
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = createServerComponentClient<Database>({ cookies });

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={font.className}>
        <div
          className={
            "bg-white-900/90 backdrop-blur-sm text-stone-800 fixed drop-shadow-md border border-neutral-700 top-[50%] left-[50%] max-h-full h-full md:h-auto w-full md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-stone-100 p-[25px] focus:outline-none overflow-y-auto"
          }
        >
          {/* <SupabaseProvider>
            <SupabaseAuthProvider serverSession={session}> */}
          {/* <AuthClientProvider> */}
          {children}
          {/* </AuthClientProvider> */}
          {/* </SupabaseAuthProvider>
          </SupabaseProvider> */}
        </div>
      </body>
    </html>
  );
}
