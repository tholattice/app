import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Loader from "@/components/Loader";
import CustomerDetailClient from "./CustomerDetailClient";

export const metadata = {
  title: "Customer Details - Tholattice Dashboard",
  description: "Customer details and appointment history",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ custID: string }>;
}) {
  const session = await auth();
  const { custID } = await params;

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<Loader />}>
      <CustomerDetailClient customerId={custID} />
    </Suspense>
  );
}
