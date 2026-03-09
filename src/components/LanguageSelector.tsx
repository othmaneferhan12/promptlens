import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SupportedLanguage, LanguageConfig } from '../types';

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', label: 'English',    flag: '🇬🇧', nativeName: 'English'    },
  { code: 'fr', label: 'French',     flag: '🇫🇷', nativeName: 'Français'   },
  { code: 'es', label: 'Spanish',    flag: '🇪🇸', nativeName: 'Español'    },
  { code: 'de', label: 'German',     flag: '🇩🇪', nativeName: 'Deutsch'    },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹', nativeName: 'Português'  },
  { code: 'ar', label: 'Arabic',     flag: '🇸🇦', nativeName: 'العربية'    },
  { code: 'ja', label: 'Japanese',   flag: '🇯🇵', nativeName: '日本語'      },
  { code: 'zh', label: 'Chinese',    flag: '🇨🇳', nativeName: '中文'        },
  { code: 'it', label: 'Italian',    flag: '🇮🇹', nativeName: 'Italiano'   },
  { code: 'nl', label: 'Dutch',      flag: '🇳🇱', nativeName: 'Nederlands' },
];

interface LanguageSelectorProps {
  selected: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}

export default function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === selected) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Output language: ${current.label}`}
        className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 font-inter text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent-lens)] hover:text-[var(--text-primary)]"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeName}</span>
        <ChevronDown
          size={14}
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select output language"
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === selected}
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 font-inter text-sm transition-colors hover:bg-[var(--bg-card)]"
              style={{
                color: lang.code === selected ? 'var(--accent-lens)' : 'var(--text-secondary)',
              }}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              <span className="ml-auto text-xs opacity-50">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
