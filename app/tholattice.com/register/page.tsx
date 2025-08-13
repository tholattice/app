import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { constructMetadata } from "@/utils/misc";

import RegisterForm from "./form";

export const metadata = constructMetadata({
  title: "Sign up to Tholattice",
});

export default async function RegisterPage() {
  const session = await auth();

  // If user is already authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative z-10 w-full max-w-md overflow-hidden border border-gray-100 sm:rounded-2xl sm:shadow-xl">
      {/* <a
        href={`${HOME_DOMAIN}/blog/rebrand`}
        target="_blank"
        className="absolute right-3 top-3 rounded-full border border-gray-300 px-4 py-1 text-xs font-medium shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.1)] backdrop-blur transition-all hover:border-gray-500 hover:bg-white/50"
      >
        We've rebranded!
      </a> */}
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <Link href="/">
          <Logo className="h-16 w-16 rounded-full border border-gray-300" />
        </Link>
        <h3 className="text-xl font-semibold">
          Create your Tholattice account
        </h3>
        <p className="text-sm text-gray-500">
          Create an account. Start your journey today.
        </p>
      </div>
      <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
        <Suspense
          fallback={
            <>
              <Button disabled={true} text="" variant="secondary" />
              <Button disabled={true} text="" variant="secondary" />
              <div className="mx-auto h-5 w-3/4 rounded-lg bg-gray-100" />
            </>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
      </div>
    </div>
  );
}
