import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Keyboard, X } from 'lucide-react';
import UsageCounter from './UsageCounter';
import type { RateLimitState } from '../types';

interface HeaderProps {
  rateLimit: RateLimitState;
  onHistoryOpen: () => void;
  hasHistory: boolean;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'V'], description: 'Paste image from clipboard' },
  { keys: ['Ctrl', 'Enter'], description: 'Run analysis' },
  { keys: ['Esc'], description: 'Reset / clear image' },
  { keys: ['?'], description: 'Show this shortcuts panel' },
];

export default function Header({ rateLimit, onHistoryOpen, hasHistory }: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[var(--accent-lens)] opacity-20 blur-md" />
              <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
                <circle cx="16" cy="16" r="10" stroke="#e040fb" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="6" stroke="#e040fb" strokeWidth="1" opacity="0.6" />
                <circle cx="16" cy="16" r="2.5" fill="#e040fb" />
                <line x1="16" y1="2" x2="16" y2="7" stroke="#e040fb" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="25" x2="16" y2="30" stroke="#e040fb" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="16" x2="7" y2="16" stroke="#e040fb" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="25" y1="16" x2="30" y2="16" stroke="#e040fb" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="font-grotesk text-lg font-700 text-[var(--text-primary)] tracking-tight">
                Prompt<span className="text-[var(--accent-lens)]">Lens</span>
              </span>
              <div className="text-[10px] text-[var(--text-secondary)] font-inter -mt-0.5 hidden sm:block">
                AI Image Prompt Engineer
              </div>
            </div>
          </motion.div>

          {/* Right side actions */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <UsageCounter rateLimit={rateLimit} />

            <button
              onClick={() => setShowShortcuts(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-accent)] hover:text-[var(--accent-lens)]"
              title="Keyboard shortcuts"
            >
              <Keyboard size={15} />
            </button>

            {hasHistory && (
              <button
                onClick={onHistoryOpen}
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
