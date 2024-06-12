"use client";

import Button from "@/components/Button";
// import { InfoTooltip } from "@/components/Tooltip";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { toast } from "sonner";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  const [showEmailOption, setShowEmailOption] = useState(false);
  const [noSuchAccount, setNoSuchAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [clickedEmail, setClickedEmail] = useState(false);

  useEffect(() => {
    const error = searchParams?.get("error");
    error && toast.error(error);
  }, [searchParams]);

  console.log(`This is the next variable: ${next}`);

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setClickedEmail(true);
          await signIn("email", {
            email,
            redirect: false,
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          })
            .then((res) => {
              setClickedEmail(false);
              if (res?.ok && !res?.error) {
                setEmail("");
                toast.success("Email sent - check your inbox!");
              } else {
                toast.error("Error sending email - try again?");
              }
            })
            .catch(() => {
              setClickedEmail(false);
              toast.error("Error sending email - try again?");
            });
        }}
        className="flex flex-col space-y-3"
      >
        {showEmailOption && (
          <div>
            <div className="mb-4 mt-1 border-t border-gray-300" />
            <input
              id="email"
              name="email"
              autoFocus
              type="email"
              placeholder="yuki@gee.co"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setNoSuchAccount(false);
                setEmail(e.target.value);
              }}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
        )}
        <Button
          text="Continue with Email"
          variant="secondary"
          {...(!showEmailOption && {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              setShowEmailOption(true);
            },
          })}
          loading={clickedEmail}
        />
      </form>
      {noSuchAccount ? (
        <p className="text-center text-sm text-red-500">
          No such account.{" "}
          <Link href="/register" className="font-semibold text-red-600">
            Sign up
          </Link>{" "}
          instead?
        </p>
      ) : (
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
      )}
    </>
  );
}
