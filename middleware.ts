import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { AppMiddleware, RootMiddleware } from "./lib/middleware";
import { parse } from "./lib/middleware/utils";

import { APP_HOSTNAMES } from "./utils/constants";

export const config = {
    matcher: [
        /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const {domain, path, key} = parse(req);

    // for App
    if (APP_HOSTNAMES.has(domain)) {
        return AppMiddleware(req);
    }


    // for root pages (e.g. tholattice.com)
    if (key.length === 0) {
        return RootMiddleware(req, ev)
    }
}