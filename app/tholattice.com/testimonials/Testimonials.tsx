import Image from "next/image";

// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";
import { useTranslationContext } from "../providers";
import { Rating } from "@mui/material";

export function bigQuotations() {
  return (
    <svg
      className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 14"
    >
      <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
    </svg>
  );
}

export default function Testimonials() {
  const { language } = useTranslationContext();

  return (
    <section>
      {/* <AnimatePresenceWrapper
        mode="wait"
        key={language}
        animate={"show"}
        initial="hide"
        className="transition-all ease-out"
      > */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-12 py-6 mx-auto md:max-w-screen-md lg:max-w-screen-lg">
        {/* <div className="flex flex-col justify-center items-center p-8 gap-12 rounded-lg border-gray-200 bg-white/5 backdrop-blur-lg shadow-sm"> */}
        <div className="flex flex-col justify-center items-center p-8 gap-6 rounded-2xl border border-gray-200 bg-white/20 backdrop-blur-lg backdrop-filter shadow-lg">
          <div className="max-w-lg">
            <p className="italic text-gray-600 text-xl">
              {bigQuotations()}
              {language === "zh-CN"
                ? "我有一个朋友也想和你一起做广告...非常感谢你的广告支持。"
                : "I have a friend who wants to advertise with you too...Thank you very much for your advertising support."}
            </p>
          </div>
          <Image
            className="rounded-[100%] shadow-lg"
            // src="/LisaHeadshot.jpeg"
            src="/SmilingCustomer1_Cropped.jpg"
            width={200}
            height={200}
            alt="Lisa Healings Hands Massage Headshot"
          />
          <h2 className="text-gray-600 text-xl">
            Lisa H., Healing Hands Massage
          </h2>
          <Rating name="read-only" value={5} precision={0.5} readOnly />
        </div>
        {/* <div className="flex flex-col justify-center items-center p-8 gap-12 rounded-lg border-gray-200 bg-white/5 backdrop-blur-lg shadow-sm"> */}
        <div className="flex flex-col justify-center items-center p-8 gap-6 rounded-2xl border border-gray-200 bg-white/20 backdrop-blur-lg backdrop-filter shadow-lg">
          <div className="max-w-lg">
            <p className="italic text-gray-600 text-xl">
              {bigQuotations()}
              {language === "zh-CN"
                ? "感谢您为我带来了回头客！她看到了你的广告，安排了约会，并说她很高兴找到我。"
                : "Thank you for getting me a repeat customer! She saw your ad, scheduled an appointment, and said she is happy to find me."}
            </p>
          </div>
          <Image
            className="rounded-[100%] shadow-lg"
            // src="/MikeHeadshot.jpeg"
            src="/SmilingChineseMan1_Cropped.jpg"
            height={200}
            width={200}
            alt="Mike Massage By Mike Headshot"
          />
          <h2 className="text-gray-600 text-xl">Mike H., Massage by Mike</h2>
          <Rating name="read-only" value={4.5} precision={0.5} readOnly />
        </div>
      </div>
      {/* </AnimatePresenceWrapper> */}
    </section>
  );
}
