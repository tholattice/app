"use client";

import Link from "next/link";
import { Button } from "@material-tailwind/react";

import { josefin, mrDeHaviland } from "../fonts/fonts";
import { cn } from "@/utils/merge";
import GalleryGrid from "./GalleryGrid";

const Gallery = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 py-8 w-full xl:max-w-6xl m-auto">
      {/* Header */}
      <div>
        <h1
          className={cn(
            "text-center capitalize text-4xl leading-8 pb-4 tracking-wide text-pink-100",
            mrDeHaviland.className
          )}
        >
          Our Gallery
        </h1>
        <h2 className="text-center leading-8 text-3xl sm:text-4xl text-black text-opacity-90 pb-4 uppercase">
          Premium Massage Center
        </h2>
      </div>
      {/* Gallery Menu */}
      {/* Optional Menu. Commented Out for Now. */}
      {/* <div className="flex flex-row gap-8 uppercase">
        <h3>Beauty</h3>
        <h3>Massage</h3>
        <h3>Relaxation</h3>
        <h3>Therapy</h3>
      </div> */}
      <GalleryGrid />
      <div>
        <Link className="group transition-all duration-[400ms]" href="/blog">
          <Button
            className={cn(
              josefin.className,
              "bg-pink-100 group-hover:bg-gray-100 duration-[400ms]"
            )}
            style={{ boxShadow: "none", borderRadius: "0px" }}
            size="lg"
          >
            <h3 className="font-extrabold text-md text-white opacity-90 group-hover:text-black duration-[400ms]">
              View More
            </h3>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Gallery;
