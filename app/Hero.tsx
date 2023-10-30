"use client";

// import Image from "next/image";
import Link from "next/link";

import { ChineseHeroHeadline } from "./components/ChineseTextConstants";
import { EnglishHeroHeadline } from "./components/EnglishTextConstants";

import { useTranslationContext } from "./providers";
// import AnimatePresenceWrapper from "../components/AnimatePresenceWrapper";

const Hero = () => {
  const { language } = useTranslationContext();

  return (
    <section>
      {/* <AnimatePresenceWrapper
        mode="wait"
        key={language}
        animate={"show"}
        initial="hide"
        className="text-center mx-auto mt-20 mb-10 max-w-sm sm:max-w-xl md:max-w-2xl px-2.5 sm:px-0 transition-all ease-out"
      > */}
      <div className="text-center mx-auto mt-20 mb-10 max-w-sm sm:max-w-xl md:max-w-2xl px-2.5 sm:px-0">
        {/* Headline */}
        {language === "zh-CN" ? (
          <ChineseHeroHeadline />
        ) : (
          <EnglishHeroHeadline />
        )}
        <div className="mx-auto mt-10 flex max-w-fit space-x-4">
          <Link
            href={`/onboarding`}
            className="rounded-full border bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black lifeGradientButtonBg border-transparent hover:border-blue-700 hover:bg-clip-text hover:text-transparent border-gray-200 block font-medium transition-all`"
          >
            {language === "zh-CN" ? "开始使用" : "Get Started"}
          </Link>
          <Link
            href={`/services`}
            className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black"
          >
            {language === "zh-CN" ? "更多信息" : "More Info"}
          </Link>
        </div>
        {/* <div className="">
          Hero banner image should be here but it really ought to be the
          background image of the above Hero elements This is the image
          <Image alt="Sample hero" />
        </div> */}
        {/* </AnimatePresenceWrapper> */}
      </div>
    </section>
  );
};

export default Hero;
