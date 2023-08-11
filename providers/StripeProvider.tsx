"use client";

import {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface StripeContextProps {
  // customerId: string | string[];
  // customerName: string;
  // setCustomerName: Dispatch<SetStateAction<string>>;
  // setCustomerId: Dispatch<SetStateAction<string | string[]>>;
  customers: object;
  invoices: object;
  subscriptions: object;
  //   Figure out how to properly define type of customer name here
}

interface StripeProviderProps {
  children: React.ReactNode;
  customers: object;
  invoices: object;
  subscriptions: object;
}

const StripeContext = createContext<StripeContextProps>({
  // customerId: "",
  // customerName: "",
  // setCustomerName: (): string => "",
  // setCustomerId: (): string | string[] => "",
  customers: {},
  invoices: {},
  subscriptions: {},
});

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  // const [customerId, setCustomerId] = useState<string | string[]>("");
  // const [customerName, setCustomerName] = useState("");
  const [customers, setCustomers] = useState({});
  const [invoices, setInvoices] = useState({});
  const [subscriptions, setSubscriptions] = useState({});

  return (
    <StripeContext.Provider value={{ customers, invoices, subscriptions }}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripeContext = () => useContext(StripeContext);

export default StripeProvider;
