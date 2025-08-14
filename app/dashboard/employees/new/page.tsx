import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewEmployeeClient from "./NewEmployeeClient";

export default async function NewEmployeePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <NewEmployeeClient />;
}

