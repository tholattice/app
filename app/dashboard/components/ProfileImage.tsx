"use client";

import { useState, useEffect, memo } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface ProfileImageProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Skeleton loader component
const ProfileSkeleton = ({ size, className }: { size: string; className: string }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex-shrink-0 ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`}>
      <div className={`${sizeClasses[size as keyof typeof sizeClasses]} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse border-2 border-gray-200 dark:border-gray-600`} />
    </div>
  );
};

const ProfileImage = memo(function ProfileImage({ size = "md", className = "" }: ProfileImageProps) {
  const { data: session, status } = useSession();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Show skeleton while loading
  if (status === "loading") {
    return <ProfileSkeleton size={size} className={className} />;
  }

  // If user has an image and no error, show the image
  if (session?.user?.image && !imageError) {
    return (
      <div className={`flex-shrink-0 ${sizeClasses[size]} ${className}`}>
        <Image
          src={session.user.image}
          alt={session.user.name || "Profile"}
          width={size === "sm" ? 32 : size === "md" ? 40 : 48}
          height={size === "sm" ? 32 : size === "md" ? 40 : 48}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          priority={size === "lg"} // Prioritize larger images
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
        />
        {/* Show skeleton while image is loading */}
        {!imageLoaded && <ProfileSkeleton size={size} className="absolute inset-0" />}
      </div>
    );
  }

  // If user has a name, show initials
  if (session?.user?.name) {
    return (
      <div className={`flex-shrink-0 ${sizeClasses[size]} ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full ${getAvatarColor(session.user.name)} flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105`}>
          <span className="text-white font-medium text-sm select-none">
            {getInitials(session.user.name)}
          </span>
        </div>
      </div>
    );
  }

  // Fallback to generic user icon
  return (
    <div className={`flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105`}>
        <UserIcon className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
      </div>
    </div>
  );
});

export default ProfileImage;
