import { NextRequest, NextResponse } from "next/server";
import { parse } from "@/lib/middleware/utils";
import { getToken } from "next-auth/jwt";
// import { conn } from "../planetscale";
// you need to implement the supabase alternative to this
import { UserProps } from "../types/types";

export default async function AppMiddleware(req: NextRequest) {
    const { path, fullPath } = parse(req);

    const session = (await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        // the secret might need to change if you want supabase to sign off on the JWT as an adapter
      })) as {
        email?: string;
        user?: UserProps;
      };
      // if there's no session and the path isn't /login or /register, redirect to /login
      if (
        !session?.email &&
        path !== "/login" &&
        path !== "/register"
        // && path !== "/auth/saml"
      ) {
        return NextResponse.redirect(
          new URL(
            `/login${path === "/" ? "" : `?next=${encodeURIComponent(fullPath)}`}`,
            req.url,
          ),
        //   why is the encodeURIcomponent necessary here? Why do we need the full path if we are redirecting to login page
        );
    
        // if there's a session
      } else if (session?.email) {
        // if the user was created in the last 10s
        // (this is a workaround because the `isNewUser` flag is triggered when a user does `dangerousEmailAccountLinking`)
        if (
          session?.user?.createdAt &&
          new Date(session?.user?.createdAt).getTime() > Date.now() - 10000 &&
          path === "/"
        ) {
          // if the path is /login or /register, redirect to "/"
        } else if (path === "/login" || path === "/register") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    
      // otherwise, rewrite the path to /app
      return NextResponse.rewrite(
        new URL(`/app.tholattice.com${fullPath === "/" ? "" : fullPath}`, req.url),
      );

}