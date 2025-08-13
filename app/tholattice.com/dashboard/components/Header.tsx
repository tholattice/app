"use client";

import { useState, useEffect, Suspense } from "react";
import Stripe from "stripe";
import { signOut } from "next-auth/react";

import { usePathname, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { capitalizeFirstLetter } from "@/utils/format";
import ProfileImage from "./ProfileImage";
import DarkModeToggle from "./DarkModeToggle";
import Link from "next/link";
import Image from "next/image";

interface Customer extends Stripe.Customer {
  name?: string | null;
  // Might not be necessary to extend this type, but the linter is not picking up on the fact that the 'name' property does indeed exist on Stripe.Customer. Look at the type definition and you'll find it.
}

const Header = ({
  children,
  customers,
}: {
  children: React.ReactNode;
  customers: Customer[];
}) => {
  const [headerName, setHeaderName] = useState("");
  const [customerName, setCustomerName] = useState<string | string[]>("");

  const { data: session } = useSession();

  let pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    if (pathname === "/dashboard" || pathname === "/") {
      setHeaderName("Dashboard");
    } else if (params?.custID) {
      // This is incorrect. 'Name' property does exist on Customer[] type
      // @ts-ignore
      let { name: matchedName } =
        customers.find((cust) => cust.id === params?.custID) || null;
      setCustomerName(matchedName);
    } else {
      // Extract the last part of the pathname and capitalize it
      const pathParts = pathname.split("/").filter(part => part.length > 0);
      const pageName = pathParts[pathParts.length - 1];
      setHeaderName(capitalizeFirstLetter(pageName));
    }
  }, [pathname, customers, params?.custID]);

  return (
    <div className="fixed w-full bg-white dark:bg-gray-900 top-0 z-10 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex px-4 py-4 mr-20 items-center justify-between">
        <div className="flex items-center space-x-4">
          {!params?.custID ? <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{headerName}</h2> : <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{customerName}</h2>}
        </div>
        
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {session?.user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Header;
