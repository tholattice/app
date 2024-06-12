// import { inter, satoshi } from "@/styles/fonts";
import "@/globals.css";
// import { Noto_Sans } from "next/font/google";
// import { cn, constructMetadata } from "@dub/utils";
// import { cn } from "@/utils/merge";
// import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

// export const metadata = constructMetadata();
// const notoSans = Noto_Sans({ subsets: ["latin"], weight: "300" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en" className={cn(notoSans)}>
    <html>
      <body>
        <Toaster closeButton />
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
