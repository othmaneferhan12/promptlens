import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Clock } from 'lucide-react';
import type { HistoryItem, AnalysisResult } from '../types';
import { getModelConfig, getStyleConfig, timeAgo } from '../utils/imageUtils';

interface PromptHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRestore: (result: AnalysisResult, item: HistoryItem) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export default function PromptHistory({
  isOpen,
  onClose,
  history,
  onRestore,
  onClear,
  onRemove,
}: PromptHistoryProps) {
  const { t } = useTranslation();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
              <div>
                <h2 className="font-grotesk text-base font-600 text-[var(--text-primary)]">
                  {t('history.title')}
                </h2>
                <p className="font-inter text-xs text-[var(--text-secondary)]">
                  {t('history.saved', { count: history.length })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClear}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-inter text-xs text-[var(--error)]/70 transition-all hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                  >
                    <Trash2 size={12} />
                    {t('history.clearAll')}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-3xl">
                    🕰️
                  </div>
                  <div>
                    <p className="font-grotesk text-base font-600 text-[var(--text-primary)]">
                      {t('history.emptyTitle')}
                    </p>
                    <p className="mt-1 font-inter text-xs text-[var(--text-secondary)]">
                      {t('history.emptyMessage')}
                    </p>
                  </div>
                </div>
              ) : (
                history.map((item) => {
                  const modelConfig = getModelConfig(item.model);
                  const styleConfig = getStyleConfig(item.style);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group flex gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 transition-all hover:border-[var(--border-accent)] cursor-pointer"
                      onClick={() => { onRestore(item.result, item); onClose(); }}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--border-subtle)]">
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span
                            className="rounded-full px-2 py-0.5 font-mono text-[9px] font-600"
                            style={{
                              backgroundColor: `${modelConfig.color}20`,
                              color: modelConfig.color,
                            }}
                          >
                            {modelConfig.icon} {modelConfig.name}
                          </span>
                          <span className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
                            {styleConfig.emoji} {styleConfig.label}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {item.result.mainPrompt.slice(0, 80)}…
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[var(--text-secondary)]/60">
                          <Clock size={10} />
                          <span className="font-mono text-[10px]">{timeAgo(item.timestamp)}</span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                        className="opacity-0 group-hover:opacity-100 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-all hover:text-[var(--error)]"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
