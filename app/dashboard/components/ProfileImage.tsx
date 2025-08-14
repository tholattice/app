"use client";

import { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

interface ProfileImageProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProfileImage({ size = "md", className = "" }: ProfileImageProps) {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // If user has an image and no error, show the image
  if (session?.user?.image && !imageError) {
    return (
      <div className={`flex-shrink-0 ${sizeClasses[size]} ${className}`}>
        <img
          src={session.user.image}
          alt={session.user.name || "Profile"}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-600`}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // If user has a name, show initials
  if (session?.user?.name) {
    return (
      <div className={`flex-shrink-0 ${sizeClasses[size]} ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full ${getAvatarColor(session.user.name)} flex items-center justify-center border-2 border-gray-200 dark:border-gray-600`}>
          <span className="text-white font-medium text-sm">
            {getInitials(session.user.name)}
          </span>
        </div>
      </div>
    );
  }

  // Fallback to generic user icon
  return (
    <div className={`flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600`}>
        <UserIcon className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
      </div>
    </div>
  );
}
