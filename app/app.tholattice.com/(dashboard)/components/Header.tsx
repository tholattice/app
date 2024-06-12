"use client";

import { useState, useEffect, Suspense } from "react";
import Stripe from "stripe";

import { usePathname, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { capitalizeFirstLetter } from "@/utils/format";
import ProfileImage from "./ProfileImage";
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
  // const Header = () => {
  const [headerName, setHeaderName] = useState("");
  const [customerName, setCustomerName] = useState<string | string[]>("");

  const { data: session } = useSession();
  // console.log(
  //   `This is the session as it appears in the header: ${JSON.stringify(
  //     session
  //   )}`
  // );

  let pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    if (pathname === "/") {
      setHeaderName("Dashboard");
    } else if (params?.custID) {
      // This is incorrect. 'Name' property does exist on Customer[] type
      // @ts-ignore
      let { name: matchedName } =
        customers.find((cust) => cust.id === params?.custID) || null;
      setCustomerName(matchedName);
    } else {
      setHeaderName(capitalizeFirstLetter(pathname.replace("/", "")));
    }
  }, [pathname, customers, params?.custID]);

  return (
    <div className="fixed w-full bg-white top-0">
      <div className="flex px-4 py-4 mr-20 items-center justify-between">
        {!params?.custID ? <h2>{headerName}</h2> : <h2>{customerName}</h2>}
        {/* <h2>Welcome back, Alex</h2> */}
        {/* <ProfileImage /> */}
        {children}
      </div>
    </div>
  );
};

export default Header;
