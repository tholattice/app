"use client";

// import { useState } from "react";
// import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import Image from "next/image";
import Link from "next/link";

// import { motion } from "framer-motion";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

// import { cn } from "@/utils/merge";
// import useScroll from "@/hooks/use-scroll";
import { LayoutInterface } from "../layouts/layouts";
import MobileHeader from "./MobileHeader";
import TopHeader from "./TopHeader";

// import { ChevronDown } from "lucide-react";

export const navItems = [
  {
    englishName: "Masseuses",
    slug: "masseuses",
  },
  {
    englishName: "Services",
    slug: "services",
  },
  {
    englishName: "About",
    slug: "about",
  },
  {
    englishName: "Blog",
    slug: "blog",
  },
  {
    englishName: "Location",
    slug: "location",
  },
];

// Note: Consider moving these constants to a separate folder for better organization

const Header = ({ data: props }: { data: LayoutInterface }) => {
  // const [nav, setNav] = useState(false);
  //   const scrolled = useScroll(70);

  // const handleNav = () => {
  //   setNav(!nav);
  // };

  return (
    <header
      className={
        "w-full top-0 transition-all border-b border-gray-200 bg-white/75 backdrop-blur-lg"
      }
    >
      <TopHeader data={props} />
      <div className="flex h-14 max-w-screen-xl p-4 sm:px-8 md:px-12 lg:px-18 w-full m-auto justify-between items-center font-extrabold text-lg">
        <div className="flex items-center">
          <div className="flex flex-row justify-between items-center space-x-2">
            <div>
              <Link href="/">
                {props.logo ? (
                  <Image
                    alt={`${props.name} Logo`}
                    className="cursor-pointer bg-transparent"
                    height={250}
                    width={250}
                    priority
                    style={{ width: "100%", height: "auto" }}
                    //   src={props.logo}
                    src={props.logo}
                    // objectFit="contain"
                  />
                ) : (
                  props.name
                )}
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden items-center lg:flex lg:flex-row">
          <div className="flex flex-row justify-between items-center space-x-2">
            <NavigationMenuPrimitive.Root
              delayDuration={0}
              className="relative hidden lg:block"
            >
              <NavigationMenuPrimitive.List className="flex flex-row space-x-2 p-2">
                {navItems.map(({ englishName, slug }) => (
                  <NavigationMenuPrimitive.Item key={slug} asChild>
                    <Link id={`nav-${slug}`} key={slug} href={`/${slug}`}>
                      <li className="rounded-md px-2 py-2 text-lg font-extrabold text-gray-600 transition-colors ease-out hover:text-black">
                        {englishName}
                      </li>
                    </Link>
                  </NavigationMenuPrimitive.Item>
                ))}
              </NavigationMenuPrimitive.List>
              <NavigationMenuPrimitive.Viewport className="absolute left-0 top-full flex w-[var(--radix-navigation-menu-viewport-width)] origin-[top_center] justify-start rounded-lg border border-gray-200 bg-white shadow-lg data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content" />
            </NavigationMenuPrimitive.Root>
          </div>
          <div className="">
            <Link
              className="animate-fade-in rounded-full px-4 py-1.5 text-lg font-extrabold text-gray-500 transition-colors ease-out hover:text-black"
              id="nav-login"
              href="/login"
            >
              {/* {language === "zh-CN" ? "登录" : "Log In"} */}
              Log In
            </Link>

            <Link
              id="nav-register"
              href="/register"
              className="animate-fade-in rounded-full border border-black font-extrabold bg-black px-4 py-1.5 text-lg text-white transition-all hover:bg-white hover:text-black"
            >
              {/* {language === "zh-CN" ? "报名" : "Sign Up"} */}
              Sign Up
            </Link>
          </div>
        </div>

        <MobileHeader />

        {/* Mobile Button */}
        {/* <div onClick={handleNav} className="block lg:hidden z-10">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div> */}

        {/* Mobile Menu */}
        {/* <div
          className={
            nav
              ? "absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-gray-50 text-center ease-in duration-300 lg:hidden"
              : "absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-gray-50 text-center ease-in duration-300"
          }
        >
          <ul>
            {navItems.map(({ name, slug }) => (
              <Link id={`nav-${slug}`} key={slug} href={`/${slug}`}>
                <li
                  onClick={handleNav}
                  className="p-4 text-4xl transition-colors ease-out hover:text-black"
                >
                  {name}
                </li>
              </Link>
            ))}
            <li
              onClick={handleNav}
              className="p-4 text-4xl transition-colors ease-out hover:text-black"
            >
              Log In
            </li>
            <li
              onClick={handleNav}
              className="p-4 text-4xl transition-colors ease-out hover:text-black"
            >
              Sign Up
            </li>
          </ul>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
