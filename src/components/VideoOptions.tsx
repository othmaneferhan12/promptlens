import { MOTION_STYLE_CONFIGS, DURATION_CONFIGS, CAMERA_MOVEMENT_CONFIGS } from '../utils/videoUtils';
import type { VideoMotionStyle, VideoDuration, VideoCameraMovement } from '../types';

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
}: {
  label: string;
  options: { id: T; label: string; emoji?: string }[];
  selected: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
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
              {opt.emoji && <span>{opt.emoji}</span>}
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
  return (
    <div className="flex flex-col gap-4">
      <PillSelector
        label="Motion Style"
        options={MOTION_STYLE_CONFIGS}
        selected={motionStyle}
        onChange={onMotionStyleChange}
        disabled={disabled}
      />
      <PillSelector
        label="Duration"
        options={DURATION_CONFIGS}
        selected={duration}
        onChange={onDurationChange}
        disabled={disabled}
      />
      <PillSelector
        label="Camera Movement"
        options={CAMERA_MOVEMENT_CONFIGS}
        selected={cameraMovement}
        onChange={onCameraMovementChange}
        disabled={disabled}
      />
    </div>
  );
}
