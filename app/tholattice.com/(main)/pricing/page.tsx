// "use client";

// import { useEffect, useState } from "react";

// import FAQ from "../components/FAQ";
// import Logos from "../../../components/CustomerLogos";
import Pricing from "./Pricing";

// import AnimatePresenceWrapper from "../../components/AnimatePresenceWrapper";
// import { useTranslationContext } from "../providers";

// export const metadata = {
//   title: "Tholattice Digital Marketing",
// }

// Note: Metadata construction needed for home page and domain sites

const PricingPage = () => {
  // const { language } = useTranslationContext();
  // const [logosCopy, setLogosCopy] = useState("");

  // useEffect(() => {
  //   if (language === "zh-CN") {
  //     setLogosCopy("深受全国女按摩师信赖和喜爱");
  //   } else {
  //     setLogosCopy("Trusted & loved by masseuses all over the country");
  //   }
  // }, [language]);

  return (
    <section>
      <Pricing />
    </section>
  );
};

export default PricingPage;
