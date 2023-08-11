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

const routes = [
  {
    label: "Pipeline",
    icon: <GiWarpPipe size={20} />,
    href: "/pipeline",
  },
  {
    label: "Finances",
    icon: <BsCurrencyDollar size={20} />,
    href: "/finances",
  },
  {
    label: "Customers",
    icon: <RxPerson size={20} />,
    href: "/customers",
  },
  {
    label: "Marketing",
    icon: <LiaWeixin size={20} />,
    href: "/marketing",
  },
  {
    label: "Mobile",
    icon: <AiOutlineMobile size={20} />,
    href: "/mobile",
  },
  {
    label: "Website",
    icon: <CgWebsite size={20} />,
    href: "/website",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const basePath = capitalizeFirstLetter(pathname.split("/")[1]);

  return (
    <div className="flex">
      <div className="flex flex-col justify-start items-center fixed w-20 h-screen p-4 bg-white border-r-[1px] overflow-y-auto">
        <Link href="/">
          <div className="bg-white p-1/2 text-white rounded-lg cursor-pointer">
            <Image
              src="/TholatticeSymbolWhiteBG.png"
              width={50}
              height={50}
              alt="Tholattice Logo"
            />
          </div>
        </Link>
        <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
        {routes.map((route) => (
          <Link className="my-3" href={route.href} key={route.label}>
            <div
              className={cn(
                "hover:bg-gray-100 cursor-pointer transition p-3 rounded-lg",
                basePath === route.label ? "bg-gray-100" : "bg-white"
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
