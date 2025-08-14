import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CustomerAppointmentsClient from "./CustomerAppointmentsClient";

export default async function CustomerAppointmentsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <CustomerAppointmentsClient />;
}
