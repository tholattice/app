"use client";

import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupabaseBrowserClient } from "@/utils/SupabaseBrowser";
import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const AuthClient = () => {
  // const supabaseClient = useSupabaseClient();
  const supabase = createSupabaseBrowserClient();
  // const supabase = createClient(
  //   `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  //   `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  //   { auth: { flowType: "pkce" } }
  // );

  // const { session } = useSessionContext();
  // console.log(`${location.origin}`);

  return (
    <>
      <h1
        className="
          text-xl
          text-center
          font-bold
          mb-4
          "
      >
        Welcome back
      </h1>
      <h2
        className="
          mb-5
          text-sm
          leading-normal
          text-center
          "
      >
        Login to your account
      </h2>
      <Auth
        // onlyThirdPartyProviders
        theme="default"
        // magicLink
        supabaseClient={supabase}
        providers={["google"]}
        redirectTo="http://app.localhost:3000/auth/callback"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brandAccent: "#57504f",
                brand: "#292524",
                brandButtonText: "#f5f4f5",
                defaultButtonText: "#292524",
                defaultButtonBorder: "gray",
                inputBorder: "lightgray",
                inputBorderFocus: "lightgray",
              },
            },
          },
        }}
      />
    </>
  );
};

export default AuthClient;
