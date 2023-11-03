"use client";

import { ReactNode, useEffect, useRef } from "react";
// import { useSession } from "next-auth/react";

import { motion, useCycle } from "framer-motion";

import Link from "next/link";
// import { useParams } from "next/navigation";

import { languages, navItems } from "./Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";

import { useTranslationContext } from "../providers";

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

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute rounded-full p-2 transition-colors duration-200 focus:outline-none right-5 top-3 z-40"
  >
    <svg width="20" height="20" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dimensions.current;
};

export default function MobileHeader() {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const { language, setLanguage } = useTranslationContext();

  //   const { data: session, status } = useSession() || {
  //     status: "unauthenticated", // if `useSession` is undefined, we're on a non dub.co domain
  //   };

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className={`fixed inset-0 z-50 w-full lg:hidden ${
        isOpen ? "" : "pointer-events-none"
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-white"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16"
      >
        {/* <motion.li className=""> */}
        <MenuItem>
          <Accordion type="single" collapsible>
            <AccordionItem value={language} className="!py-0">
              <AccordionTrigger className="font-normal flex w-full capitalize">
                {language === "zh-CN" ? "官话" : "English"}
              </AccordionTrigger>
              <AccordionContent className="grid gap-1">
                {languages.map((lang) => (
                  <div key={lang.name}>
                    <button
                      onClick={() => {
                        setLanguage(lang.code);
                        toggleOpen();
                        // setOpen(false);
                      }}
                      className="flex w-full space-x-2 pt-4 indent-2"
                    >
                      <span className="capitalize">{lang.name}</span>
                    </button>

                    {/* <MenuItem className="my-3 h-px w-1/2 bg-gray-300" /> */}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </MenuItem>
        {/* </motion.li> */}
        <MenuItem className="my-3 h-px w-full bg-gray-300" />
        {navItems.map(({ englishName, chineseName, slug }) => (
          <div key={slug} className="grid gap-3">
            <MenuItem>
              <Link
                href={`/${slug}`}
                onClick={() => toggleOpen()}
                className={`flex w-full ${
                  language === "zh-CN" ? "font-normal" : "font-semibold"
                }capitalize`}
              >
                {language === "zh-CN" ? chineseName : englishName}
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />
          </div>
        ))}

        {/* Login/Signup Links */}
        {mobileNavLoginItems.map(({ englishName, chineseName, slug }) => (
          <div key={slug} className="grid gap-3">
            <MenuItem>
              <Link
                href={`/${slug}`}
                onClick={() => toggleOpen()}
                className={`flex w-full ${
                  language === "zh-CN" ? "font-normal" : "font-semibold"
                }capitalize`}
              >
                {language === "zh-CN" ? chineseName : englishName}
              </Link>
            </MenuItem>{" "}
            <MenuItem className="my-3 h-px w-full bg-gray-300" />
          </div>
        ))}

        {/* {session ? (
          <MenuItem key="Dashboard">
            <Link
              href={APP_DOMAIN}
              className="flex w-full font-semibold capitalize"
            >
              Dashboard
            </Link>
          </MenuItem>
        ) : status === "unauthenticated" ? (
          <>
            <MenuItem key="Login">
              <Link
                href={`${APP_DOMAIN}/login`}
                className="flex w-full font-semibold capitalize"
              >
                Log in
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />

            <MenuItem key="Signup">
              <Link
                href={`${APP_DOMAIN}/register`}
                className="flex w-full font-semibold capitalize"
              >
                Sign Up
              </Link>
            </MenuItem>
          </>
        ) : null} */}
      </motion.ul>
      <MenuToggle toggle={toggleOpen} />
    </motion.nav>
  );
}
