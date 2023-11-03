import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { parse } from './utils'

export default async function RootMiddleware(req: NextRequest, ev: NextFetchEvent) {
    const {domain} = parse(req);

    if(!domain) {
        return NextResponse.next()
    }

    // Steven's file had a command to track clicks that linked to the upstash redis account. I understand this might be important for tracking bots, but I'm not sure what I could possibly to to combat these bots. Circle back to this later.

    // When I looked closer at the code, I noticed he assigned a redis object to a js variable and implemented logic to redirect based on values from this object. But when a rewrite to the actual root domain of the project was made, no use of this response object was called. So, I feel like I don't need to implement upstash for this purpose right now.

    // I think Steven did this so that when any old user clicked on a shortlink, the middleware would trigger at the point. That's why he has a DUB_HEADERS objects to alter the structure of this redirect for maybe advertising purposes? Not sure. But it makes me confident that I don't need upstash right now.

   // rewrite to root page unless the user defines a site to redirect to
//    return NextResponse.rewrite(new URL(`/${domain}`, req.url));
return NextResponse.rewrite(new URL('/', req.url))
}