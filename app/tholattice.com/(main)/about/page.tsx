"use client";

import Image from "next/image";

import { cn } from "@/utils/merge";
// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";

import styles from "@/components/banner.module.css";
import { useTranslationContext } from "../../providers";

import {
  ChineseFAbundanceCopy,
  ChineseProfessionalismCopy,
  ChineseRelationshipCopy,
} from "../../../../components/ChineseTextConstants";
import {
  EnglishFAbundanceCopy,
  EnglishProfessionalismCopy,
  EnglishRelationshipCopy,
} from "../../../../components/EnglishTextConstants";

function About() {
  const { language } = useTranslationContext();

  return (
    // <AnimatePresenceWrapper
    //   mode="wait"
    //   key={language}
    //   animate={"show"}
    //   initial="hide"
    //   className="transition-all ease-out"
    // >
    //   <div className="flex flex-col items-center justify-center opacity-50 bg-cover bg-no-repeat w-full h-[275px] bg-center bg-[url('/AboutHeroPictureCropped.png')]">
    //    <Image
    //       className=" -z-10 opacity-50"
    //       src="/AboutHeroPictureCropped.png"
    //       height={2448}
    //       width={4368}
    //       style={{ height: "50%", width: "auto" }}
    //        objectFit="cover"
    //       alt="Massage Table with Candles About Hero Picture"
    //     />
    //   <h1 className="font-extrabold text-4xl text-center">My Mission</h1>
    //    </div>
    <div>
      <section
        className={cn(
          styles.banner,
          "flex flex-col items-center justify-center bg-[url('/AboutHeroPictureCropped_SizedDown.png')]"
        )}
      >
        <h1
          className={`${
            language === "zh-CN" ? "font-normal" : "font-extrabold"
          } text-4xl text-center`}
        >
          {language === "zh-CN" ? "我们的任务" : "Our Mission"}
        </h1>
      </section>

      <div className="flex flex-col mx-auto max-w-md lg:max-w-2xl justify-center items-center gap-4 p-12">
        <h1
          className={`text-2xl pb-4 ${
            language === "zh-CN" ? "font-normal" : "font-semibold"
          }`}
        >
          {language === "zh-CN" ? "认识创始人" : "Meet the Founder"}
        </h1>
        <Image
          priority
          className="rounded-[100%] shadow-lg"
          src="/AlexHeadshot.jpeg"
          height={200}
          width={200}
          alt="Alex Founder Headshot"
        />
        <h2
          className={`text-xl ${
            language === "zh-CN" ? "font-normal" : "font-semibold"
          }`}
        >
          {language === "zh-CN" ? "亚历克斯·J·汤普森" : "Alex J. Thompson"}
        </h2>
        <h3 className="text-lg">
          {language === "zh-CN" ? "创始人、首席执行官" : "Founder, CEO"}
        </h3>
      </div>
      <div className="flex flex-col justify-between items-center text-center mx-auto max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl gap-2 pb-12">
        <h1
          className={`text-2xl pb-4 ${
            language === "zh-CN" ? "font-normal" : "font-semibold"
          }`}
        >
          {language === "zh-CN" ? "核心价值" : "Core Values"}
        </h1>
        <div className="p-12 sm:p-0 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-4">
            <Image
              className="opacity-70"
              src="/ProfessionalIcon.svg"
              width={100}
              height={100}
              alt="Professionalism Icon"
            />
            <h2
              className={`text-xl ${
                language === "zh-CN" ? "font-normal" : "font-semibold"
              }`}
            >
              {language === "zh-CN" ? "专业精神" : "Professionalism"}
            </h2>
            {language === "zh-CN" ? (
              <ChineseProfessionalismCopy />
            ) : (
              <EnglishProfessionalismCopy />
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <Image
              className="opacity-70"
              src="/RelationshipsIcon.svg"
              width={100}
              height={100}
              alt="Relationships Icon"
            />
            <h2
              className={`text-xl ${
                language === "zh-CN" ? "font-normal" : "font-semibold"
              }`}
            >
              {language === "zh-CN" ? "人际关系" : "Relationships"}
            </h2>
            {language === "zh-CN" ? (
              <ChineseRelationshipCopy />
            ) : (
              <EnglishRelationshipCopy />
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <Image
              className="opacity-70"
              src="/TreeIcon.svg"
              width={100}
              height={100}
              alt="Tree Icon"
            />
            <h2
              className={`text-xl ${
                language === "zh-CN" ? "font-normal" : "font-semibold"
              }`}
            >
              {language === "zh-CN" ? "财政充裕" : "Financial Abundance"}
            </h2>
            {language === "zh-CN" ? (
              <ChineseFAbundanceCopy />
            ) : (
              <EnglishFAbundanceCopy />
            )}
          </div>
        </div>
      </div>
    </div>
    // </AnimatePresenceWrapper>
  );
}

export default About;
