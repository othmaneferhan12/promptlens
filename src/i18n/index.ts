import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';

export const UI_LANGUAGES = ['en', 'fr', 'ar', 'es', 'de', 'pt', 'ja', 'zh', 'ko', 'ru'] as const;
export type UILanguage = (typeof UI_LANGUAGES)[number];

// Detect language synchronously before init — same priority as LanguageDetector
function detectLang(): UILanguage {
  const qs = new URLSearchParams(window.location.search).get('lang') as UILanguage | null;
  if (qs && (UI_LANGUAGES as readonly string[]).includes(qs)) return qs;
  const stored = localStorage.getItem('ui-lang') as UILanguage | null;
  if (stored && (UI_LANGUAGES as readonly string[]).includes(stored)) return stored;
  const nav = navigator.language?.substring(0, 2) as UILanguage;
  if ((UI_LANGUAGES as readonly string[]).includes(nav)) return nav;
  return 'en';
}

const detected = detectLang();

// Initialize synchronously with English only (fast, ~14KB vs 142KB)
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: UI_LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'ui-lang',
      caches: ['localStorage'],
    },
  });

// Lazy-load the detected language — dynamic import creates a separate chunk per language
const LANG_IMPORTS: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  fr: () => import('./fr.json'),
  ar: () => import('./ar.json'),
  es: () => import('./es.json'),
  de: () => import('./de.json'),
  pt: () => import('./pt.json'),
  ja: () => import('./ja.json'),
  zh: () => import('./zh.json'),
  ko: () => import('./ko.json'),
  ru: () => import('./ru.json'),
};

function loadLang(lng: string) {
  const loader = LANG_IMPORTS[lng];
  if (!loader) return;
  loader().then(mod => {
    i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
    i18n.changeLanguage(lng);
  });
}

if (detected !== 'en') loadLang(detected);

// Also load on explicit language change (user switches via UI)
i18n.on('languageChanged', (lng) => {
  if (!i18n.hasResourceBundle(lng, 'translation')) loadLang(lng);
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng);
});

// Apply direction immediately for detected language
const dir = detected === 'ar' ? 'rtl' : 'ltr';
document.documentElement.setAttribute('dir', dir);
document.documentElement.setAttribute('lang', detected);

export default i18n;
