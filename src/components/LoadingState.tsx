import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingStateProps {
  previewUrl: string;
}

const STEPS = [
  'Validating image...',
  'Optimizing for processing...',
  'Analyzing composition...',
  'Detecting style & mood...',
  'Crafting your prompt...',
];

export default function LoadingState({ previewUrl }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = 600;
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, stepInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 92));
    }, 100);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Blurred background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${previewUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.2) saturate(1.5)',
          transform: 'scale(1.05)',
        }}
      />
      <div className="absolute inset-0 bg-[var(--bg-void)]/70" />

      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--bg-elevated)]">
        <motion.div
          className="h-full bg-[var(--accent-lens)]"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
          style={{ boxShadow: '0 0 8px var(--accent-lens)' }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 text-center px-4">
        {/* Animated lens icon */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--accent-lens)]/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-[var(--accent-lens)]/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
              <circle cx="20" cy="20" r="12" stroke="#e040fb" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="20" cy="20" r="6" stroke="#e040fb" strokeWidth="1" opacity="0.7" />
              <circle cx="20" cy="20" r="2" fill="#e040fb" />
            </svg>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              className="font-grotesk text-xl font-600 text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              ✦ {STEPS[currentStep]}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col gap-2 w-64">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: i <= currentStep ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      i < currentStep
                        ? 'var(--success)'
                        : i === currentStep
                        ? 'var(--accent-lens)'
                        : 'var(--text-secondary)',
                  }}
                />
                <span
                  className="font-mono text-xs"
                  style={{
                    color:
                      i < currentStep
                        ? 'var(--success)'
                        : i === currentStep
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {step}
                </span>
                {i < currentStep && (
                  <span className="ml-auto font-mono text-xs text-[var(--success)]">✓</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <p className="font-inter text-xs text-[var(--text-secondary)]">
          ~2 seconds · Powered by Claude Vision
        </p>
      </div>
    </motion.div>
  );
}
