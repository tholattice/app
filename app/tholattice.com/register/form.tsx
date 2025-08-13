"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { toast } from "sonner";

import Button from "@/components/Button";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [clickedWeChat, setClickedWeChat] = useState(false);

  useEffect(() => {
    const error = searchParams?.get("error");
    error && toast.error(error);
  }, [searchParams]);

  return (
    <>
      {/* Google Registration */}
      <Button
        text="Continue with Google"
        onClick={() => {
          setClickedGoogle(true);
          signIn("google", {
            callbackUrl: "/dashboard",
          });
        }}
        loading={clickedGoogle}
        disabled={clickedWeChat}
        variant="secondary"
      />

      {/* WeChat Registration */}
      <Button
        text="Continue with WeChat"
        onClick={() => {
          setClickedWeChat(true);
          signIn("wechat", {
            callbackUrl: "/dashboard",
          });
        }}
        loading={clickedWeChat}
        disabled={clickedGoogle}
        variant="secondary"
      />

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-gray-500 transition-colors hover:text-black"
        >
          Sign in
        </Link>
        .
      </p>
    </>
  );
}
