import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewCustomerClient from "./NewCustomerClient";

export default async function NewCustomerPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <NewCustomerClient />;
}
