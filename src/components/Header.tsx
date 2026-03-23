import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, Globe, Image as ImageIcon, Type as TypeIcon, Video as VideoIcon, Film as FilmIcon, FileText as DescribeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RateLimitState } from '../types';
import { UI_LANGUAGES, type UILanguage } from '../i18n';

const LANG_META: Record<UILanguage, { flag: string; native: string }> = {
  en: { flag: '🇬🇧', native: 'English' },
  fr: { flag: '🇫🇷', native: 'Français' },
  ar: { flag: '🇸🇦', native: 'العربية' },
  es: { flag: '🇪🇸', native: 'Español' },
  de: { flag: '🇩🇪', native: 'Deutsch' },
  pt: { flag: '🇵🇹', native: 'Português' },
  ja: { flag: '🇯🇵', native: '日本語' },
  zh: { flag: '🇨🇳', native: '中文' },
  ko: { flag: '🇰🇷', native: '한국어' },
  ru: { flag: '🇷🇺', native: 'Русский' },
};

const IMG_MODELS = [
  ['Midjourney', '/midjourney-prompt-generator/'],
  ['SD',         '/stable-diffusion-prompt-generator/'],
  ['Flux',       '/flux-prompt-generator/'],
  ['DALL·E 3',   '/dall-e-prompt-generator/'],
  ['Firefly',    '/adobe-firefly-prompt-generator/'],
  ['Leonardo',   '/leonardo-ai-prompt-generator/'],
  ['Ideogram',   '/ideogram-prompt-generator/'],
] as const;
const VID_MODELS = [
  ['Veo',    '/veo-prompt-generator/'],
  ['Kling',  '/kling-prompt-generator/'],
  ['Runway', '/runway-prompt-generator/'],
  ['Pika',   '/pika-prompt-generator/'],
  ['Luma',   '/luma-prompt-generator/'],
  ['Sora',   '/sora-prompt-generator/'],
  ['Minimax','/minimax-prompt-generator/'],
  ['Stable', '/stable-video-prompt-generator/'],
] as const;

interface HeaderProps {
  rateLimit: RateLimitState;
  onHistoryOpen: () => void;
  hasHistory: boolean;
}

const colBase = 'flex flex-col gap-0.5';
const imgToolCls =
  'flex items-center gap-2 justify-between rounded-lg px-2 py-1.5 text-[0.8125rem] font-500 transition-all duration-100 hover:bg-[rgba(224,64,251,0.08)] hover:shadow-[inset_2px_0_0_#e040fb] whitespace-nowrap font-inter';
const vidToolCls =
  'flex items-center gap-2 justify-between rounded-lg px-2 py-1.5 text-[0.8125rem] font-500 transition-all duration-100 hover:bg-[rgba(0,229,255,0.08)] hover:shadow-[inset_2px_0_0_#00e5ff] whitespace-nowrap font-inter';
const modelsLabelCls =
  'text-[0.5rem] font-600 tracking-[0.1em] uppercase px-2 pt-2 pb-1 mt-1';
const imgPillCls =
  'text-[0.6875rem] text-[#8888bb] no-underline rounded-full px-2.5 py-0.5 border border-[rgba(136,136,187,0.15)] transition-all duration-150 hover:text-[#e040fb] hover:border-[rgba(224,64,251,0.45)] hover:bg-[rgba(224,64,251,0.09)] hover:shadow-[0_0_8px_rgba(224,64,251,0.15)] font-inter whitespace-nowrap';
const vidPillCls =
  'text-[0.6875rem] text-[#8888bb] no-underline rounded-full px-2.5 py-0.5 border border-[rgba(136,136,187,0.15)] transition-all duration-150 hover:text-[#00e5ff] hover:border-[rgba(0,229,255,0.45)] hover:bg-[rgba(0,229,255,0.09)] hover:shadow-[0_0_8px_rgba(0,229,255,0.12)] font-inter whitespace-nowrap';

export default function Header({ onHistoryOpen, hasHistory }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [showTools, setShowTools] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('theme') || 'dark') as 'dark' | 'light');

  const currentLang = (i18n.language?.substring(0, 2) || 'en') as UILanguage;
  const pathname = window.location.pathname;
  const isActive = (path: string) => pathname === path || pathname.startsWith(path) && path !== '/';

  const pillStyle = (path: string): React.CSSProperties => ({
    color: isActive(lp(path)) ? '#e040fb' : '#8888bb',
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    border: `1px solid ${isActive(lp(path)) ? 'rgba(224,64,251,0.35)' : 'var(--border-subtle)'}`,
    background: isActive(lp(path)) ? 'rgba(224,64,251,0.10)' : 'transparent',
  });
  const onEnter = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    (e.currentTarget as HTMLElement).style.background = 'rgba(224,64,251,0.10)';
    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(224,64,251,0.35)';
    (e.currentTarget as HTMLElement).style.color = '#e040fb';
  };
  const onLeave = (path: string) => (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const active = isActive(lp(path));
    (e.currentTarget as HTMLElement).style.background = active ? 'rgba(224,64,251,0.10)' : 'transparent';
    (e.currentTarget as HTMLElement).style.borderColor = active ? 'rgba(224,64,251,0.35)' : 'var(--border-subtle)';
    (e.currentTarget as HTMLElement).style.color = active ? '#e040fb' : '#8888bb';
  };

  /** Prefix a path with the language slug. English stays at root. */
  const lp = (path: string) => {
    if (currentLang === 'en') return path;
    // For SPA tool routes (/ and /?tab=...) stay at root — the SPA handles its own i18n
    if (path === '/' || path.startsWith('/?')) return path;
    return `/${currentLang}${path}`;
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const switchLanguage = (lng: UILanguage) => {
    i18n.changeLanguage(lng);
    setShowLang(false);
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setShowTools(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLang(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setShowTools(false); setShowLang(false); }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const IMG_MAIN = [
    { href: lp('/'),                label: t('nav.imageToPrompt'), Icon: ImageIcon },
    { href: lp('/text-to-prompt/'), label: t('nav.textToPrompt'),  Icon: TypeIcon  },
    { href: '/?tab=describe-image', label: t('nav.describeImage', 'Describe Image'), Icon: DescribeIcon, isNew: true },
  ];
  const VID_MAIN = [
    { href: lp('/?tab=image-to-video'), label: t('nav.imageToVideo'), Icon: VideoIcon },
    { href: lp('/?tab=text-to-video'),  label: t('nav.textToVideo'),  Icon: FilmIcon  },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur-xl h-[57px] flex items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-2.5 no-underline flex-shrink-0"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img src="/favicon.svg" alt="ImageToPrompt" width="40" height="40" className="rounded-xl flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="font-grotesk text-[1.0625rem] font-700 text-[var(--text-primary)] tracking-tight whitespace-nowrap">
              ImageTo<span className="gradient-clip" style={{ background: 'linear-gradient(135deg, #e040fb, #f06292)' }}>Prompt</span>
            </span>
            <span className="hidden sm:block font-inter text-[0.625rem] text-[var(--text-secondary)] mt-0.5 whitespace-nowrap">
              {t('hero.tagline')}
            </span>
          </div>
        </motion.a>

        {/* Right nav */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Tools dropdown */}
          <div ref={toolsRef} className="relative hidden sm:block">
            <button
              onClick={() => setShowTools((v) => !v)}
              aria-expanded={showTools}
              aria-haspopup="menu"
              className="flex items-center gap-1 font-grotesk text-[0.8125rem] font-600 whitespace-nowrap transition-all duration-200"
              style={{ color: showTools ? '#e040fb' : '#8888bb', padding: '0.3rem 0.75rem', borderRadius: '20px', border: `1px solid ${showTools ? 'rgba(224,64,251,0.35)' : 'var(--border-subtle)'}`, background: showTools ? 'rgba(224,64,251,0.10)' : 'transparent' }}
              onMouseEnter={onEnter}
              onMouseLeave={e => { if (!showTools) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLButtonElement).style.color = '#8888bb'; } }}
            >
              {t('nav.tools')}
              <ChevronDown size={12} className={`transition-transform duration-200 ${showTools ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showTools && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute right-0 top-full mt-2 rounded-2xl border border-[var(--border-subtle)] shadow-2xl z-50 overflow-hidden"
                  style={{
                    backdropFilter: 'blur(20px)',
                    background: 'var(--bg-elevated)',
                    width: '480px',
                    boxShadow: 'var(--shadow-dropdown, 0 20px 60px rgba(0,0,0,0.6))',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="grid p-4" style={{ gridTemplateColumns: '1fr auto 1fr', gap: 0 }}>

                    {/* Image Tools */}
                    <div className={colBase}>
                      <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
                        <span className="text-[0.5625rem] font-700 tracking-[0.12em] uppercase" style={{ color: 'rgba(224,100,251,0.8)' }}>
                          🖼 {t('nav.imageTools')}
                        </span>
                        <span className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                      </div>
                      {IMG_MAIN.map(({ href, label, Icon, isNew }) => (
                        <a key={href} href={href} role="menuitem" onClick={() => setShowTools(false)} className={imgToolCls} style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex items-center gap-2">
                            <Icon size={13} style={{ color: 'rgba(224,100,251,0.55)', flexShrink: 0 }} />
                            {label}
                            {isNew && <span className="rounded-full px-1.5 py-0.5 text-[0.5625rem] font-700 uppercase tracking-wider" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>NEW</span>}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                        </a>
                      ))}
                      <div className={modelsLabelCls} style={{ color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)' }}>{t('nav.models')}</div>
                      <div className="flex flex-wrap gap-1 px-1 pb-1">
                        {IMG_MODELS.map(([name, href]) => (
                          <a key={href} href={lp(href)} onClick={() => setShowTools(false)} className={imgPillCls}>{name}</a>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ width: '1px', background: 'var(--border-subtle)', margin: '0 8px', alignSelf: 'stretch' }} />

                    {/* Video Tools */}
                    <div className={colBase}>
                      <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
                        <span className="text-[0.5625rem] font-700 tracking-[0.12em] uppercase" style={{ color: 'rgba(0,210,255,0.8)' }}>
                          🎬 {t('nav.videoTools')}
                        </span>
                        <span className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                      </div>
                      {VID_MAIN.map(({ href, label, Icon }) => (
                        <a key={href} href={href} role="menuitem" onClick={() => setShowTools(false)} className={vidToolCls} style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex items-center gap-2">
                            <Icon size={13} style={{ color: 'rgba(0,210,255,0.55)', flexShrink: 0 }} />
                            {label}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                        </a>
                      ))}
                      <div className={modelsLabelCls} style={{ color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)' }}>{t('nav.models')}</div>
                      <div className="flex flex-wrap gap-1 px-1 pb-1">
                        {VID_MODELS.map(([name, href]) => (
                          <a key={href} href={lp(href)} onClick={() => setShowTools(false)} className={vidPillCls}>{name}</a>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Blog */}
          <a
            href={lp('/blog/')}
            className="hidden sm:flex items-center font-grotesk text-[0.8125rem] font-600 whitespace-nowrap transition-all duration-200"
            style={pillStyle('/blog/')}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave('/blog/')}
          >
            {t('nav.blog')}
          </a>

          {/* Pricing */}
          <a
            href={lp('/pricing/')}
            className="hidden sm:flex items-center font-grotesk text-[0.8125rem] font-600 whitespace-nowrap transition-all duration-200"
            style={pillStyle('/pricing/')}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave('/pricing/')}
          >
            {t('nav.pricing')}
          </a>

          {/* About */}
          <a
            href={lp('/about/')}
            className="hidden sm:flex items-center font-grotesk text-[0.8125rem] font-600 whitespace-nowrap transition-all duration-200"
            style={pillStyle('/about/')}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave('/about/')}
          >
            {t('nav.about')}
          </a>

          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setShowLang((v) => !v)}
              aria-expanded={showLang}
              aria-haspopup="listbox"
              aria-label={t('language.selectLanguage')}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2 py-1.5 font-inter text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
            >
              <Globe size={14} />
              <span className="hidden sm:inline text-xs font-600 uppercase">{currentLang}</span>
              <ChevronDown size={10} className={`transition-transform duration-200 ${showLang ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showLang && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  role="listbox"
                  aria-label={t('language.selectLanguage')}
                  className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-2xl"
                  style={{ backdropFilter: 'blur(16px)', background: 'var(--bg-elevated)' }}
                >
                  {UI_LANGUAGES.map((lng) => (
                    <button
                      key={lng}
                      role="option"
                      aria-selected={lng === currentLang}
                      onClick={() => switchLanguage(lng)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 font-inter text-sm transition-colors hover:bg-[var(--bg-card)]"
                      style={{ color: lng === currentLang ? 'var(--accent-lens)' : 'var(--text-secondary)' }}
                    >
                      <span className="text-base">{LANG_META[lng].flag}</span>
                      <span>{LANG_META[lng].native}</span>
                      {lng === currentLang && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History */}
          {hasHistory && (
            <button
              onClick={onHistoryOpen}
              aria-label={t('nav.history')}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-sm font-inter text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
            >
              <History size={14} />
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
            title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
            className="flex items-center justify-center rounded-full border transition-all duration-200 hover:scale-110"
            style={{
              width: '34px',
              height: '34px',
              minWidth: '34px',
              fontSize: '15px',
              background: 'var(--toggle-bg, rgba(255,255,255,0.05))',
              borderColor: 'var(--toggle-border, rgba(255,255,255,0.10))',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Try Free CTA */}
          <a
            href="/"
            className="font-grotesk text-[0.8125rem] font-700 rounded-lg px-3 py-1.5 transition-opacity duration-150 hover:opacity-90 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
              color: '#000',
            }}
          >
            {t('nav.tryFree')}
          </a>
        </motion.div>
      </div>
    </header>
  );
}
