"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { toast } from "sonner";

import Button from "@/components/Button";
import { InfoTooltip } from "@/components/Tooltip";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [clickedWeChat, setClickedWeChat] = useState(false);

  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      toast.error(error);
      // Reset loading states when there's an error
      setClickedGoogle(false);
      setClickedWeChat(false);
    }
  }, [searchParams]);

  // Reset loading states when component mounts (user returns from OAuth)
  useEffect(() => {
    setClickedGoogle(false);
    setClickedWeChat(false);
  }, []);

  return (
    <>
      {/* Google Login */}
      <Button
        text="Continue with Google"
        onClick={() => {
          setClickedGoogle(true);
          signIn("google", {
            callbackUrl: "/dashboard",
          }).catch((error) => {
            console.error("Google sign in error:", error);
            setClickedGoogle(false);
            toast.error("Failed to sign in with Google");
          });
        }}
        loading={clickedGoogle}
        disabled={clickedWeChat}
        variant="secondary"
      />

      {/* WeChat Login */}
      <Button
        text="Continue with WeChat"
        onClick={() => {
          setClickedWeChat(true);
          signIn("wechat", {
            callbackUrl: "/dashboard",
          }).catch((error) => {
            console.error("WeChat sign in error:", error);
            setClickedWeChat(false);
            toast.error("Failed to sign in with WeChat");
          });
        }}
        loading={clickedWeChat}
        disabled={clickedGoogle}
        variant="secondary"
      />

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-gray-500 transition-colors hover:text-black"
        >
          Sign up
        </Link>
        .
      </p>
    </>
  );
}
