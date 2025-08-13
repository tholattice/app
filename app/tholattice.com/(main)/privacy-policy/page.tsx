"use client";

// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";

import { useTranslationContext } from "../../providers";

import {
  Chinese3rdParty,
  ChineseAgeVerification,
  ChineseContact,
  ChineseCookies,
  ChineseDataBreach,
  ChineseDataRetention,
  ChineseHowWeUse,
  ChineseInformationCollected,
  ChineseIntrouction,
  ChineseRemarketing,
  ChineseRightsAndChoices,
  ChineseSharingInformation,
  ChineseStripe,
  ChineseUpdatesToPP,
} from "./Chinese";
import {
  English3rdParty,
  EnglishAgeVerification,
  EnglishContact,
  EnglishCookies,
  EnglishDataBreach,
  EnglishDataRetention,
  EnglishHowWeUse,
  EnglishInformationCollected,
  EnglishIntrouction,
  EnglishRemarketing,
  EnglishRightsAndChoices,
  EnglishSharingInformation,
  EnglishStripe,
  EnglishUpdatesToPP,
} from "./English";

const PrivacyPolicy = () => {
  const { language } = useTranslationContext();

  return (
    // <AnimatePresenceWrapper
    //   mode="wait"
    //   key={language}
    //   animate={"show"}
    //   initial="hide"
    //   className="transition-all ease-out"
    // >
    <div className="p-12">
      <h1 className="text-center font-extrabold text-xl mb-2">
        {language === "zh-CN"
          ? "Tholattice 数字营销隐私政策"
          : "Privacy Policy for Tholattice Digital Marketing"}
      </h1>
      <h2 className="text-center font-bold text-lg">
        {language === "zh-CN"
          ? "生效日期: 2023 年 10 月 16 日"
          : "Effective Date: October 16, 2023"}
      </h2>
      <br />
      <ol>
        <li>
          <h2>{language === "zh-CN" ? "1. 介绍" : "1. Introduction"}</h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseIntrouction />
          ) : (
            <EnglishIntrouction />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "2. 我们收集的信息"
              : "2. Information We Collect"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseInformationCollected />
          ) : (
            <EnglishInformationCollected />
          )}
        </li>
        <br />
        <li>
          <h2>{language === "zh-CN" ? "3. 数据保留" : "3. Data Retention"}</h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseDataRetention />
          ) : (
            <EnglishDataRetention />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "4. 我们如何使用您的信息"
              : "4. How We Use Your Information"}
          </h2>
          <br />
          {language === "zh-CN" ? <ChineseHowWeUse /> : <EnglishHowWeUse />}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "5. 分享您的信息"
              : "5. Sharing Your Information"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseSharingInformation />
          ) : (
            <EnglishSharingInformation />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "6. Cookie 和跟踪技术"
              : "6. Cookies and Tracking Technologies"}
          </h2>
          <br />
          {language === "zh-CN" ? <ChineseCookies /> : <EnglishCookies />}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN" ? "7. 第三方服务" : "7. Third-Party Services"}
          </h2>
          <br />
          {language === "zh-CN" ? <Chinese3rdParty /> : <English3rdParty />}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "8. 数据泄露通知"
              : "8. Data Breach Notification"}
          </h2>
          <br />
          {language === "zh-CN" ? <ChineseDataBreach /> : <EnglishDataBreach />}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "9. 付款 (Stripe, Inc.)"
              : "9. Payments (Stripe, Inc.)"}
          </h2>
          <br />
          {language === "zh-CN" ? <ChineseStripe /> : <EnglishStripe />}
        </li>
        <br />
        <li>
          <h2>{language === "zh-CN" ? "10. 再营销" : "10. Remarketing"}</h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseRemarketing />
          ) : (
            <EnglishRemarketing />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN" ? "11. 年龄验证" : "11. Age Verification"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseAgeVerification />
          ) : (
            <EnglishAgeVerification />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "12. 隐私政策更新"
              : "12. Updates to Privacy Policy"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseUpdatesToPP />
          ) : (
            <EnglishUpdatesToPP />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "13. 您的权利和选择"
              : "13. Your Rights and Choices"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseRightsAndChoices />
          ) : (
            <EnglishRightsAndChoices />
          )}
        </li>
        <br />
        <li>
          <h2>{language === "zh-CN" ? "14. 联系我们" : "14. Contact Us"}</h2>
          <br />
          {language === "zh-CN" ? <ChineseContact /> : <EnglishContact />}
        </li>
      </ol>
    </div>
    // </AnimatePresenceWrapper>
  );
};

export default PrivacyPolicy;
