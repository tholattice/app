"use client";

import Link from "next/link";
// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";

import { useTranslationContext } from "../providers";

const Contact = () => {
  const { language } = useTranslationContext();

  return (
    // <AnimatePresenceWrapper
    //   mode="wait"
    //   key={language}
    //   animate={"show"}
    //   initial="hide"
    //   className="transition-all ease-out"
    // >
    <div className="flex flex-col mx-auto p-4 gap-4">
      <h1 className="font-normal text-center text-3xl">
        {language === "zh-CN" ? "联系我们" : "Contact Us"}
      </h1>
      <p className="text-center">
        {language === "zh-CN"
          ? "请在下面给我们发送电子邮件，了解有关 Tholattice 数字营销如何帮助您的按摩治疗业务的更多信息。"
          : "Email us below to learn more about how Tholattice Digital Marketing can help your massage therapy business."}
      </p>
      <p className="text-center ">
        <Link className="font-bold underline" href="mailto:alex@tholattice.com">
          alex@tholattice.com
        </Link>
      </p>
    </div>
    // </AnimatePresenceWrapper>
  );
};

export default Contact;
