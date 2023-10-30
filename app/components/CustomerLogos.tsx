import Link from "next/link";
import Image from "next/image";

// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";
// import BlurImage from "../../components/BlurImage";

import { useTranslationContext } from "../providers";

const logos = ["healing-hands-massage", "massage-by-mike"];

export default function CustomerLogos({ copy }: { copy?: string }) {
  const { language } = useTranslationContext();

  return (
    // <AnimatePresenceWrapper
    //   mode="wait"
    //   key={language}
    //   animate={"show"}
    //   initial="hide"
    //   className="transition-all ease-out"
    // >
    <div className="my-10 flex flex-col">
      <h2
        className={`mx-auto max-w-lg text-center p-2 sm:max-w-xl text-gray-600 text-3xl ${
          language === "zh-CN" && "font-light"
        }`}
      >
        {copy ?? language === "zh-CN" ? (
          <>受到各地按摩师和按摩{<br className="sm:hidden" />}治疗实践的信赖</>
        ) : (
          "Trusted by masseuses and massage therapy practices everywhere"
        )}
      </h2>
      <Link
        href="/testimonials"
        className="flex flex-col sm:flex-row mx-auto justify-between items-center text-center gap-y-8 sm:gap-x-12 lg:gap-x-24 mt-8 max-w-screen-lg"
      >
        {logos.slice(0, 2).map((logo) => (
          <Image
            key={logo}
            src={`/${logo}.png`}
            alt={logo.toUpperCase()}
            width={250}
            height={182}
            priority
            // objectFit="true"
            style={{ height: "auto" }}
            // className="h-12 grayscale transition-all hover:grayscale-0 md:h-20"
            className="h-12 transition-all md:h-20"
          />
        ))}
      </Link>
    </div>
    // </AnimatePresenceWrapper>
  );
}
