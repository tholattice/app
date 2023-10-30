"use client";

import {
  ReactNode,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface ITranslationContext {
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}

export const TranslationContext = createContext<ITranslationContext>({
  language: "",
  setLanguage: (): string => "",
});

// Maybe consider passing in an actual object instead of string values in the future?

export default function Providers({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("zh-CN");

  return (
    <TranslationContext.Provider value={{ language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslationContext = () => useContext(TranslationContext);
