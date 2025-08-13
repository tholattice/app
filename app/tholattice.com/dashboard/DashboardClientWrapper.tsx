"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export default function DashboardClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
