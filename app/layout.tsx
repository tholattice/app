import "@/globals.css";
import { cn } from "@/utils/merge";

// import { Inter, Merriweather, Noto_Sans } from "next/font/google";
import { Noto_Sans } from "next/font/google";

import Header from "./components/Header";
import Footer from "./components/Footer";
// import MobileHeader from "../components/MobileHeader";
import Background from "./components/Background";

import Providers from "./providers";
import NewMobileHeader from "@/app/components/NewMobileHeader";

// const inter = Inter({ subsets: ["latin"] });
// const merriweather = Merriweather({ subsets: ["latin"], weight: "300" });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: "300" });

export const metadata = {
  title: "Tholattice Digital Marketing",
  description: "A digital marketing agency for massage therapists",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={cn(notoSans.className, "text-gray-600")}>
        {/* bg-gray-50 */}
        <Providers>
          <div className="flex flex-col min-h-screen justify-between">
            {/* <MobileHeader /> */}
            <NewMobileHeader />
            <Header />
            {children}
            <Footer />
            <Background />
          </div>
        </Providers>
      </body>
    </html>
  );
}

// export default function RootLayout({
//   children,
// }: // params,
// {
//   children: React.ReactNode;
//   // params: { site: string };
// }) {
//   // console.log(params.site);
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

// import "./globals.css";
