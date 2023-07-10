import React from "react";

import Link from "next/link";
import Image from "next/image";

import { RxDashboard, RxPerson } from "react-icons/rx";
import { AiOutlineMobile } from "react-icons/ai";
import { BsCurrencyDollar } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { GiWarpPipe } from "react-icons/gi";
// import { MdSocialDistance } from "react-icons/md";
import { LiaWeixin } from "react-icons/lia";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="flex flex-col justify-start items-center fixed w-20 h-screen p-4 bg-white border-r-[1px] overflow-y-auto">
        <Link href="/">
          <div className="bg-white p-1/2 text-white rounded-lg">
            <Image
              src="/TholatticeSymbol.png"
              width={50}
              height={50}
              alt="Tholattice Logo"
            />
          </div>
        </Link>
        <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
        {/* <Link className="my-3" href="/">
          <div className="bg-white hover:bg-gray-100 cursor-pointer p-3 rounded-lg">
            <RxDashboard size={20} />
          </div>
        </Link> */}
        <Link className="my-3" href="/pipeline">
          <div className="bg-white hover:bg-gray-100 cursor-pointer p-3 rounded-lg">
            <GiWarpPipe size={20} />
          </div>
        </Link>
        <Link className="my-3" href="/finances">
          <div className="bg-white hover:bg-gray-100 cursor-pointer p-3 rounded-lg">
            <BsCurrencyDollar size={20} />
          </div>
        </Link>
        <Link className="my-3" href="/customers">
          <div className="bg-white hover:bg-gray-100 cursor-pointer p-3 rounded-lg">
            <RxPerson size={20} />
          </div>
        </Link>
        <Link className="my-3" href="/marketing">
          <div className="bg-white hover:bg-gray-100 cursor-pointer p-3 rounded-lg">
            <LiaWeixin size={20} />
          </div>
        </Link>
        <Link className="my-3" href="/mobile">
          <div className="bg-white hover:bg-gray-100 cursor-pointer p-3 rounded-lg">
            <AiOutlineMobile size={20} />
          </div>
        </Link>
        <Link className="my-3" href="/website">
          <div className="bg-white hover:bg-gray-100 cursor-pointer p-3 rounded-lg">
            <CgWebsite size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
