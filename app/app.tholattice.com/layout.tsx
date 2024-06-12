import "@/globals.css";
import Providers from "./providers";
import { getServerSession } from "next-auth";
// import { useSession } from "next-auth/react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  // console.log(
  //   `This is the session from the server: ${JSON.stringify(session)}`
  // );
  // console.log(`This is the session: ${session?.user?.email}`);
  const todaysDate = new Date();
  const nextThreeDays = new Date(todaysDate.setDate(todaysDate.getDate() + 3));

  return <Providers session={session}>{children}</Providers>;
}
