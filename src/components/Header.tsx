import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown } from 'lucide-react';
import type { RateLimitState } from '../types';

const IMG_MAIN = [
  { href: '/',               label: 'Image to Prompt' },
  { href: '/text-to-prompt/', label: 'Text to Prompt'  },
];
const VID_MAIN = [
  { href: '/?tab=image-to-video', label: 'Image to Video' },
  { href: '/?tab=text-to-video',  label: 'Text to Video'  },
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

// Group into pairs for compact dot-separated rows
function pairModels<T extends readonly [string, string]>(models: readonly T[]) {
  const rows: T[][] = [];
  for (let i = 0; i < models.length; i += 2) {
    rows.push(models.slice(i, i + 2) as T[]);
  }
  return rows;
}

interface HeaderProps {
  rateLimit: RateLimitState;
  onHistoryOpen: () => void;
  hasHistory: boolean;
}

const colBase = 'flex flex-col gap-0.5';
const headingCls = 'text-[0.5625rem] font-700 tracking-[0.12em] uppercase pb-2.5 px-1.5';
const mainLinkCls =
  'flex items-center justify-between rounded-lg px-2 py-1.5 text-[0.8125rem] font-500 text-[#d8d8f0] transition-colors duration-100 hover:bg-white/[0.07] hover:text-white whitespace-nowrap font-inter';
const modelsLabelCls = 'text-[0.5rem] font-600 tracking-[0.1em] uppercase pt-2 pb-0.5 px-2';
const modelRowCls = 'flex items-center gap-0.5 px-1.5 py-0.5 flex-wrap';
const modelLinkCls = 'text-[0.75rem] text-[#7878aa] no-underline rounded px-1 py-0.5 transition-colors duration-100 hover:text-[#e040fb] hover:bg-[rgba(224,64,251,0.08)] whitespace-nowrap font-inter';
const dotCls = 'text-[0.75rem] select-none px-0.5' ;

export default function Header({ onHistoryOpen, hasHistory }: HeaderProps) {
  const [showTools, setShowTools] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

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
                  style={{ backdropFilter: 'blur(20px)', background: '#12121e', width: '480px' }}
                >
                  <div className="grid p-4" style={{ gridTemplateColumns: '1fr auto 1fr', gap: 0 }}>

                    {/* ── Left: Image Tools ── */}
                    <div className={colBase}>
                      <div className={headingCls} style={{ color: 'rgba(136,136,187,0.55)' }}>🖼 Image Tools</div>
                      {IMG_MAIN.map(({ href, label }) => (
                        <a key={href} href={href} role="menuitem" onClick={() => setShowTools(false)} className={mainLinkCls}>
                          {label} <span style={{ color: 'rgba(136,136,187,0.45)', fontSize: '0.75rem' }}>→</span>
                        </a>
                      ))}
                      <div className={modelsLabelCls} style={{ color: 'rgba(136,136,187,0.35)' }}>Models</div>
                      {pairModels(IMG_MODELS).map((row, i) => (
                        <div key={i} className={modelRowCls}>
                          {row.map(([name, href], j) => (
                            <>
                              <a key={href} href={href} onClick={() => setShowTools(false)} className={modelLinkCls}>{name}</a>
                              {j < row.length - 1 && <span className={dotCls} style={{ color: 'rgba(136,136,187,0.25)' }}>·</span>}
                            </>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* ── Divider ── */}
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 8px', alignSelf: 'stretch' }} />

                    {/* ── Right: Video Tools ── */}
                    <div className={colBase}>
                      <div className={headingCls} style={{ color: 'rgba(136,136,187,0.55)' }}>🎬 Video Tools</div>
                      {VID_MAIN.map(({ href, label }) => (
                        <a key={href} href={href} role="menuitem" onClick={() => setShowTools(false)} className={mainLinkCls}>
                          {label} <span style={{ color: 'rgba(136,136,187,0.45)', fontSize: '0.75rem' }}>→</span>
                        </a>
                      ))}
                      <div className={modelsLabelCls} style={{ color: 'rgba(136,136,187,0.35)' }}>Models</div>
                      {pairModels(VID_MODELS).map((row, i) => (
                        <div key={i} className={modelRowCls}>
                          {row.map(([name, href], j) => (
                            <>
                              <a key={href} href={href} onClick={() => setShowTools(false)} className={modelLinkCls}>{name}</a>
                              {j < row.length - 1 && <span className={dotCls} style={{ color: 'rgba(136,136,187,0.25)' }}>·</span>}
                            </>
                          ))}
                        </div>
                      ))}
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
