import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

import type { NextRequest } from "next/server";
import type { Database } from "./types/supabase";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({req, res})

  const {data: {user}} = await supabase.auth.getUser()

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host")!;

  // Get the pathname of the request (e.g. /, /about, /blog/first-post) Declare login path
  const path = url.pathname;

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentSubdomain =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
      : hostname.replace(`.localhost:3000`, "");

  // Check first if accessing app dashboard route and if user is logged in. If not, then redirect to login page.
  if (currentSubdomain == "app" || path == "/app") {
    if (!user && path !== '/login') {
      if (path === '/auth/callback'){
      return NextResponse.rewrite(
        new URL(`/home/${currentSubdomain}${path}`, req.url)
      ); }

      return NextResponse.redirect(
        new URL(`/login`, req.url)
      );} else if (user && path === '/login') {
        return NextResponse.rewrite(
          new URL(`/home/${currentSubdomain}/`, req.url)
        );
      } else {
        return NextResponse.rewrite(
          new URL(`/home/${currentSubdomain}${path}`, req.url)
        );
      }

    // return NextResponse.rewrite(
    //         new URL(`/home/${currentSubdomain}${path}`, req.url)
    //       );
    }
    
    // else if (user && path === loginPath) {
    //   console.log('2nd')
    //   // else if (user) {
    //     return NextResponse.redirect(new URL("/", req.url))} else {
    //       console.log('3rd')
      
    

     // rewrite to '/home/app' route

  

  // rewrite root application to `/home` folder
  if (hostname === "localhost:3000" || hostname === `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
}

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/sites/${currentSubdomain}${path}`, req.url)
  );

  // TOOD: Needs to error out when end-user attempts to make requests to a subdomain that doesn't exist, either on tholattice or other websites
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    // "/((?!api/|_vercel/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)",
    "/((?!_vercel/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)",
  ],
};