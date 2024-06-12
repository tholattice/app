"use client";

import { useEffect, useState, ReactNode } from "react";
import Error from "next/error";

// import { useTranslationContext } from "../providers";

interface ErrorProps {
  copy?: string | ReactNode;
  code?: number;
}

const ErrorLight: React.FC<ErrorProps> = ({ copy, code = 404 }) => {
  // const { language } = useTranslationContext();
  const [errorTitle, setErrorTitle] = useState(copy);

  useEffect(() => {
    if (!copy) {
      // if (language === "zh-CN") {
      setErrorTitle("无法找到该页面. This page could not be found");
      // } else [setErrorTitle("This page could not be found")];
    }
  }, [copy]);

  return (
    <div>
      <Error
        title={errorTitle as string}
        withDarkMode={false}
        statusCode={code}
      />
    </div>
  );
};

export default ErrorLight;
