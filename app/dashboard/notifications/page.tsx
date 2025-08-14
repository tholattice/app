import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <NotificationsClient />;
}
