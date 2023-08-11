"use client";

import { useState, useEffect, Suspense } from "react";
import Stripe from "stripe";

import { usePathname, useParams } from "next/navigation";

import { capitalizeFirstLetter } from "@/utils/format";

interface Customer extends Stripe.Customer {
  name?: string | null;
  // Might not be necessary to extend this type, but the linter is not picking up on the fact that the 'name' property does indeed exist on Stripe.Customer. Look at the type definition and you'll find it.
}

const Header = ({ customers }: { customers: Customer[] }) => {
  // const Header = () => {
  const [headerName, setHeaderName] = useState("");
  const [customerName, setCustomerName] = useState<string | string[]>("");

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
      <div className="flex px-4 py-4 mr-20 justify-between">
        {!params?.custID ? <h2>{headerName}</h2> : <h2>{customerName}</h2>}
        <h2>Welcome back, Alex</h2>
      </div>
    </div>
  );
};

export default Header;
