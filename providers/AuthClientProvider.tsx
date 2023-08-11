"use client";

import { useEffect, useState } from "react";

import AuthClient from "@/app/components/AuthClient";

const AuthClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* <AuthClient /> */}
      {children}
    </>
  );
};

export default AuthClientProvider;
