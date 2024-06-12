import { ReactNode } from "react";

import lightMain from "./lightMain";
import lightSecondary from "./lightSecondary";

export interface UserInterface {
  role: String[]
}

export interface LocationInterface {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string | null;
}

export interface LayoutInterface {
  name: string | null;
  description: string | null;
  logo: string | null;
  font: string;
  layout: number;
  image: string | null;
  subdomain: string | null;
  customDomain: string | null;
  message404: string | null;
  user: UserInterface | null;
  location: LocationInterface | null;
}

export const layoutMapper = ({ children, data }: { children: ReactNode, data: LayoutInterface }) => {
  return {
    1: lightMain({ children, data }),
    2: lightSecondary({ children, data }),
  } as Record<number, ReactNode>;
};
