"use client";

import Link from "next/link";

// import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";
import { useTranslationContext } from "../providers";

import {
  ChineseAcceptanceOfTerms,
  ChineseChangesToTerms,
  ChineseContact,
  ChineseDescriptionOfServices,
  ChineseDisputeResolution,
  ChineseIntellectualProperty,
  ChineseLiabilityAndDisclaimers,
  ChineseMisc,
  ChinesePaymentAndBilling,
  ChineseTermination,
  ChineseUserResponsibiltiies,
} from "./Chinese";

import {
  EnglishAcceptanceOfTerms,
  EnglishChangesToTerms,
  EnglishContact,
  EnglishDescriptionOfServices,
  EnglishDisputeResolution,
  EnglishIntellectualProperty,
  EnglishLiabilityAndDisclaimers,
  EnglishMisc,
  EnglishPaymentAndBilling,
  EnglishTermination,
  EnglishUserResponsibiltiies,
} from "./English";

const TermsAndConditions = () => {
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
          ? "Tholattice 服务条款"
          : "Terms of Service for Tholattice Digital Marketing"}
      </h1>
      <h2 className="text-center font-bold text-lg">
        {language === "zh-CN"
          ? "生效日期: 2023 年 10 月 16 日"
          : "Effective Date: October 16, 2023"}
      </h2>
      <br />
      <ol>
        <li>
          <h2>
            {language === "zh-CN" ? "1. 接受条款" : "1. Acceptance of Terms"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseAcceptanceOfTerms />
          ) : (
            <EnglishAcceptanceOfTerms />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "2. 服务说明"
              : "2. Description of Services"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseDescriptionOfServices />
          ) : (
            <EnglishDescriptionOfServices />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "3. 用户的责任"
              : "3. User Responsibilities"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseUserResponsibiltiies />
          ) : (
            <EnglishUserResponsibiltiies />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "4. 隐私和数据收集"
              : "4. Privacy and Data Collection"}
          </h2>{" "}
          <br />
          {language === "zh-CN" ? (
            <p>
              请参阅我们的隐私政策，了解有关我们如何收集和保护您的数据的更多详细信息:{" "}
              <Link href="/privacy-policy">
                https://www.tholattice.com/privacy-policy
              </Link>
            </p>
          ) : (
            <p>
              Please reference our Privacy Policy for more details on how we
              collect and protect your data:{" "}
              <Link href="/privacy-policy">
                https://www.tholattice.com/privacy-policy
              </Link>
            </p>
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN" ? "5. 知识产权" : "5. Intellectual Property"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseIntellectualProperty />
          ) : (
            <EnglishIntellectualProperty />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN" ? "6. 付款和账单" : "6. Payment and Billing"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChinesePaymentAndBilling />
          ) : (
            <EnglishPaymentAndBilling />
          )}
        </li>
        <br />
        <li>
          <h2>{language === "zh-CN" ? "7. 终止" : "7. Termination"}</h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseTermination />
          ) : (
            <EnglishTermination />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN" ? "8. 争议解决" : "8. Dispute Resolution"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseDisputeResolution />
          ) : (
            <EnglishDisputeResolution />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN"
              ? "9. 责任和免责声明"
              : "9. Liability and Disclaimers"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseLiabilityAndDisclaimers />
          ) : (
            <EnglishLiabilityAndDisclaimers />
          )}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN" ? "10. 条款变更" : "10. Changes to Terms"}
          </h2>
          <br />
          {language === "zh-CN" ? (
            <ChineseChangesToTerms />
          ) : (
            <EnglishChangesToTerms />
          )}
        </li>
        <br />
        <li>
          <h2>{language === "zh-CN" ? "11. 杂项备注" : "11. Miscellaneous"}</h2>
          <br />
          {language === "zh-CN" ? <ChineseMisc /> : <EnglishMisc />}
        </li>
        <br />
        <li>
          <h2>
            {language === "zh-CN" ? "12. 联系信息" : "12. Contact Information"}
          </h2>
          <br />
          {language === "zh-CN" ? <ChineseContact /> : <EnglishContact />}
        </li>
      </ol>
    </div>
    // </AnimatePresenceWrapper>
  );
};

export default TermsAndConditions;
