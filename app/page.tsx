"use client";

import AnimatePresenceWrapper from "@/app/components/AnimatePresenceWrapper";
import Hero from "./Hero";
import Logos from "./components/CustomerLogos";
// import Services from "./services/Services";
import Testimonials from "./testimonials/Testimonials";

import { useTranslationContext } from "./providers";

export default function TholatticeHome() {
  const { language } = useTranslationContext();

  return (
    <AnimatePresenceWrapper
      mode="wait"
      key={language}
      animate={"show"}
      initial="hide"
      className="transition-all ease-out"
    >
      <div className="flex flex-col">
        <Hero />
        <Logos />
        <Testimonials />
        {/* <Services /> */}
      </div>
    </AnimatePresenceWrapper>
  );
}
