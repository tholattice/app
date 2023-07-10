"use client";

import React from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  let pathname = usePathname();

  function capitalizeFirstLetter(string: String) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (pathname === "/") {
    pathname = "Dashboard";
  } else {
    pathname = capitalizeFirstLetter(pathname.replace("/", ""));
  }

  return (
    <div className="flex justify-between px-4 pt-4">
      <h2>{pathname}</h2>
      <h2>Welcome back, Alex</h2>
    </div>
  );
};

export default Header;
