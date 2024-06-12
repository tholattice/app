"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { HelpCircle, MinusCircle } from "lucide-react";
import Confetti from "react-dom-confetti";

import CheckCircleFill from "@/components/CheckCircleFill";
import XCircleFill from "@/components/XCircleFill";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Switch from "@/components/Switch";
import Tooltip from "@/components/Tooltip";

import { PLANS } from "@/lib/stripe/utils";
import { nFormatter } from "@/utils/format";

import { useTranslationContext } from "../providers";

import { EnglishPricingHeadline, PricingItemsEnglish } from "./English";
import { ChinesePricingHeadline, PricingItemsChinese } from "./Chinese";

const Pricing = () => {
  const { language } = useTranslationContext();
  const [annualBilling, setAnnualBilling] = useState(false);
  const period = useMemo(
    () => (annualBilling ? "yearly" : "monthly"),
    [annualBilling]
  );

  const mapSlugs = [
    {
      chineseSlug: "必需品",
      englishSlug: "essentials",
    },
    {
      chineseSlug: "专业的",
      englishSlug: "professional",
    },
    {
      chineseSlug: "优质的",
      englishSlug: "premium",
    },
  ];

  function lookupEnglishSlug(chineseSlug: string) {
    for (var i = 0; i < mapSlugs.length; i++) {
      if (mapSlugs[i].chineseSlug === chineseSlug) {
        return mapSlugs[i].englishSlug;
      }
    }
  }

  return (
    <MaxWidthWrapper className="mb-8 mt-16 text-center">
      {language === "zh-CN" ? (
        <ChinesePricingHeadline />
      ) : (
        <EnglishPricingHeadline />
      )}

      <div className="relative mx-auto lg:mb-14 flex max-w-fit items-center space-x-2">
        <div className="flex flex-col justify-center items-center space-y-8">
          <div className="flex flex-row justify-between items-center space-x-2">
            <p className="text-gray-600 text-lg">
              {language === "zh-CN" ? "按月计费" : "Billed Monthly"}
            </p>
            <div className="absolute left-32 mx-auto text-center">
              <Confetti
                active={period === "yearly"}
                config={{ elementCount: 200, spread: 90 }}
              />
            </div>
            <Switch
              fn={setAnnualBilling}
              checked={annualBilling}
              trackDimensions="h-6 w-12"
              thumbDimensions="h-5 w-5"
              thumbTranslate="translate-x-6"
            />
            <p className="text-gray-600 text-lg">
              {language === "zh-CN" ? "按年计费" : "Billed Annually"}
            </p>
          </div>
          <div>
            {annualBilling && (
              <div className="mb-7 sm:mb-0">
                <span
                  className={`rounded-full bg-purple-200 px-3 py-1 text-lg text-purple-700 sm:absolute sm:-top-1.5 ${
                    language === "zh-CN"
                      ? "sm:-right-[7.5rem]"
                      : "sm:-right-[8.5rem]"
                  }`}
                >
                  {language === "zh-CN" ? "🎁 7.5 折!" : "🎁 25% OFF!"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {language === "zh-CN"
          ? PricingItemsChinese.map(
              ({ plan, tagline, activeMasseuses, features, cta }, index) => {
                const price =
                  PLANS.find((p) => p.slug === lookupEnglishSlug(plan))?.price[
                    period
                  ].amount || 0;

                return (
                  <div
                    key={index}
                    className={`relative rounded-2xl bg-white ${
                      plan === "Professional" || plan === "专业的"
                        ? "border-2 border-blue-600 shadow-blue-200"
                        : "border border-gray-200"
                    } shadow-lg`}
                  >
                    {(plan === "Professional" || plan === "专业的") && (
                      <div className="absolute -top-6 left-0 right-0 mx-auto w-32 rounded-full px-3 py-2 text-lg font-medium text-white lifeGradientButtonBg">
                        {language === "zh-CN" ? "受欢迎的" : "Popular"}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="my-3 text-center font-display text-3xl font-normal">
                        {plan}
                      </h3>
                      <p className="text-gray-500">{tagline}</p>
                      <p className="my-5 font-display text-6xl font-semibold">
                        ${period === "yearly" ? nFormatter(price / 12) : price}
                      </p>
                      <p className="text-gray-500">
                        每{period === "yearly" ? "月, 按年计费" : "月"}每个地点
                      </p>
                    </div>
                    <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-1">
                        <p className="text-gray-600">
                          {plan === "Premium" || plan === "优质的"
                            ? "最多: 每个地点 20 名活跃按摩师"
                            : `每个地点最多 ${nFormatter(
                                activeMasseuses
                              )} 名活跃按摩师`}
                        </p>
                        {plan !== "优质的" && (
                          <Tooltip
                            content={`如果达到上限，每增加一名按摩师 5 美元，最多 ${nFormatter(
                              activeMasseuses * 2
                            )} 名。`}
                          >
                            <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          </Tooltip>
                        )}
                        {plan === "优质的" && (
                          <Tooltip content="如果需要额外的活跃按摩师，请发送电子邮件至 alex@tholattice.com。">
                            <HelpCircle className="h-4 w-4 text-gray-600 flex-shink-0" />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <ul className="my-10 space-y-5 px-4 text-left">
                      {features.map(
                        (
                          { text, subText, footnote, neutral, negative },
                          index
                        ) => (
                          <div key={index}>
                            <li key={index} className="flex space-x-5">
                              <div className="flex-shrink-0">
                                {neutral ? (
                                  <MinusCircle
                                    fill="#D4D4D8"
                                    className="h-6 w-6 text-white"
                                  />
                                ) : negative ? (
                                  <XCircleFill className="h-6 w-6 text-gray-300" />
                                ) : (
                                  <CheckCircleFill className="h-6 w-6 text-green-500" />
                                )}
                              </div>
                              {footnote ? (
                                <div className="flex items-center space-x-1">
                                  <p
                                    className={
                                      negative
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }
                                  >
                                    {text}
                                  </p>
                                  <Tooltip content={footnote}>
                                    <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  </Tooltip>
                                </div>
                              ) : (
                                <p
                                  className={
                                    negative ? "text-gray-400" : "text-gray-600"
                                  }
                                >
                                  {text}
                                </p>
                              )}
                            </li>
                            {subText && (
                              <ul className="my-10 space-y-5 px-8">
                                {subText.map(
                                  (
                                    {
                                      subContent,
                                      subFootnote,
                                      subNeutral,
                                      subNegative,
                                    },
                                    index
                                  ) => (
                                    <li key={index} className="flex space-x-5">
                                      <div className="flex-shrink-0">
                                        {subNeutral ? (
                                          <MinusCircle
                                            fill="#D4D4D8"
                                            className="h-6 w-6 text-white"
                                          />
                                        ) : subNegative ? (
                                          <XCircleFill className="h-6 w-6 text-gray-300" />
                                        ) : (
                                          <CheckCircleFill className="h-6 w-6 text-green-500" />
                                        )}
                                      </div>
                                      {subFootnote ? (
                                        <div className="flex items-center space-x-1">
                                          <div
                                            className={
                                              subNegative
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                            }
                                          >
                                            {subContent}
                                          </div>
                                          <Tooltip content={subFootnote}>
                                            <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                          </Tooltip>
                                        </div>
                                      ) : (
                                        <div
                                          className={
                                            subNegative
                                              ? "text-gray-400"
                                              : "text-gray-600"
                                          }
                                        >
                                          {subContent}
                                        </div>
                                      )}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        )
                      )}
                    </ul>
                    <div className="border-t border-gray-200" />
                    <div className="p-5">
                      <Link
                        href={`/register`}
                        className={`${
                          plan === "专业的"
                            ? "lifeGradientButtonBg border border-transparent text-white hover:border-blue-700 hover:bg-white hover:bg-clip-text hover:text-transparent"
                            : "border border-gray-200 bg-black text-white hover:border-black hover:bg-white hover:text-black"
                        } block w-full rounded-full py-2 font-medium transition-all`}
                      >
                        {cta}
                      </Link>
                    </div>
                  </div>
                );
              }
            )
          : PricingItemsEnglish.map(
              ({ plan, tagline, activeMasseuses, features, cta }, index) => {
                const price =
                  PLANS.find((p) => p.slug === plan.toLowerCase())?.price[
                    period
                  ].amount || 0;

                return (
                  <div
                    key={index}
                    className={`relative rounded-2xl bg-white ${
                      plan === "Professional"
                        ? "border-2 border-blue-600 shadow-blue-200"
                        : "border border-gray-200"
                    } shadow-lg`}
                  >
                    {plan === "Professional" && (
                      <div className="absolute -top-6 left-0 right-0 mx-auto w-32 rounded-full px-3 py-2 text-lg font-medium text-white lifeGradientButtonBg">
                        {language === "zh-CN" ? "受欢迎的" : "Popular"}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="my-3 text-center font-display text-3xl font-bold">
                        {plan}
                      </h3>
                      <p className="text-gray-500">{tagline}</p>
                      <p className="my-5 font-display text-6xl font-semibold">
                        ${period === "yearly" ? nFormatter(price / 12) : price}
                      </p>
                      <p className="text-gray-500">
                        per{" "}
                        {period === "yearly"
                          ? "month, billed annually"
                          : "month"}{" "}
                        per location
                      </p>
                    </div>
                    <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-1 p-4">
                        <p className="text-gray-600">
                          {plan === "Premium"
                            ? "Maximum: 20 active masseuses per location"
                            : `Up to ${nFormatter(
                                activeMasseuses
                              )} active massseuses per location`}
                        </p>
                        {plan !== "Premium" && (
                          <Tooltip
                            content={`$5 fee for each additional masseuse up to ${nFormatter(
                              activeMasseuses * 2
                            )} if the cap is reached.`}
                          >
                            <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          </Tooltip>
                        )}
                        {plan === "Premium" && (
                          <Tooltip content="Please email us at alex@tholattice.com if additional masseuses are required.">
                            <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <ul className="my-10 space-y-5 px-4 text-left">
                      {features.map(
                        (
                          { text, subText, footnote, neutral, negative },
                          index
                        ) => (
                          <>
                            <li key={index} className="flex space-x-5">
                              <div className="flex-shrink-0">
                                {neutral ? (
                                  <MinusCircle
                                    fill="#D4D4D8"
                                    className="h-6 w-6 text-white"
                                  />
                                ) : negative ? (
                                  <XCircleFill className="h-6 w-6 text-gray-300" />
                                ) : (
                                  <CheckCircleFill className="h-6 w-6 text-green-500" />
                                )}
                              </div>
                              {footnote ? (
                                <div className="flex items-center space-x-1">
                                  <p
                                    className={
                                      negative
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }
                                  >
                                    {text}
                                  </p>
                                  <Tooltip content={footnote}>
                                    <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  </Tooltip>
                                </div>
                              ) : (
                                <p
                                  className={
                                    negative ? "text-gray-400" : "text-gray-600"
                                  }
                                >
                                  {text}
                                </p>
                              )}
                            </li>
                            {subText && (
                              <ul className="my-10 space-y-5 px-8">
                                {subText.map(
                                  (
                                    {
                                      subContent,
                                      subFootnote,
                                      subNeutral,
                                      subNegative,
                                    },
                                    index
                                  ) => (
                                    <li key={index} className="flex space-x-5">
                                      <div className="flex-shrink-0">
                                        {subNeutral ? (
                                          <MinusCircle
                                            fill="#D4D4D8"
                                            className="h-6 w-6 text-white"
                                          />
                                        ) : subNegative ? (
                                          <XCircleFill className="h-6 w-6 text-gray-300" />
                                        ) : (
                                          <CheckCircleFill className="h-6 w-6 text-green-500" />
                                        )}
                                      </div>
                                      {subFootnote ? (
                                        <div className="flex items-center space-x-1">
                                          <div
                                            className={
                                              subNegative
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                            }
                                          >
                                            {subContent}
                                          </div>
                                          <Tooltip content={subFootnote}>
                                            <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                          </Tooltip>
                                        </div>
                                      ) : (
                                        <div
                                          className={
                                            subNegative
                                              ? "text-gray-400"
                                              : "text-gray-600"
                                          }
                                        >
                                          {subContent}
                                        </div>
                                      )}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </>
                        )
                      )}
                    </ul>
                    <div className="border-t border-gray-200" />
                    <div className="p-5">
                      <Link
                        href={`/register`}
                        className={`${
                          plan === "Professional"
                            ? "lifeGradientButtonBg border border-transparent text-white hover:border-blue-700 hover:bg-white hover:bg-clip-text hover:text-transparent"
                            : "border border-gray-200 bg-black text-white hover:border-black hover:bg-white hover:text-black"
                        } block w-full rounded-full py-2 font-medium transition-all`}
                      >
                        {cta}
                      </Link>
                    </div>
                  </div>
                );
              }
            )}
      </div>
    </MaxWidthWrapper>
  );
};

export default Pricing;
