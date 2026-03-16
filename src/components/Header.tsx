import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown } from 'lucide-react';
import type { RateLimitState } from '../types';

const MODEL_LINKS = [
  { href: '/midjourney-prompt-generator/',       icon: '🎨', label: 'Midjourney',       color: '#00b4d8' },
  { href: '/stable-diffusion-prompt-generator/', icon: '⚙️', label: 'Stable Diffusion', color: '#ff6b35' },
  { href: '/flux-prompt-generator/',             icon: '⚡', label: 'Flux AI',           color: '#7c3aed' },
  { href: '/dall-e-prompt-generator/',           icon: '🧠', label: 'DALL·E 3',          color: '#10a37f' },
  { href: '/adobe-firefly-prompt-generator/',    icon: '🦋', label: 'Adobe Firefly',    color: '#ff4444' },
  { href: '/leonardo-ai-prompt-generator/',      icon: '🎮', label: 'Leonardo AI',      color: '#f59e0b' },
  { href: '/ideogram-prompt-generator/',         icon: '✍️', label: 'Ideogram',         color: '#06b6d4' },
];

interface HeaderProps {
  rateLimit: RateLimitState;
  onHistoryOpen: () => void;
  hasHistory: boolean;
}

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
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur-xl h-[64px] flex items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-2.5 no-underline"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img src="/favicon.svg" alt="ImageToPrompt" width="40" height="40" className="rounded-xl flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="font-grotesk text-[1.0625rem] font-700 text-[var(--text-primary)] tracking-tight">
              ImageTo<span className="text-[var(--accent-lens)]">Prompt</span>
            </span>
            <span className="hidden sm:block font-inter text-[0.625rem] text-[var(--text-secondary)] mt-0.5">
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
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1.5 shadow-2xl z-50"
                  style={{ backdropFilter: 'blur(20px)' }}
                >
                  {MODEL_LINKS.map((m) => (
                    <a
                      key={m.href}
                      href={m.href}
                      role="menuitem"
                      onClick={() => setShowTools(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-inter text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                    >
                      <span className="text-base leading-none">{m.icon}</span>
                      <span>{m.label}</span>
                      <span
                        className="ml-auto text-[10px] font-600 rounded-full px-1.5 py-0.5"
                        style={{ background: `${m.color}18`, color: m.color }}
                      >
                        Generator
                      </span>
                    </a>
                  ))}
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

          {/* History (conditional) */}
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
