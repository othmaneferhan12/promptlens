import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  isLaunch?: boolean;
  items: { type: 'new' | 'improved' | 'fixed'; text: string }[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    version: 'v1.2',
    date: 'March 2026',
    items: [
      { type: 'new',      text: 'Multi-language support (10 languages)' },
      { type: 'new',      text: 'Added SEO content sections' },
      { type: 'improved', text: 'Improved prompt accuracy for Flux model' },
      { type: 'improved', text: 'Faster processing (avg 1.8 seconds)' },
    ],
  },
  {
    version: 'v1.1',
    date: 'February 2026',
    items: [
      { type: 'new',      text: 'Creative remix variant for every prompt' },
      { type: 'new',      text: 'Color palette extraction (hex codes)' },
      { type: 'new',      text: 'Clipboard paste (Ctrl+V) anywhere on page' },
      { type: 'improved', text: 'Better negative prompt generation' },
      { type: 'improved', text: 'Mobile responsive improvements' },
    ],
  },
  {
    version: 'v1.0',
    date: 'January 2026',
    isLaunch: true,
    items: [
      { type: 'new', text: 'Initial launch' },
      { type: 'new', text: '7 AI models: MJ, SD, Flux, DALL-E 3, Firefly, Leonardo, Ideogram' },
      { type: 'new', text: 'Style selector (6 modes)' },
      { type: 'new', text: 'Prompt history (last 20)' },
    ],
  },
];

const TYPE_CONFIG = {
  new:      { icon: '✦', label: 'New',      color: 'var(--accent-lens)' },
  improved: { icon: '🔧', label: 'Improved', color: 'var(--accent-cyan)' },
  fixed:    { icon: '🐛', label: 'Fixed',    color: '#4ade80' },
} as const;

interface ChangelogPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangelogPage({ isOpen, onClose }: ChangelogPageProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-label="Changelog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
              <div>
                <h2 className="font-grotesk text-lg font-700 text-[var(--text-primary)]">
                  What&apos;s New
                </h2>
                <p className="font-inter text-xs text-[var(--text-secondary)]">
                  Release history
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
                aria-label="Close changelog"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable entries */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="relative space-y-8 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-8px)] before:w-px before:bg-[var(--border-subtle)]">
                {ENTRIES.map((entry) => (
                  <div key={entry.version} className="relative pl-8">
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--accent-lens)] bg-[var(--bg-elevated)]"
                    />

                    {/* Version + date */}
                    <div className="mb-3 flex items-center gap-2 flex-wrap">
                      <span
                        className="rounded-md px-2 py-0.5 font-mono text-xs font-600"
                        style={{ background: 'var(--accent-lens)22', color: 'var(--accent-lens)' }}
                      >
                        {entry.version}
                      </span>
                      <span className="font-inter text-xs text-[var(--text-secondary)]">
                        {entry.date}
                      </span>
                      {entry.isLaunch && (
                        <span className="text-xs">🚀</span>
                      )}
                    </div>

                    {/* Items */}
                    <ul className="space-y-2">
                      {entry.items.map((item, i) => {
                        const cfg = TYPE_CONFIG[item.type];
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <span
                              className="mt-0.5 text-sm leading-none"
                              style={{ color: cfg.color }}
                              aria-label={cfg.label}
                            >
                              {cfg.icon}
                            </span>
                            <span className="font-inter text-sm text-[var(--text-primary)]">
                              {item.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
