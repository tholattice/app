import { NextRequest } from "next/server";

export const parse = (req: NextRequest) => {
    let domain = req.headers.get("host") as string;

    domain = domain.replace("www.", ""); // remove www. from domain
    if (domain === "app.localhost:3000" || domain.endsWith(".vercel.app")) {
      // for local development and preview URLs
      domain = "tholattice.com";
    }
  
    // path is the path of the URL (e.g. tholattice.com/stats/github -> /stats/github)
    let path = req.nextUrl.pathname;
  
    // fullPath is the full URL path (along with search params)
    const searchParams = req.nextUrl.searchParams.toString();
    const fullPath = `${path}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;
  
    // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
    const key = decodeURIComponent(path.split("/")[1]); // key is the first part of the path (e.g. tholattice.com/stats/github -> stats)
    const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. tholattice.com/github/repo -> github/repo)
  
    return { domain, path, fullPath, key, fullKey };
  };