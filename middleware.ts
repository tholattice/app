import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host")!;
  const path = url.pathname;

  // Handle localhost development
  if (hostname === "localhost:3000" || hostname === "localhost:3001") {
    // Handle subdomains for tenant sites
    if (hostname.includes(".")) {
      const subdomain = hostname.split(".")[0];
      if (subdomain !== "localhost") {
        return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
      }
    }
    
    // For development, handle dashboard routes directly
    // Authentication will be handled at the page level
    if (path.startsWith("/dashboard")) {
      return NextResponse.next();
    }
    
    // Rewrite auth routes to tholattice.com
    if (path.startsWith("/auth")) {
      return NextResponse.rewrite(
        new URL(`/tholattice.com${path}`, req.url),
      );
    }

    // Rewrite main site routes to tholattice.com
    return NextResponse.rewrite(
      new URL(`/tholattice.com${path === "/" ? "" : path}`, req.url),
    );
  }

  // Handle production domain
  if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    // Rewrite auth and dashboard routes to tholattice.com
    if (path.startsWith("/auth") || path.startsWith("/dashboard")) {
      return NextResponse.rewrite(
        new URL(`/tholattice.com${path}`, req.url),
      );
    }

    // Rewrite main site routes to tholattice.com
    return NextResponse.rewrite(
      new URL(`/tholattice.com${path === "/" ? "" : path}`, req.url),
    );
  }

  // Handle Vercel deployment domain
  if (hostname.includes('vercel.app')) {
    // For Vercel deployment, handle dashboard routes directly
    // Authentication will be handled at the page level
    if (path.startsWith("/dashboard")) {
      return NextResponse.next();
    }
    
    // Rewrite auth routes to tholattice.com
    if (path.startsWith("/auth")) {
      return NextResponse.rewrite(
        new URL(`/tholattice.com${path}`, req.url),
      );
    }

    // Rewrite main site routes to tholattice.com
    return NextResponse.rewrite(
      new URL(`/tholattice.com${path === "/" ? "" : path}`, req.url),
    );
  }

  // Handle subdomain routing for tenant sites
  if (hostname.startsWith("app.")) {
    // Redirect old app subdomain to new dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Handle other domains (tenant sites)
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}