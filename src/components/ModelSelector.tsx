import { useTranslation } from 'react-i18next';
import { MODEL_CONFIGS } from '../utils/imageUtils';
import type { AIModel } from '../types';
import { Palette, Settings, Zap, Sparkles, Flame, Gamepad2, Type } from 'lucide-react';

interface ModelSelectorProps {
  selected: AIModel;
  onChange: (model: AIModel) => void;
}

const ICON_MAP: Record<AIModel, React.ReactNode> = {
  'midjourney': <Palette size={20} strokeWidth={2} />,
  'stable-diffusion': <Settings size={20} strokeWidth={2} />,
  'flux': <Zap size={20} strokeWidth={2} />,
  'dalle3': <Sparkles size={20} strokeWidth={2} />,
  'firefly': <Flame size={20} strokeWidth={2} />,
  'leonardo': <Gamepad2 size={20} strokeWidth={2} />,
  'ideogram': <Type size={20} strokeWidth={2} />,
};

export default function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="mb-2 font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        {t('controls.targetModel')}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {MODEL_CONFIGS.map((model) => {
          const isSelected = selected === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onChange(model.id)}
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
              style={{
                borderColor: isSelected ? model.color : 'var(--border-subtle)',
                backgroundColor: isSelected ? `${model.color}18` : 'var(--bg-elevated)',
                boxShadow: isSelected ? `0 0 12px ${model.color}28` : 'none',
              }}
            >
              <span className="flex-shrink-0 flex items-center justify-center text-current">{ICON_MAP[model.id]}</span>
              <div className="min-w-0 flex-1">
                <div
                  className="font-grotesk text-xs font-600 leading-tight truncate"
                  style={{ color: isSelected ? model.color : 'var(--text-primary)' }}
                >
                  {model.name}
                </div>
                <div className="font-inter text-[10px] leading-tight text-[var(--text-secondary)] truncate">
                  {model.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
