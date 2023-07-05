import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-red-800">
          {children}This is the tholattice dashboard layout
        </div>
      </body>
    </html>
  );
}

// TODO: Add favicons generation to Tholattice dashboard,home, and sites route
