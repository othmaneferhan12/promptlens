import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Download, RotateCcw, Sparkles } from 'lucide-react';
import type { AnalysisResult as AnalysisResultType, AIModel, PromptStyle } from '../types';
import PromptCard from './PromptCard';
import ColorPalette from './ColorPalette';
import TagCloud from './TagCloud';
import { getModelConfig, getStyleConfig } from '../utils/imageUtils';

interface AnalysisResultProps {
  result: AnalysisResultType;
  model: AIModel;
  style: PromptStyle;
  onReset: () => void;
  onRegenerate: () => void;
}

const MODELSWITHTECHNOLOGY = ['midjourney', 'stable-diffusion', 'flux'];

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="font-grotesk text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </span>
      </div>
      <p className="font-inter text-sm text-[var(--text-primary)] leading-relaxed mt-1">{value}</p>
    </div>
  );
}

export default function AnalysisResult({
  result,
  model,
  style,
  onReset,
  onRegenerate,
}: AnalysisResultProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const modelConfig = getModelConfig(model);
  const styleConfig = getStyleConfig(style);

  const handleExport = () => {
    const content = [
      `=== PromptLens Export ===`,
      `Model: ${modelConfig.name}`,
      `Style: ${styleConfig.label}`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `--- MAIN PROMPT ---`,
      result.mainPrompt,
      ``,
      `--- NEGATIVE PROMPT ---`,
      result.negativePrompt,
      ``,
      `--- REMIX VARIANT ---`,
      result.remixPrompt,
      ``,
      `--- BREAKDOWN ---`,
      `Subject: ${result.subject}`,
      `Composition: ${result.composition}`,
      `Lighting: ${result.lighting}`,
      `Mood: ${result.mood}`,
      `Style: ${result.style}`,
      `Aspect Ratio: ${result.suggestedAspectRatio}`,
      ``,
      `--- TAGS ---`,
      `Quality: ${result.qualityTags.join(', ')}`,
      `Style: ${result.styleTags.join(', ')}`,
      ``,
      `--- COLOR PALETTE ---`,
      result.colorPalette.join(', '),
      result.modelSpecificParams ? `\n--- MODEL PARAMS ---\n${result.modelSpecificParams}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptlens-${model}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="w-full space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header bar */}
      <motion.div
        variants={item}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="font-grotesk text-2xl font-700 text-[var(--text-primary)]">
            Your Prompt is Ready{' '}
            <span style={{ color: 'var(--accent-lens)' }}>✦</span>
          </h2>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[11px] font-600"
              style={{
                backgroundColor: `${modelConfig.color}20`,
                color: modelConfig.color,
                border: `1px solid ${modelConfig.color}40`,
              }}
            >
              {modelConfig.icon} {modelConfig.name}
            </span>
            <span className="rounded-full px-2.5 py-1 font-mono text-[11px] font-600 border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              {styleConfig.emoji} {styleConfig.label}
            </span>
            <span className="rounded-full px-2.5 py-1 font-mono text-[11px] font-600 border border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]">
              {result.confidence}% confidence
            </span>
            <span className="rounded-full px-2.5 py-1 font-mono text-[11px] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              {result.suggestedAspectRatio}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-3 py-2 font-inter text-xs text-[var(--text-secondary)] transition-all hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
          >
            <Download size={13} />
            Export
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-3 py-2 font-inter text-xs text-[var(--text-secondary)] transition-all hover:border-[var(--error)]/50 hover:text-[var(--error)]"
          >
            <RotateCcw size={13} />
            New Image
          </button>
        </div>
      </motion.div>

      {/* Section 1: Main Prompt */}
      <motion.div variants={item}>
        <PromptCard
          label="MAIN PROMPT"
          content={result.mainPrompt}
          accent="var(--accent-lens)"
          showLineNumbers={true}
          onRegenerate={onRegenerate}
          regenerateCooldown={3}
          icon="✦"
        />
      </motion.div>

      {/* Section 2: Breakdown (collapsible) */}
      <motion.div variants={item} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden">
        <button
          onClick={() => setBreakdownOpen((o) => !o)}
          className="flex w-full items-center justify-between px-5 py-4 font-grotesk text-sm font-600 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <span className="flex items-center gap-2">
            <span>🔍</span> Visual Breakdown
          </span>
          {breakdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {breakdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
                <InfoCard icon="🎯" label="Subject" value={result.subject} />
                <InfoCard icon="📐" label="Composition" value={result.composition} />
                <InfoCard icon="💡" label="Lighting" value={result.lighting} />
                <InfoCard icon="🌊" label="Mood" value={result.mood} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Section 3: Negative Prompt */}
      <motion.div variants={item}>
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(255,107,107,0.3)', backgroundColor: 'rgba(255,107,107,0.05)' }}>
          <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'rgba(255,107,107,0.2)' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">🚫</span>
              <span className="font-mono text-xs font-500 text-[var(--error)]">NEGATIVE PROMPT</span>
            </div>
            <div className="group relative">
              <button
                onClick={() => navigator.clipboard.writeText(result.negativePrompt)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs text-[var(--error)]/70 transition-all hover:text-[var(--error)]"
              >
                Copy
              </button>
              <div className="pointer-events-none absolute right-0 top-8 z-10 w-52 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs font-inter text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100 shadow-xl">
                Paste this into the negative prompt field to exclude unwanted elements
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: 'var(--error)', opacity: 0.85 }}>
              {result.negativePrompt}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 4: Color Palette */}
      <motion.div variants={item} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
        <ColorPalette colors={result.colorPalette} />
      </motion.div>

      {/* Section 5: Tags */}
      <motion.div variants={item} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
        <TagCloud qualityTags={result.qualityTags} styleTags={result.styleTags} />
      </motion.div>

      {/* Section 6: Model Params (if applicable) */}
      {result.modelSpecificParams && MODELSWITHTECHNOLOGY.includes(model) && (
        <motion.div variants={item}>
          <PromptCard
            label="MODEL PARAMETERS"
            content={result.modelSpecificParams}
            accent="var(--accent-gold)"
            icon="⚙️"
          />
        </motion.div>
      )}

      {/* Section 7: Remix Variant */}
      <motion.div variants={item}>
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: 'rgba(0,229,255,0.3)', backgroundColor: 'rgba(0,229,255,0.05)' }}
        >
          <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'rgba(0,229,255,0.2)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span className="font-mono text-xs font-500" style={{ color: 'var(--accent-cyan)' }}>
                CREATIVE REMIX
              </span>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[9px] font-600 uppercase"
                style={{
                  backgroundColor: 'rgba(0,229,255,0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0,229,255,0.3)',
                }}
              >
                ✨ Variant
              </span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result.remixPrompt)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs text-[var(--accent-cyan)]/70 transition-all hover:text-[var(--accent-cyan)]"
            >
              Copy
            </button>
          </div>
          <div className="p-4">
            <p className="font-mono text-sm leading-relaxed text-[var(--text-primary)] break-words">
              {result.remixPrompt}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div variants={item} className="flex justify-center pt-2 pb-6">
        <button
          onClick={onReset}
          className="group relative overflow-hidden rounded-2xl px-10 py-4 font-grotesk text-lg font-700 text-black transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
            boxShadow: 'var(--glow)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <RotateCcw size={18} />
            Analyze Another Image
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </motion.div>
    </motion.div>
  );
}
