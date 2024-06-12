// "use client";

import Image from "next/image";
// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";

import { useTranslationContext } from "../providers";

import {
  EnglishWebsiteCopy,
  EnglishAppointmentScheduleCopy,
  EnglishSMSCopy,
  EnglishSocialMediaCopy,
} from "./English";
import {
  ChineseAppointmentScheduleCopy,
  ChineseSMSCopy,
  ChineseSocialMediaCopy,
  ChineseWebsiteCopy,
} from "./Chinese";

const Services = () => {
  const { language } = useTranslationContext();

  return (
    // <AnimatePresenceWrapper
    //   mode="wait"
    //   key={language}
    //   animate={"show"}
    //   initial="hide"
    //   className="transition-all ease-out"
    // >
    <div className="flex flex-col mx-auto justify-center items-center gap-10 p-12">
      <h2 className="text-3xl text-center pb-4">
        {/* High-Quality Web and Social Media Presence and Reputation */}
        {language === "zh-CN"
          ? "让您的企业形象为当地社区所熟知"
          : "Make Your Business Presence Well-Known to Your Local Community"}
      </h2>
      <Image
        className="opacity-90 rounded-lg shadow-sm border border-gray-200"
        priority
        src="/Demo-Image.png"
        width={1000}
        height={1000}
        alt="Website Showcase on Desktop and Mobile Devices"
      />
      {language === "zh-CN" ? <ChineseWebsiteCopy /> : <EnglishWebsiteCopy />}

      <h2 className="text-3xl text-center pb-4">
        {language === "zh-CN"
          ? "通过 Tholattice 网络和移动应用程序控制您的业务运营和营销"
          : "Control Your Business Operations and Marketing from the Tholattice Web and Mobile App"}
      </h2>
      <Image
        className="opacity-90 rounded-lg shadow-sm border border-gray-200"
        src="/MobileWebApp.png"
        width={750}
        height={750}
        alt="Website Showcase on Desktop and Mobile Devices"
      />
      {language === "zh-CN" ? (
        <>
          <ChineseAppointmentScheduleCopy />
          <ChineseSMSCopy />
          <ChineseSocialMediaCopy />
        </>
      ) : (
        <>
          <EnglishAppointmentScheduleCopy />
          <EnglishSMSCopy />
          <EnglishSocialMediaCopy />
        </>
      )}
    </div>
    // </AnimatePresenceWrapper>
  );
};

export default Services;
