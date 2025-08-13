"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfileImage = () => {
  const { data: session } = useSession();

  if (!session?.user?.image) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={session.user.image}
      alt={session.user.name || "Profile"}
      width={32}
      height={32}
      className="rounded-full"
    />
  );
};

export default ProfileImage;
