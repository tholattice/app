"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { ChevronDown, Menu, X } from "lucide-react";
import { Menu, X } from "lucide-react";

import { cn } from "@/utils/merge";

import { languages, navItems } from "./Header";
import { useTranslationContext } from "../app/tholattice.com/providers";

export const mobileNavLoginItems = [
  {
    englishName: "Log In",
    chineseName: "登录",
    slug: "login",
  },
  {
    englishName: "Sign Up",
    chineseName: "报名",
    slug: "register",
  },
];

const NewMobileHeader = () => {
  const [open, setOpen] = useState(false);
  const [openLanguages, setOpenLanguages] = useState(false);
  const { language, setLanguage } = useTranslationContext();

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-3 top-3 z-40 rounded-full p-2 transition-colors duration-200 hover:bg-gray-200 focus:outline-none active:bg-gray-300 lg:hidden",
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
          "fixed inset-0 z-20 hidden w-full bg-white px-5 py-16 lg:hidden",
          open && "block"
        )}
      >
        <ul className="grid divide-y divide-gray-200 p-4">
          <li className="py-3">
            {/* <button
              className="flex w-full justify-between"
              onClick={() => setOpenLanguages(!openLanguages)}
            >
              <p className={"font-normal flex w-full capitalize"}>
                {language === "zh-CN" ? "English" : "官话"}
              </p>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-500 transition-all",
                  openLanguages && "rotate-180"
                )}
              />
            </button> */}
            <button
              className="flex w-full justify-between"
              onClick={() => setLanguage(language === "zh-CN" ? "en" : "zh-CN")}
            >
              <p className="font-normal flex w-full capitalize">
                {language === "zh-CN" ? "English" : "官话"}
              </p>
            </button>
            {openLanguages && (
              <div className="grid gap-4 overflow-hidden py-4">
                {languages.map(({ name, code }) => (
                  <div key={name}>
                    <button
                      onClick={() => {
                        setLanguage(code);
                        setOpenLanguages(!openLanguages);
                      }}
                      className="flex w-full space-x-2 pt-4 indent-2"
                    >
                      <span className="capitalize">{name}</span>
                    </button>

                    {/* <MenuItem className="my-3 h-px w-1/2 bg-gray-300" /> */}
                  </div>
                ))}
              </div>
            )}
          </li>
          {navItems.map(({ englishName, chineseName, slug }) => (
            <div key={slug} className="grid gap-3">
              <li className="my-3 w-full">
                <Link
                  href={`/${slug}`}
                  onClick={() => setOpen(!open)}
                  className={`flex w-full ${
                    language === "zh-CN" ? "font-normal" : "font-semibold"
                  }capitalize`}
                >
                  {language === "zh-CN" ? chineseName : englishName}
                </Link>
              </li>
              {/* <span className="my-3 h-px w-full bg-gray-300" /> */}
            </div>
          ))}
          {/* Login/Signup Links */}
          {mobileNavLoginItems.map(({ englishName, chineseName, slug }) => (
            <div key={slug} className="grid gap-3">
              <li className="my-3 w-full">
                <Link
                  href={`/${slug}`}
                  onClick={() => setOpen(!open)}
                  className={`flex w-full ${
                    language === "zh-CN" ? "font-normal" : "font-semibold"
                  }capitalize`}
                >
                  {language === "zh-CN" ? chineseName : englishName}
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

export default NewMobileHeader;
