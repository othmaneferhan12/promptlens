import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface PromptCardProps {
  label: string;
  content: string;
  accent?: string;
  showLineNumbers?: boolean;
  badge?: string;
  onRegenerate?: () => void;
  regenerateCooldown?: number; // seconds
  icon?: string;
}

export default function PromptCard({
  label,
  content,
  accent = 'var(--accent-lens)',
  showLineNumbers = false,
  badge,
  onRegenerate,
  regenerateCooldown = 3,
  icon,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [cooldownSecs, setCooldownSecs] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRegenerate = () => {
    if (cooldownSecs > 0 || !onRegenerate) return;
    setRegenerating(true);
    onRegenerate();
    setCooldownSecs(regenerateCooldown);
    const start = regenerateCooldown;
    let remaining = start;
    cooldownRef.current = setInterval(() => {
      remaining -= 1;
      setCooldownSecs(remaining);
      if (remaining <= 0) {
        clearInterval(cooldownRef.current!);
        setRegenerating(false);
      }
    }, 1000);
  };

  const lines = content.split('\n');

  return (
    <div
      className="overflow-hidden rounded-2xl border transition-all duration-300"
      style={{
        borderColor: 'var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="font-mono text-xs font-500" style={{ color: accent }}>
            {label}
          </span>
          {badge && (
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] font-600 uppercase"
              style={{ backgroundColor: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {content && (
            <span className="font-mono text-[10px] text-[var(--text-secondary)]">
              {content.length} chars
            </span>
          )}
          {onRegenerate && (
            <button
              onClick={handleRegenerate}
              disabled={cooldownSecs > 0}
              className="flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)] disabled:opacity-50"
              title="Regenerate (3s cooldown)"
            >
              <motion.div animate={regenerating ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw size={11} />
              </motion.div>
              {cooldownSecs > 0 ? `${cooldownSecs}s` : 'Remix'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs transition-all duration-200 hover:bg-[var(--bg-void)]"
            style={{ color: copied ? 'var(--success)' : 'var(--text-secondary)' }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check size={12} />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy size={12} />
                </motion.div>
              )}
            </AnimatePresence>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="relative max-h-64 overflow-y-auto p-4 scrollbar-thin" style={{ backgroundColor: 'var(--bg-void)' }}>
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="group">
                  <td className="select-none pr-4 text-right font-mono text-xs text-[var(--text-secondary)]/40 w-8">
                    {i + 1}
                  </td>
                  <td className="font-mono text-sm leading-relaxed text-[var(--text-primary)] break-all">
                    {line || '\u00A0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="font-mono text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap break-words">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}
