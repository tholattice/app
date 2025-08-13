export const HOME_DOMAIN = process.env.NODE_ENV === "production" 
  ? "https://tholattice.com" 
  : "http://localhost:3000";

export const APP_HOSTNAMES = new Set([
  "app.tholattice.com",
  "app.localhost:3000",
//   I think Steven set aside port 8888 for the app subdomain, not sure yet
//   "localhost",
]);

export const DEFAULT_REDIRECTS = {
    home: "https://tholattice.com",
    tholattice: "https://tholattice.com",
    signin: "https://app.tholattice.com/login",
    login: "https://app.tholattice.com/login",
    register: "https://app.tholattice.com/register",
    signup: "https://app.tholattice.com/register",
    app: "https://app.tholattice.com",
    dashboard: "https://app.tholattice.com",
    // links: "https://app.tholattice.com/links",
    // settings: "https://app.tholattice.com/settings",
    // welcome: "https://app.tholattice.com/welcome",
    // discord: "https://twitter.com/dubdotco", // placeholder for now
    // tags: "https://tholattice.com/help/how-to-use-tags",
    // You may want to create defaults for these other pages. Not sure what all these default redirects are used for.
  };

  export const THOLATTICE_LOGO = "/Tholattice_HorizontalChinese_111322_White.png"

  export const THOLATTICE_THUMBNAIL = "/TholatticeSymbolWhiteBG.png"
