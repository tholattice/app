"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/merge";
import { capitalizeFirstLetter } from "@/utils/format";

import { RxPerson } from "react-icons/rx";
import { AiOutlineMobile } from "react-icons/ai";
import { BsCurrencyDollar } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { GiWarpPipe } from "react-icons/gi";
import { LiaWeixin } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";

const routes = [
  {
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    href: "/dashboard",
  },
  {
    label: "Pipeline",
    icon: <GiWarpPipe size={20} />,
    href: "/dashboard/pipeline",
  },
  {
    label: "Finances",
    icon: <BsCurrencyDollar size={20} />,
    href: "/dashboard/finances",
  },
  {
    label: "Customers",
    icon: <RxPerson size={20} />,
    href: "/dashboard/customers",
  },
  {
    label: "Marketing",
    icon: <LiaWeixin size={20} />,
    href: "/dashboard/marketing",
  },
  {
    label: "Mobile",
    icon: <AiOutlineMobile size={20} />,
    href: "/dashboard/mobile",
  },
  {
    label: "Website",
    icon: <CgWebsite size={20} />,
    href: "/dashboard/website",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  
  // Check if current path matches the route
  const isActiveRoute = (routeHref: string) => {
    if (routeHref === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === routeHref;
  };

  return (
    <div className="flex">
      <div className="flex flex-col justify-start items-center fixed w-20 h-screen p-4 bg-white dark:bg-gray-900 border-r-[1px] border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors duration-200">
        <Link href="/">
          <div className="bg-white dark:bg-gray-900 p-1/2 text-white rounded-lg cursor-pointer">
            <Image
              src="/TholatticeSymbolWhiteBG.png"
              width={50}
              height={50}
              alt="Tholattice Logo"
            />
          </div>
        </Link>
        <span className="border-b-[1px] border-gray-200 dark:border-gray-700 w-full p-2"></span>
        {routes.map((route) => (
          <Link className="my-3" href={route.href} key={route.label}>
            <div
              className={cn(
                "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition p-3 rounded-lg text-gray-600 dark:text-gray-300",
                isActiveRoute(route.href) ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-white dark:bg-gray-900"
              )}
            >
              {route.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
