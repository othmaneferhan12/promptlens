import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Keyboard, X, ChevronDown } from 'lucide-react';
import UsageCounter from './UsageCounter';
import LanguageSelector from './LanguageSelector';
import type { RateLimitState, SupportedLanguage } from '../types';

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
  onChangelogOpen: () => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'V'], description: 'Paste image from clipboard' },
  { keys: ['Ctrl', 'Enter'], description: 'Run analysis' },
  { keys: ['Esc'], description: 'Reset / clear image' },
  { keys: ['?'], description: 'Show this shortcuts panel' },
];

export default function Header({ rateLimit, onHistoryOpen, hasHistory, onChangelogOpen, language, onLanguageChange }: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setShowTools(false);
      }
    }
    if (showTools) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTools]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img src="/favicon.svg" alt="ImageToPrompt" width="36" height="36" className="rounded-xl" />
            <div>
              <span className="font-grotesk text-lg font-700 text-[var(--text-primary)] tracking-tight">
                ImageTo<span className="text-[var(--accent-lens)]">Prompt</span>
              </span>
              <div className="text-[10px] text-[var(--text-secondary)] font-inter -mt-0.5 hidden sm:block">
                Free AI Prompt Generator
              </div>
            </div>
          </motion.div>

          {/* Right side actions */}
          <motion.div
            className="flex items-center gap-2"
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

            <a
              href="/blog/"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 font-inter text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
            >
              Blog
            </a>

            {/* Site language links */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 font-inter text-xs text-[var(--text-secondary)]">
              <a href="/fr/" className="hover:text-[var(--accent-lens)] transition-colors" title="Français">FR</a>
              <span className="opacity-20">|</span>
              <a href="/ar/" className="hover:text-[var(--accent-lens)] transition-colors" title="العربية">AR</a>
            </div>

            <UsageCounter rateLimit={rateLimit} />

            <LanguageSelector selected={language} onChange={onLanguageChange} />

            {/* What's New pill */}
            <button
              onClick={onChangelogOpen}
              aria-label="What's new — open changelog"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] px-3 py-1 font-inter text-xs text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent-lens)] hover:text-[var(--accent-lens)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--accent-lens)' }}
              />
              v1.2
            </button>

            <button
              onClick={() => setShowShortcuts(true)}
              aria-label="Keyboard shortcuts"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--accent-lens)]"
            >
              <Keyboard size={15} />
            </button>

            {hasHistory && (
              <button
                onClick={onHistoryOpen}
                aria-label="Open prompt history"
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm font-inter text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
              >
                <History size={14} />
                <span className="hidden sm:inline">History</span>
              </button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShortcuts(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-sm rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-grotesk text-lg font-600 text-[var(--text-primary)]">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  aria-label="Close shortcuts panel"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X size={16} />
                </button>
              </div>
              <ul className="space-y-3">
                {SHORTCUTS.map((s, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm font-inter text-[var(--text-secondary)]">
                      {s.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k) => (
                        <kbd
                          key={k}
                          className="rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-0.5 font-mono text-xs text-[var(--text-primary)]"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
