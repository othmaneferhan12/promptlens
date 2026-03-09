import { useState } from 'react';
import { motion } from 'framer-motion';
import type { RateLimitState } from '../types';

interface UsageCounterProps {
  rateLimit: RateLimitState;
  onLimitClick?: () => void;
}

export default function UsageCounter({ rateLimit, onLimitClick }: UsageCounterProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { usageCount, maxUsage, timeUntilReset } = rateLimit;
  const pct = (usageCount / maxUsage) * 100;

  const color =
    usageCount >= maxUsage
      ? 'var(--error)'
      : usageCount >= maxUsage - 2
      ? 'var(--warning)'
      : 'var(--accent-lens)';

  return (
    <div className="relative">
      <button
        className="relative flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 transition-all duration-200 hover:border-[var(--border-accent)]"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={usageCount >= maxUsage ? onLimitClick : undefined}
        style={{ cursor: usageCount >= maxUsage ? 'pointer' : 'default' }}
      >
        {/* Fill bar */}
        <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span
          className="font-mono text-xs font-500"
          style={{ color }}
        >
          {usageCount} / {maxUsage}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 shadow-xl text-xs font-inter">
          <p className="text-[var(--text-primary)] font-500">Free daily analyses</p>
          <p className="mt-1 text-[var(--text-secondary)]">
            Resets in <span className="text-[var(--accent-lens)]">{timeUntilReset}</span>
          </p>
          {usageCount >= maxUsage && (
            <p className="mt-1 text-[var(--error)]">Limit reached — come back tomorrow!</p>
          )}
        </div>
      )}
    </div>
  );
}
