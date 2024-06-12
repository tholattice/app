"use client";

// import { useState } from "react";
// import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import Image from "next/image";
import Link from "next/link";

// import { motion } from "framer-motion";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

import { cn } from "@/utils/merge";
import useScroll from "@/hooks/use-scroll";

import { useTranslationContext } from "../app/tholattice.com/providers";
// import { ChevronDown } from "lucide-react";

export const navItems = [
  {
    englishName: "Testimonials",
    chineseName: "过去客户",
    slug: "testimonials",
  },
  {
    englishName: "Services",
    chineseName: "服务",
    slug: "services",
  },
  {
    englishName: "Pricing",
    chineseName: "价钱",
    slug: "pricing",
  },
  {
    englishName: "About",
    chineseName: "关于",
    slug: "about",
  },
  // {
  //   englishName: "Blog",
  //   chineseName: "博客",
  //   slug: "blog",
  // },
  {
    englishName: "Contact",
    chineseName: "接触",
    slug: "contact",
  },
];

export const languages = [
  {
    name: "官话",
    code: "zh-CN",
  },
  {
    name: "English",
    code: "en",
  },
];

// TODO: May want to include these constants in a separate folder, especially the languages where you can import them to your providers file

const Header = () => {
  // const [nav, setNav] = useState(false);
  const { language, setLanguage } = useTranslationContext();
  const scrolled = useScroll(70);

  // const handleNav = () => {
  //   setNav(!nav);
  // };

  return (
    <header
      lang={language}
      className={cn(`w-full sticky top-0 z-30 transition-all`, {
        "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
      })}
    >
      <div className="flex h-14 max-w-screen-xl p-4 px-4 lg:px-18 w-full m-auto justify-between items-center font-medium text-sm">
        <div className="flex items-center">
          <div className="flex flex-row justify-between items-center space-x-2">
            <div>
              <Link href="/">
                <Image
                  alt="Tholattice Digital Marketing Logo"
                  className="cursor-pointer bg-transparent"
                  height={250}
                  width={250}
                  priority
                  style={{ width: "100%", height: "auto" }}
                  src="/Tholattice_HorizontalChinese_111322.png"
                  // objectFit="contain"
                />
              </Link>
            </div>
            <div className="">
              <NavigationMenuPrimitive.Root
                delayDuration={0}
                className="relative hidden lg:block"
              >
                <NavigationMenuPrimitive.List className="flex flex-row space-x-2 p-2">
                  <NavigationMenuPrimitive.Item>
                    {/* <NavigationMenuPrimitive.Trigger className="group flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none"> */}
                    <button
                      onClick={() =>
                        setLanguage(language === "zh-CN" ? "en" : "zh-CN")
                      }
                    >
                      <p className="text-sm font-medium rounded-md mx-2 px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors ease-out group-hover:text-black">
                        {language === "zh-CN" ? "English" : "官话"}
                      </p>
                    </button>

                    {/* <ChevronDown className="h-4 w-4 transition-all group-data-[state=open]:rotate-180" /> */}
                    {/* </NavigationMenuPrimitive.Trigger> */}

                    <NavigationMenuPrimitive.Content>
                      <div className="grid w-[16rem] grid-cols-1 gap-1 p-3">
                        {languages.map((lang) => (
                          <button
                            key={lang.name}
                            onClick={() => setLanguage(lang.code)}
                            className="text-sm text-left font-medium text-gray-700"
                          >
                            <div className="rounded-lg p-3 transition-colors hover:bg-gray-100 active:bg-gray-200">
                              {lang.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </NavigationMenuPrimitive.Content>
                  </NavigationMenuPrimitive.Item>
                  {/* This is where the mobile dropdown goes in, I think? */}
                  {/* <div className="hidden lg:flex">
                    <nav>
                      <ul className="lg:flex"> */}
                  {navItems.map(({ englishName, chineseName, slug }) => (
                    <NavigationMenuPrimitive.Item key={slug} asChild>
                      <Link id={`nav-${slug}`} key={slug} href={`/${slug}`}>
                        <li
                          className={`rounded-md px-2 py-2 text-sm ${
                            language === "zh-CN" ? "font-normal" : "font-medium"
                          } text-gray-600 transition-colors ease-out hover:text-black`}
                        >
                          {language === "zh-CN" ? chineseName : englishName}
                        </li>
                      </Link>
                    </NavigationMenuPrimitive.Item>
                  ))}
                  {/* </ul>
                    </nav>
                  </div> */}
                </NavigationMenuPrimitive.List>
                <NavigationMenuPrimitive.Viewport className="absolute left-0 top-full flex w-[var(--radix-navigation-menu-viewport-width)] origin-[top_center] justify-start rounded-lg border border-gray-200 bg-white shadow-lg data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content" />
              </NavigationMenuPrimitive.Root>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <Link
            className="animate-fade-in rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black"
            id="nav-login"
            href="/login"
          >
            {language === "zh-CN" ? "登录" : "Log In"}
          </Link>

          <Link
            id="nav-register"
            href="/register"
            className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
          >
            {language === "zh-CN" ? "报名" : "Sign Up"}
          </Link>
        </div>

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
