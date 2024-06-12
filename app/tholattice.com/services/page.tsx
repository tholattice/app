"use client";

import { cn } from "@/utils/merge";

// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";
import styles from "@/components/banner.module.css";
import Services from "./Services";

import { useTranslationContext } from "../providers";

const ServicesPage = () => {
  const { language } = useTranslationContext();

  return (
    // <AnimatePresenceWrapper
    //   mode="wait"
    //   key={language}
    //   animate={"show"}
    //   initial="hide"
    //   className="transition-all ease-out"
    // >
    <div>
      <section
        className={cn(
          styles.banner,
          "flex flex-col items-center justify-center bg-[url('/ServicesHeroPicture.jpg')]"
        )}
      >
        <h1
          className={`${
            language === "zh-CN" ? "font-normal" : "font-extrabold"
          } text-4xl text-center`}
        >
          {language === "zh-CN" ? "您将如何受益" : "How You Will Benefit"}
        </h1>
      </section>
      <Services />
    </div>
    // </AnimatePresenceWrapper>
  );
};

export default ServicesPage;
