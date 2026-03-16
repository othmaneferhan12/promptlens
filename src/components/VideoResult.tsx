import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Download, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { VideoResult as VideoResultType, VideoModel, VideoMotionStyle } from '../types';
import { getVideoModelConfig, MOTION_STYLE_CONFIGS, DURATION_CONFIGS, CAMERA_MOVEMENT_CONFIGS } from '../utils/videoUtils';

interface VideoResultProps {
  result: VideoResultType;
  model: VideoModel;
  motionStyle: VideoMotionStyle;
  duration: string;
  cameraMovement: string;
  onReset: () => void;
  onRegenerate: () => void;
  resetLabel?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)]"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

export default function VideoResult({
  result,
  model,
  motionStyle,
  duration,
  cameraMovement,
  onReset,
  onRegenerate,
  resetLabel = 'Generate Another',
}: VideoResultProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const modelConfig = getVideoModelConfig(model);
  const motionLabel = MOTION_STYLE_CONFIGS.find((m) => m.id === motionStyle)?.label ?? motionStyle;
  const durationLabel = DURATION_CONFIGS.find((d) => d.id === duration)?.label ?? duration;
  const cameraLabel = CAMERA_MOVEMENT_CONFIGS.find((c) => c.id === cameraMovement)?.label ?? cameraMovement;

  const handleExport = () => {
    const content = [
      `=== PromptLens Video Prompt Export ===`,
      `Model: ${modelConfig.name}`,
      `Motion Style: ${motionLabel}`,
      `Duration: ${durationLabel}`,
      `Camera: ${cameraLabel}`,
      ``,
      `--- MAIN VIDEO PROMPT ---`,
      result.mainPrompt,
      ``,
      `--- MOTION DESCRIPTION ---`,
      result.motionDescription,
      ``,
      `--- CAMERA DIRECTION ---`,
      result.cameraDirection,
      ``,
      `--- CREATIVE VARIANT ---`,
      result.creativeVariant,
      ``,
      `--- MOTION TAGS ---`,
      result.motionTags.join(', '),
      ``,
      `--- SUGGESTED ASPECT RATIO ---`,
      result.suggestedAspectRatio,
      result.modelTips ? `\n--- MODEL TIPS ---\n${result.modelTips}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-prompt-${model}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div className="w-full space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-grotesk text-2xl font-700 text-[var(--text-primary)]">
            Your Video Prompt is Ready{' '}
            <span style={{ color: 'var(--accent-lens)' }}>✨</span>
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
              🎬 {motionLabel}
            </span>
            <span className="rounded-full px-2.5 py-1 font-mono text-[11px] font-600 border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              ⏱ {durationLabel}
            </span>
            <span className="rounded-full px-2.5 py-1 font-mono text-[11px] font-600 border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              📐 {result.suggestedAspectRatio}
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
            New
          </button>
        </div>
      </motion.div>

      {/* Main Video Prompt */}
      <motion.div variants={item}>
        <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span>🎬</span>
              <span className="font-mono text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)]">
                Main Video Prompt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs text-[var(--accent-lens)]/70 transition-all hover:text-[var(--accent-lens)]"
              >
                <Sparkles size={11} />
                Regenerate
              </button>
              <CopyButton text={result.mainPrompt} />
            </div>
          </div>
          <div className="p-4">
            <p className="font-mono text-sm leading-relaxed text-[var(--text-primary)] break-words">
              {result.mainPrompt}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Motion & Camera Details (collapsible) */}
      <motion.div variants={item} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden">
        <button
          onClick={() => setDetailsOpen((o) => !o)}
          className="flex w-full items-center justify-between px-5 py-4 font-grotesk text-sm font-600 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <span className="flex items-center gap-2">
            <span>🎥</span> Motion & Camera Details
          </span>
          {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {detailsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                  <span className="font-grotesk text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)]">
                    🏃 Motion Description
                  </span>
                  <p className="font-inter text-sm text-[var(--text-primary)] leading-relaxed mt-1">
                    {result.motionDescription}
                  </p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                  <span className="font-grotesk text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)]">
                    📷 Camera Direction
                  </span>
                  <p className="font-inter text-sm text-[var(--text-primary)] leading-relaxed mt-1">
                    {result.cameraDirection}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Motion Tags */}
      {result.motionTags.length > 0 && (
        <motion.div variants={item} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
          <span className="font-grotesk text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)]">
            🏷 Motion Tags
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.motionTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 font-mono text-xs"
                style={{
                  backgroundColor: 'rgba(224,64,251,0.1)',
                  color: 'var(--accent-lens)',
                  border: '1px solid rgba(224,64,251,0.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Creative Variant */}
      <motion.div variants={item}>
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: 'rgba(0,229,255,0.3)', backgroundColor: 'rgba(0,229,255,0.05)' }}
        >
          <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'rgba(0,229,255,0.2)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span className="font-mono text-xs font-500" style={{ color: 'var(--accent-cyan)' }}>
                CREATIVE VARIANT
              </span>
            </div>
            <CopyButton text={result.creativeVariant} />
          </div>
          <div className="p-4">
            <p className="font-mono text-sm leading-relaxed text-[var(--text-primary)] break-words">
              {result.creativeVariant}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Model Tips */}
      {result.modelTips && (
        <motion.div variants={item}>
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: 'rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.05)' }}
          >
            <div className="px-4 py-2.5 border-b" style={{ borderColor: 'rgba(251,191,36,0.2)' }}>
              <span className="font-mono text-xs font-500" style={{ color: '#FBBF24' }}>
                💡 MODEL TIPS
              </span>
            </div>
            <div className="p-4">
              <p className="font-inter text-sm leading-relaxed text-[var(--text-primary)]">
                {result.modelTips}
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
            {resetLabel}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </motion.div>
    </motion.div>
  );
}
