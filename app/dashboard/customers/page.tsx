import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Loader from "@/components/Loader";
import CustomersClient from "./CustomersClient";

export const metadata = {
  title: "Customers - Tholattice Dashboard",
  description: "Customer management and analytics",
};

export default async function CustomersPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<Loader />}>
      <CustomersClient />
    </Suspense>
  );
}
