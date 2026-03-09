import { useRef } from 'react';
import { motion } from 'framer-motion';
import { STYLE_CONFIGS } from '../utils/imageUtils';
import type { PromptStyle } from '../types';

interface StyleSelectorProps {
  selected: PromptStyle;
  onChange: (style: PromptStyle) => void;
}

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <h2 className="mb-4 font-grotesk text-sm font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        Prompt Style
      </h2>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin style-scroll-touch"
        style={{ scrollbarWidth: 'thin' }}
      >
        {STYLE_CONFIGS.map((s, index) => {
          const isSelected = selected === s.id;
          return (
            <motion.button
              key={s.id}
              onClick={() => onChange(s.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 transition-all duration-200"
              style={{
                borderColor: isSelected ? 'var(--accent-lens)' : 'var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--accent-lens-dim)' : 'var(--bg-card)',
                boxShadow: isSelected ? 'var(--glow-sm)' : 'none',
              }}
            >
              <span className="text-base leading-none">{s.emoji}</span>
              <div className="flex flex-col items-start">
                <span
                  className="font-grotesk text-sm font-600 leading-none"
                  style={{
                    color: isSelected ? 'var(--accent-lens)' : 'var(--text-primary)',
                  }}
                >
                  {s.label}
                </span>
                <span className="mt-0.5 font-inter text-[10px] text-[var(--text-secondary)] leading-none">
                  {s.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
