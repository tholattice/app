import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <SettingsClient />;
}
