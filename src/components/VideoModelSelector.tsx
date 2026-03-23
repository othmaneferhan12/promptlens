import { useTranslation } from 'react-i18next';
import { VIDEO_MODEL_CONFIGS } from '../utils/videoUtils';
import type { VideoModel } from '../types';

interface VideoModelSelectorProps {
  selected: VideoModel;
  onChange: (model: VideoModel) => void;
}

export default function VideoModelSelector({ selected, onChange }: VideoModelSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span className="font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        {t('controls.targetVideoModel')}
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {VIDEO_MODEL_CONFIGS.map((model) => {
          const isSelected = selected === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onChange(model.id)}
              className="flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all duration-200"
              style={{
                borderColor: isSelected ? model.color : 'var(--border-subtle)',
                backgroundColor: isSelected ? `${model.color}15` : 'var(--bg-elevated)',
                boxShadow: isSelected ? `0 0 0 1px ${model.color}40` : 'none',
              }}
            >
              <span className="text-lg leading-none">{model.icon}</span>
              <span
                className="font-grotesk text-xs font-700 leading-tight"
                style={{ color: isSelected ? model.color : 'var(--text-primary)' }}
              >
                {model.name}
              </span>
              <span className="font-inter text-[10px] text-[var(--text-secondary)] leading-tight">
                {model.badge}
              </span>
              <span className="font-inter text-[9px] text-[var(--text-secondary)]/50 leading-tight">
                {model.company}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
