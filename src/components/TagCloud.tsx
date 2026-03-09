import { useState } from 'react';
import { motion } from 'framer-motion';

interface TagCloudProps {
  qualityTags: string[];
  styleTags: string[];
}

function Tag({ tag, color, delay }: { tag: string; color: string; delay: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tag).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <motion.button
      onClick={handleCopy}
      className="rounded-full border px-3 py-1 font-mono text-xs transition-all duration-200"
      style={{
        borderColor: copied ? color : 'var(--border-subtle)',
        color: copied ? color : 'var(--text-secondary)',
        backgroundColor: copied ? `${color}15` : 'transparent',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300 }}
      whileHover={{
        borderColor: color,
        color,
        backgroundColor: `${color}15`,
        boxShadow: `0 0 10px ${color}30`,
      }}
      title="Click to copy"
    >
      {copied ? '✓ ' : ''}{tag}
    </motion.button>
  );
}

export default function TagCloud({ qualityTags, styleTags }: TagCloudProps) {
  return (
    <div className="space-y-4">
      {qualityTags.length > 0 && (
        <div>
          <p className="mb-2 font-inter text-xs font-600 text-[var(--text-secondary)] uppercase tracking-wider">
            Quality Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {qualityTags.map((tag, i) => (
              <Tag key={tag} tag={tag} color="var(--accent-lens)" delay={i * 0.05} />
            ))}
          </div>
        </div>
      )}
      {styleTags.length > 0 && (
        <div>
          <p className="mb-2 font-inter text-xs font-600 text-[var(--text-secondary)] uppercase tracking-wider">
            Style Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {styleTags.map((tag, i) => (
              <Tag key={tag} tag={tag} color="var(--accent-cyan)" delay={i * 0.05} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
