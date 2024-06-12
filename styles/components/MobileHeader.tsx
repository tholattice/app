"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { ChevronDown, Menu, X } from "lucide-react";
import { Menu, X } from "lucide-react";

import { cn } from "@/utils/merge";

import { navItems } from "./Header";
import { useMobileMenuContext } from "@/app/[domain]/providers";

export const mobileNavLoginItems = [
  {
    englishName: "Log In",
    slug: "login",
  },
  {
    englishName: "Sign Up",
    slug: "register",
  },
];

const MobileHeader = () => {
  // const [open, setOpen] = useState(false);
  const { open, setOpen } = useMobileMenuContext();
  // prevent body scroll when modal is open
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (open) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
      html.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      body.style.overflow = "auto";
      html.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "right-3 top-12 z-40 rounded-full p-2 transition-colors duration-200 hover:bg-gray-200 focus:outline-none active:bg-gray-300 lg:hidden",
          open && "hover:bg-gray-100 active:bg-gray-200"
        )}
      >
        {open ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Actual Mobile Menu */}
      <nav
        className={cn(
          "fixed h-screen inset-0 z-30 hidden w-full bg-white px-5 py-16 lg:hidden",
          open && "block",
          open && "h-screen min-h-full fixed top-0 bottom-0"
        )}
      >
        <ul className="grid divide-y divide-gray-200 p-4 pt-8">
          {navItems.map(({ englishName, slug }) => (
            <div key={slug} className="grid gap-3">
              <li className="my-3 w-full">
                <Link
                  href={`/${slug}`}
                  onClick={() => setOpen(!open)}
                  className={`flex w-full font-semibold capitalize`}
                >
                  {englishName}
                </Link>
              </li>
              {/* <span className="my-3 h-px w-full bg-gray-300" /> */}
            </div>
          ))}
          {/* Login/Signup Links */}
          {mobileNavLoginItems.map(({ englishName, slug }) => (
            <div key={slug} className="grid gap-3">
              <li className="my-3 w-full">
                <Link
                  href={`/${slug}`}
                  onClick={() => setOpen(!open)}
                  className={`flex w-full font-semibold capitalize`}
                >
                  {englishName}
                </Link>
              </li>
              {/* <span className="my-3 h-px w-full bg-gray-300" /> */}
            </div>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default MobileHeader;
