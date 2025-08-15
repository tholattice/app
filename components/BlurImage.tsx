"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

export default function BlurImage(props: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(props.src || "");
  
  useEffect(() => {
    // Only update src if it's a valid string and not empty
    if (props.src && typeof props.src === 'string' && props.src.trim() !== '') {
      setSrc(props.src);
    }
  }, [props.src]);

  // Don't render if src is empty or invalid
  if (!src || src === "") {
    return (
      <div 
        className={`${props.className || ''} bg-gray-200 dark:bg-gray-700 animate-pulse`}
        style={{ 
          width: props.width || 100, 
          height: props.height || 100 
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt || "Image"}
      className={`${props.className || ''} ${loading ? "blur-[2px]" : "blur-0"} transition-all duration-300`}
      onLoadingComplete={async () => {
        setLoading(false);
      }}
      onError={() => {
        setLoading(false);
        // Set a fallback image or show error state
        setSrc("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E");
      }}
    />
  );
}
