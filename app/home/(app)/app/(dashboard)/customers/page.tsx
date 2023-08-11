import { stripe } from "@/libs/stripe";
import { unixDateToNative } from "@/utils/format";

import ListCard from "../components/ListCard";

const getCustomers = async () => {
  const { data } = await stripe.customers.list();
  return data;
};

const getInvoices = async () => {
  const { data } = await stripe.invoices.list();
  return data;
};

const getSubscriptions = async () => {
  const { data } = await stripe.subscriptions.list({ status: "all" });
  return data;
};

const Customers = async () => {
  const listCustomers = await getCustomers();
  const listInvoices = await getInvoices();
  const listSubscriptions = await getSubscriptions();

  function checkActive(custId: string) {
    const isActive =
      listSubscriptions.filter(function (sub) {
        return sub.customer === custId && sub.status === "active";
      }).length > 0;

    // TODO: The list of subscriptions allows you to check for incomplete, trailling, cancelled, and other types of status types. You may want to include these in the future.

    return isActive;
  }

  function getRecentBilling(cust: string) {
    const recentBillingDate = Math.max(
      ...listInvoices
        .filter((inv) => inv.customer === cust)
        .map((inv) => inv.created)
    );

    return unixDateToNative(recentBillingDate).toLocaleString();
  }

  return (
    <div className="p-4">
      <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
        <div className="my-3 p-2 grid grid-cols-2 items-center justify-between cursor-pointer sm:grid-cols-4 lg:grid-cols-5">
          <span>Name</span>
          <span className="hidden lg:grid">Email</span>
          <span className="hidden sm:grid">Last Payment</span>
          <span className="hidden sm:grid sm:justify-center ">Status</span>
        </div>
        <ul>
          {listCustomers.map((cust) => (
            <ListCard
              id={cust.id}
              key={cust.id}
              name={cust.name}
              email={cust.email}
              recentPayment={getRecentBilling(cust.id)}
              status={checkActive(cust.id) ? "Active" : "Inactive"}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Customers;
