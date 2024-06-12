import { ReactNode } from "react";
// import Link from "next/link";
// import Image from "next/image";

import { LayoutInterface } from "./layouts";
// import { fontMapper } from "../fonts/fonts";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import TopHeader from "../components/TopHeader";
// import MobileHeader from "../components/MobileHeader";

const lightMain = ({
  children,
  data,
}: {
  children: ReactNode;
  data: LayoutInterface;
}) => {
  return (
    <div className="">
      <Header data={data} />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default lightMain;

{
  /* <div className="ease left-0 right-0 top-0 z-30 flex h-16 bg-white transition-all duration-150">
  {/* dark setting removed */
}
//   <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 px-10 sm:px-20">
//     <Link href="/" className="flex items-center justify-center">
//       <div className="align-middle">
//         <Image
//           alt={data.name || ""}
//           height={200}
//           src={data.logo || ""}
//           width={200}
//         />
//       </div>
//       <span className="ml-3 font-title font-medium">{data.name}</span>
//     </Link>
//   </div>
// </div>
// <div className="mt-20">
//   {children}
//   {`This is the site layout number: ${data.layout}`}
//   {data.user?.role.map((role) => (
//     <p>{role}</p>
//   ))}
// </div>
