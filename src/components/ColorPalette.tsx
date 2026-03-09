import { useState } from 'react';
import { motion } from 'framer-motion';

interface ColorPaletteProps {
  colors: string[];
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(hex);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const validColors = colors.filter((c) => /^#[0-9A-Fa-f]{6}$/.test(c));

  return (
    <div>
      <h3 className="mb-3 font-grotesk text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        Color Palette
      </h3>
      <div className="flex gap-3 flex-wrap">
        {validColors.map((color, i) => (
          <motion.button
            key={i}
            onClick={() => handleCopy(color)}
            className="group relative flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
            title={`Copy ${color}`}
          >
            {/* Swatch */}
            <div
              className="h-14 w-14 rounded-xl border-2 border-transparent shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:border-white/30"
              style={{ backgroundColor: color }}
            />
            {/* Hex label */}
            <span
              className="font-mono text-[10px] transition-colors duration-200"
              style={{ color: copied === color ? 'var(--success)' : 'var(--text-secondary)' }}
            >
              {copied === color ? '✓ Copied' : color}
            </span>
          </motion.button>
        ))}
        {validColors.length === 0 && (
          <p className="font-inter text-xs text-[var(--text-secondary)]">No colors detected.</p>
        )}
      </div>
    </div>
  );
}
