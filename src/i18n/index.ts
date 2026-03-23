import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';
import es from './es.json';
import de from './de.json';
import pt from './pt.json';
import ja from './ja.json';
import zh from './zh.json';
import ko from './ko.json';

export const UI_LANGUAGES = ['en', 'fr', 'ar', 'es', 'de', 'pt', 'ja', 'zh', 'ko'] as const;
export type UILanguage = (typeof UI_LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
      es: { translation: es },
      de: { translation: de },
      pt: { translation: pt },
      ja: { translation: ja },
      zh: { translation: zh },
      ko: { translation: ko },
    },
    fallbackLng: 'en',
    supportedLngs: UI_LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'ui-lang',
      caches: ['localStorage'],
    },
  });

// Apply RTL/LTR and lang attribute on language change
function applyDirection(lng: string) {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng);
}

applyDirection(i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;
