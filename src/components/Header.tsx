import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, Image as ImageIcon, Type as TypeIcon, Video as VideoIcon, Film as FilmIcon } from 'lucide-react';
import type { RateLimitState } from '../types';

const IMG_MAIN = [
  { href: '/',                label: 'Image to Prompt', Icon: ImageIcon },
  { href: '/text-to-prompt/', label: 'Text to Prompt',  Icon: TypeIcon  },
];
const VID_MAIN = [
  { href: '/?tab=image-to-video', label: 'Image to Video', Icon: VideoIcon },
  { href: '/?tab=text-to-video',  label: 'Text to Video',  Icon: FilmIcon  },
];
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
  'flex items-center gap-2 justify-between rounded-lg px-2 py-1.5 text-[0.8125rem] font-500 text-[#d8d8f0] transition-all duration-100 hover:bg-[rgba(224,64,251,0.08)] hover:text-white hover:shadow-[inset_2px_0_0_#e040fb] whitespace-nowrap font-inter';
const vidToolCls =
  'flex items-center gap-2 justify-between rounded-lg px-2 py-1.5 text-[0.8125rem] font-500 text-[#d8d8f0] transition-all duration-100 hover:bg-[rgba(0,229,255,0.08)] hover:text-white hover:shadow-[inset_2px_0_0_#00e5ff] whitespace-nowrap font-inter';
const modelsLabelCls =
  'text-[0.5rem] font-600 tracking-[0.1em] uppercase text-[rgba(136,136,187,0.3)] px-2 pt-2 pb-1 mt-1 border-t border-white/[0.05]';
const imgPillCls =
  'text-[0.6875rem] text-[#8888bb] no-underline rounded-full px-2.5 py-0.5 border border-[rgba(136,136,187,0.15)] transition-all duration-150 hover:text-[#e040fb] hover:border-[rgba(224,64,251,0.45)] hover:bg-[rgba(224,64,251,0.09)] hover:shadow-[0_0_8px_rgba(224,64,251,0.15)] font-inter whitespace-nowrap';
const vidPillCls =
  'text-[0.6875rem] text-[#8888bb] no-underline rounded-full px-2.5 py-0.5 border border-[rgba(136,136,187,0.15)] transition-all duration-150 hover:text-[#00e5ff] hover:border-[rgba(0,229,255,0.45)] hover:bg-[rgba(0,229,255,0.09)] hover:shadow-[0_0_8px_rgba(0,229,255,0.12)] font-inter whitespace-nowrap';

export default function Header({ onHistoryOpen, hasHistory }: HeaderProps) {
  const [showTools, setShowTools] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('theme') || 'dark') as 'dark' | 'light');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setShowTools(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowTools(false);
    }
    if (showTools) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showTools]);

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
              ImageTo<span style={{ background: 'linear-gradient(135deg, #e040fb, #f06292)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prompt</span>
            </span>
            <span className="hidden sm:block font-inter text-[0.625rem] text-[var(--text-secondary)] mt-0.5 whitespace-nowrap">
              Free AI Prompt Generator
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
              className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 font-inter text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
            >
              Tools
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
                    background: 'linear-gradient(160deg, #13131f 0%, #0d0d18 100%)',
                    width: '480px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="grid p-4" style={{ gridTemplateColumns: '1fr auto 1fr', gap: 0 }}>

                    {/* ── Left: Image Tools ── */}
                    <div className={colBase}>
                      {/* Heading */}
                      <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
                        <span className="text-[0.5625rem] font-700 tracking-[0.12em] uppercase" style={{ color: 'rgba(224,100,251,0.8)' }}>
                          🖼 Image Tools
                        </span>
                        <span className="flex-1 h-px bg-white/[0.05]" />
                      </div>
                      {/* Main tools */}
                      {IMG_MAIN.map(({ href, label, Icon }) => (
                        <a key={href} href={href} role="menuitem" onClick={() => setShowTools(false)} className={imgToolCls}>
                          <span className="flex items-center gap-2">
                            <Icon size={13} style={{ color: 'rgba(224,100,251,0.55)', flexShrink: 0 }} />
                            {label}
                          </span>
                          <span style={{ color: 'rgba(136,136,187,0.4)', fontSize: '0.75rem' }}>→</span>
                        </a>
                      ))}
                      {/* Models */}
                      <div className={modelsLabelCls}>Models</div>
                      <div className="flex flex-wrap gap-1 px-1 pb-1">
                        {IMG_MODELS.map(([name, href]) => (
                          <a key={href} href={href} onClick={() => setShowTools(false)} className={imgPillCls}>{name}</a>
                        ))}
                      </div>
                    </div>

                    {/* ── Divider ── */}
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 8px', alignSelf: 'stretch' }} />

                    {/* ── Right: Video Tools ── */}
                    <div className={colBase}>
                      {/* Heading */}
                      <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
                        <span className="text-[0.5625rem] font-700 tracking-[0.12em] uppercase" style={{ color: 'rgba(0,210,255,0.8)' }}>
                          🎬 Video Tools
                        </span>
                        <span className="flex-1 h-px bg-white/[0.05]" />
                      </div>
                      {/* Main tools */}
                      {VID_MAIN.map(({ href, label, Icon }) => (
                        <a key={href} href={href} role="menuitem" onClick={() => setShowTools(false)} className={vidToolCls}>
                          <span className="flex items-center gap-2">
                            <Icon size={13} style={{ color: 'rgba(0,210,255,0.55)', flexShrink: 0 }} />
                            {label}
                          </span>
                          <span style={{ color: 'rgba(136,136,187,0.4)', fontSize: '0.75rem' }}>→</span>
                        </a>
                      ))}
                      {/* Models */}
                      <div className={modelsLabelCls}>Models</div>
                      <div className="flex flex-wrap gap-1 px-1 pb-1">
                        {VID_MODELS.map(([name, href]) => (
                          <a key={href} href={href} onClick={() => setShowTools(false)} className={vidPillCls}>{name}</a>
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
            href="/blog/"
            className="hidden sm:flex items-center rounded-lg px-3 py-1.5 font-inter text-sm text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)]"
          >
            Blog
          </a>

          {/* Pricing pill */}
          <a
            href="/pricing/"
            className="hidden sm:flex items-center font-grotesk text-[0.8125rem] font-600 whitespace-nowrap transition-all duration-200"
            style={{
              color: '#e040fb',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              border: '1px solid transparent',
              background: 'transparent',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(224,64,251,0.10)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(224,64,251,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'; }}
          >
            Pricing
          </a>

          {/* About pill */}
          <a
            href="/about/"
            className="hidden sm:flex items-center font-grotesk text-[0.8125rem] font-600 whitespace-nowrap transition-all duration-200"
            style={{
              color: '#8888bb',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,229,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,229,255,0.3)'; (e.currentTarget as HTMLAnchorElement).style.color = '#00e5ff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#8888bb'; }}
          >
            About
          </a>

          {/* History */}
          {hasHistory && (
            <button
              onClick={onHistoryOpen}
              aria-label="Open prompt history"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-sm font-inter text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
            >
              <History size={14} />
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
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
            Try Free →
          </a>
        </motion.div>
      </div>
    </header>
  );
}
