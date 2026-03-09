import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Share2, Clock } from 'lucide-react';

interface RateLimitModalProps {
  onClose: () => void;
  timeUntilReset: string;
}

export default function RateLimitModal({ onClose, timeUntilReset }: RateLimitModalProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleShare = () => {
    const text = 'Check out PromptLens — free AI image prompt generator! 🎨';
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'PromptLens', text, url });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <motion.div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Purple top gradient band */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent-lens)] via-[var(--accent-cyan)] to-[var(--accent-lens)]" />

        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-5 flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
          >
            <X size={16} />
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h2 className="font-grotesk text-2xl font-700 text-[var(--text-primary)]">
              You're on a roll!
            </h2>
            <p className="mt-2 font-inter text-sm text-[var(--text-secondary)]">
              You've used all{' '}
              <span className="font-600 text-[var(--text-primary)]">10 free analyses</span> for
              today. Come back tomorrow for another round!
            </p>
          </div>

          {/* Countdown */}
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
            <Clock size={18} className="text-[var(--accent-lens)]" />
            <div>
              <p className="font-mono text-xs text-[var(--text-secondary)]">Resets in</p>
              <p className="font-grotesk text-xl font-700 text-[var(--accent-lens)]">
                {timeUntilReset}
              </p>
            </div>
          </div>

          {/* Email notification (UI only) */}
          <div className="mt-5">
            <p className="mb-2 font-inter text-xs text-[var(--text-secondary)]">
              Get notified when your limit resets:
            </p>
            {!subscribed ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 font-inter text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--border-accent)]"
                />
                <button
                  onClick={() => { if (email) setSubscribed(true); }}
                  disabled={!email}
                  className="rounded-xl bg-[var(--accent-lens)] px-4 py-2 font-grotesk text-sm font-600 text-black disabled:opacity-50"
                >
                  Notify
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 px-3 py-2">
                <span className="text-[var(--success)]">✓</span>
                <span className="font-inter text-sm text-[var(--success)]">We'll let you know!</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-lens-dim)] py-2.5 font-grotesk text-sm font-600 text-[var(--accent-lens)] transition-all hover:bg-[var(--accent-lens)] hover:text-black"
            >
              <Share2 size={14} />
              Share PromptLens
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-[var(--border-subtle)] px-4 py-2.5 font-inter text-sm text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-card)]"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
