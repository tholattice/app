"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
// import ModalProvider from "@/ui/modals/provider";
// TODO: Implement this later

export default function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      {/* <ModalProvider>{children}</ModalProvider> */}
      {children}
    </SessionProvider>
  );
}
