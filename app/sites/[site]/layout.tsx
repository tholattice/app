import { dictionary } from "@/content";
import "@/app/globals.css";

export async function generateMetadata({
  params,
}: {
  params: { site: string };
}) {
  return {
    title: dictionary[params.site]?.metaTitle,
    description: dictionary[params.site]?.metaDescription,
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { site: string };
}) {
  return (
    <html lang="en">
      <body>
        <div className="m-5 bg-gray-200">
          {children}
          {dictionary[params.site]?.layoutTag}
        </div>
      </body>
    </html>
  );
}

// TODO: Maybe setting a local globals.css file that can accept params as props to change the color scheme dynamically on client sites? Not sure if this can work.

// import "./globals.css";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}This is the root layout</body>
//     </html>
//   );
// }