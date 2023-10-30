"use client";

import { cn } from "@/utils/merge";
// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";

import Logos from "../components/CustomerLogos";
import Testimonials from "./Testimonials";
import styles from "../components/banner.module.css";

import { useTranslationContext } from "../providers";

const TestimonialsPage = () => {
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
      {/* <div className="flex flex-col items-center justify-center opacity-50 bg-cover bg-no-repeat w-full h-[275px] bg-center bg-[url('/TestimonialsHeroPicture.png')]"></div> */}
      <section
        className={cn(
          styles.banner,
          "flex flex-col items-center justify-center bg-[url('/TestimonialsHeroPicture.png')]"
        )}
      >
        <h1
          className={`${
            language === "zh-CN" ? "font-normal" : "font-extrabold"
          } text-4xl text-center`}
        >
          {language === "zh-CN" ? "我们的客户" : "Our Clients"}
        </h1>
      </section>
      <div className="flex flex-col mx-auto">
        <Logos />
        <Testimonials />
      </div>
    </div>
  );
};

export default TestimonialsPage;
