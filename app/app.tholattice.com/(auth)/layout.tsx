import { ReactNode } from "react";
import Background from "@/components/Background";

// export const runtime = "edge";
// TODO: This edge runtime was causing issues with the crypto module not resolving in NextJS.

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen justify-center">
      <Background />
      {children}
    </div>
  );
}
