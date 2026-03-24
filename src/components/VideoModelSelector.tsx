import { useTranslation } from 'react-i18next';
import { VIDEO_MODEL_CONFIGS } from '../utils/videoUtils';
import type { VideoModel } from '../types';
import { MonitorPlay, Clapperboard, Film, Zap, Sun, Eye, Users, Code } from 'lucide-react';

interface VideoModelSelectorProps {
  selected: VideoModel;
  onChange: (model: VideoModel) => void;
}

const ICON_MAP: Record<VideoModel, React.ReactNode> = {
  'veo': <MonitorPlay size={20} strokeWidth={2} />,
  'kling': <Clapperboard size={20} strokeWidth={2} />,
  'runway': <Film size={20} strokeWidth={2} />,
  'pika': <Zap size={20} strokeWidth={2} />,
  'luma': <Sun size={20} strokeWidth={2} />,
  'sora': <Eye size={20} strokeWidth={2} />,
  'minimax': <Users size={20} strokeWidth={2} />,
  'stable-video': <Code size={20} strokeWidth={2} />,
};

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
              <span className="flex items-center justify-center text-current">{ICON_MAP[model.id]}</span>
              <span
                className="font-grotesk text-xs font-700 leading-tight"
                style={{ color: isSelected ? model.color : 'var(--text-primary)' }}
              >
                {model.name}
              </span>
              <span className="font-inter text-[10px] text-[var(--text-secondary)] leading-tight">
                {model.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
