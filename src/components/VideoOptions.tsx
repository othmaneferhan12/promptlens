import { useTranslation } from 'react-i18next';
import { MOTION_STYLE_CONFIGS, DURATION_CONFIGS, CAMERA_MOVEMENT_CONFIGS } from '../utils/videoUtils';
import type { VideoMotionStyle, VideoDuration, VideoCameraMovement } from '../types';
import { Clapperboard, Zap, Clock, Timer, Waves, Drama, Square, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, MoveHorizontal, ArrowUp, ArrowDown } from 'lucide-react';

const MOTION_ICON_MAP: Record<string, React.ReactNode> = {
  'cinematic': <Clapperboard size={14} strokeWidth={2} />,
  'dynamic': <Zap size={14} strokeWidth={2} />,
  'slow-motion': <Clock size={14} strokeWidth={2} />,
  'timelapse': <Timer size={14} strokeWidth={2} />,
  'smooth': <Waves size={14} strokeWidth={2} />,
  'dramatic': <Drama size={14} strokeWidth={2} />,
};

const CAMERA_ICON_MAP: Record<string, React.ReactNode> = {
  'static': <Square size={14} strokeWidth={2} />,
  'pan-left': <ArrowLeft size={14} strokeWidth={2} />,
  'pan-right': <ArrowRight size={14} strokeWidth={2} />,
  'zoom-in': <ZoomIn size={14} strokeWidth={2} />,
  'zoom-out': <ZoomOut size={14} strokeWidth={2} />,
  'orbit': <RotateCcw size={14} strokeWidth={2} />,
  'dolly': <MoveHorizontal size={14} strokeWidth={2} />,
  'tilt-up': <ArrowUp size={14} strokeWidth={2} />,
  'tilt-down': <ArrowDown size={14} strokeWidth={2} />,
};

interface VideoOptionsProps {
  motionStyle: VideoMotionStyle;
  duration: VideoDuration;
  cameraMovement: VideoCameraMovement;
  onMotionStyleChange: (v: VideoMotionStyle) => void;
  onDurationChange: (v: VideoDuration) => void;
  onCameraMovementChange: (v: VideoCameraMovement) => void;
  disabled?: boolean;
}

function PillSelector<T extends string>({
  label,
  options,
  selected,
  onChange,
  disabled,
  iconMap,
}: {
  label: string;
  options: { id: T; label: string; emoji?: string }[];
  selected: T;
  onChange: (v: T) => void;
  disabled?: boolean;
  iconMap?: Record<string, React.ReactNode>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const icon = iconMap?.[opt.id];
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              disabled={disabled}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 font-inter text-xs font-500 transition-all duration-200 disabled:opacity-40"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? 'var(--accent-lens)' : 'var(--border-subtle)',
                backgroundColor: isSelected ? 'rgba(224,64,251,0.12)' : 'var(--bg-elevated)',
                color: isSelected ? 'var(--accent-lens)' : 'var(--text-secondary)',
              }}
            >
              {icon ? <span className="flex items-center justify-center text-current">{icon}</span> : (opt.emoji && <span>{opt.emoji}</span>)}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function VideoOptions({
  motionStyle,
  duration,
  cameraMovement,
  onMotionStyleChange,
  onDurationChange,
  onCameraMovementChange,
  disabled,
}: VideoOptionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <PillSelector
        label={t('controls.motionStyle')}
        options={MOTION_STYLE_CONFIGS}
        selected={motionStyle}
        onChange={onMotionStyleChange}
        disabled={disabled}
        iconMap={MOTION_ICON_MAP}
      />
      <PillSelector
        label={t('controls.duration')}
        options={DURATION_CONFIGS}
        selected={duration}
        onChange={onDurationChange}
        disabled={disabled}
      />
      <PillSelector
        label={t('controls.cameraMovement')}
        options={CAMERA_MOVEMENT_CONFIGS}
        selected={cameraMovement}
        onChange={onCameraMovementChange}
        disabled={disabled}
        iconMap={CAMERA_ICON_MAP}
      />
    </div>
  );
}
