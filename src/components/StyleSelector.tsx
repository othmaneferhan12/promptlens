import { useTranslation } from 'react-i18next';
import { STYLE_CONFIGS } from '../utils/imageUtils';
import type { PromptStyle } from '../types';
import { Clapperboard, Ruler, Brush, Minus, Mountain, Camera } from 'lucide-react';

interface StyleSelectorProps {
  selected: PromptStyle;
  onChange: (style: PromptStyle) => void;
}

const ICON_MAP: Record<PromptStyle, React.ReactNode> = {
  'cinematic': <Clapperboard size={14} strokeWidth={2} />,
  'technical': <Ruler size={14} strokeWidth={2} />,
  'artistic': <Brush size={14} strokeWidth={2} />,
  'minimal': <Minus size={14} strokeWidth={2} />,
  'epic': <Mountain size={14} strokeWidth={2} />,
  'photographic': <Camera size={14} strokeWidth={2} />,
};

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="mb-2 font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        {t('controls.promptStyle')}
      </p>
      <div className="flex flex-wrap gap-2">
        {STYLE_CONFIGS.map((s) => {
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                borderColor: isSelected ? 'var(--accent-lens)' : 'var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--accent-lens-dim)' : 'var(--bg-elevated)',
                boxShadow: isSelected ? 'var(--glow-sm)' : 'none',
              }}
            >
              <span className="flex items-center justify-center text-current">{ICON_MAP[s.id]}</span>
              <span
                className="font-grotesk text-xs font-600"
                style={{ color: isSelected ? 'var(--accent-lens)' : 'var(--text-primary)' }}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
