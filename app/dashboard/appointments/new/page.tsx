import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewAppointmentClient from "./NewAppointmentClient";

export const metadata = {
  title: "New Appointment",
  description: "Create a new appointment",
};

export default async function NewAppointmentPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <NewAppointmentClient />;
}
