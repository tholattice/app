import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <AnalyticsClient />;
}
