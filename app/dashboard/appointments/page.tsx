import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AppointmentsClient from "./AppointmentsClient";

export const metadata = {
  title: "Appointments",
  description: "Manage appointments",
};

export default async function AppointmentsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <AppointmentsClient />;
}
