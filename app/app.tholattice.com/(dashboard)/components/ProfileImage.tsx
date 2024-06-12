import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

export default async function ProfileImage() {
  const session = await getSession();
  console.log("This is the session from the Profile Image", { session });
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-between">
      <Link
        href="/finances"
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
        <Image
          src={
            session.user?.image ??
            "https://media-be.chewy.com/wp-content/uploads/2021/05/27135654/Shiba-Inu_FeaturedImage-1024x615.jpg"
          }
          width={40}
          height={40}
          alt={session.user?.name ?? "User avatar"}
          className="h-6 w-6 rounded-full"
        />
        <span className="truncate text-sm font-medium">
          {session.user?.email}
        </span>
      </Link>
      {/* <LogoutButton /> */}
    </div>
  );
}
