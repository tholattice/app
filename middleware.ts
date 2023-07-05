// import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host")!;

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // Only for demo purposes - remove this if you want to use your root domain as the landing page
//   if (hostname === "vercel.pub" || hostname === "platforms.vercel.app") {
//     return NextResponse.redirect("https://demo.vercel.pub");
//   }
// console.log(req.cookies.get("__Secure-next-auth.session-token"));

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentSubdomain =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.tholattice.com`, "")
      : hostname.replace(`.localhost:3000`, "");

  // rewrites for app pages
  if (currentSubdomain == "app" || path == '/app') {
    // console.log(url.pathname)
    // console.log(req.cookies.get("next-auth.session-token"));
    // console.log(req.cookies.get("__Secure-next-auth.session-token"));
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

     // rewrite to '/home/app' route
     
  return NextResponse.rewrite(
    // new URL(`/_sites/${currentSubdomain}${path}`, req.url)
    new URL(`/home/${currentSubdomain}${path}`, req.url)
  );
    // url.pathname = `/app${url.pathname}`;
    // return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (hostname === "localhost:3000" || hostname === "tholattice.com") {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  
  return NextResponse.rewrite(
    // new URL(`/_sites/${currentSubdomain}${path}`, req.url)
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
    "/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)",
  ],
};