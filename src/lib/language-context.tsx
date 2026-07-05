import { createContext, useContext, useState, ReactNode } from "react";
import { Language, translations } from "./farmer-data";

interface LangContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem("agriscan_lang") as Language) || "en"
  );

  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem("agriscan_lang", l);
  };

  const t = (key: string) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLanguage = () => useContext(LangContext);
