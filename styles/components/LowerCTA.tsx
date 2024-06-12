"use client";

import Link from "next/link";
import { Button } from "@material-tailwind/react";

import { josefin } from "../fonts/fonts";
import { cn } from "@/utils/merge";

const LowerCTA = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center p-4 py-8">
      <div>
        <h1 className="text-center capitalize">Our Special Offer</h1>
        <h2 className="text-center uppercase">You Owe Yourself This Moment</h2>
      </div>
      <div>
        <Link
          className="group transition-all duration-[400ms]"
          href="/schedule-appointment"
        >
          <Button
            className={cn(
              josefin.className,
              "bg-pink-100 group-hover:bg-gray-100 duration-[400ms]"
            )}
            style={{ boxShadow: "none", borderRadius: "0px" }}
            size="lg"
          >
            <h3 className="font-extrabold text-md text-white opacity-90 group-hover:text-black duration-[400ms]">
              Make an Appointment
            </h3>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LowerCTA;
