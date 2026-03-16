import type { VideoModelConfig } from '../types';

export const VIDEO_MODEL_CONFIGS: VideoModelConfig[] = [
  {
    id: 'veo',
    name: 'Veo / Flow Studio',
    color: '#4285F4',
    badge: 'Best for Realism',
    company: 'Google DeepMind',
    icon: '🎥',
  },
  {
    id: 'kling',
    name: 'Kling',
    color: '#FF6B35',
    badge: 'Best for Motion',
    company: 'Kuaishou',
    icon: '🎬',
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    color: '#00D4AA',
    badge: 'Best for Cinematic',
    company: 'Runway AI',
    icon: '🎞️',
  },
  {
    id: 'pika',
    name: 'Pika',
    color: '#FF4081',
    badge: 'Best for Quick Edits',
    company: 'Pika Labs',
    icon: '⚡',
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    color: '#FFD700',
    badge: 'Best for Depth',
    company: 'Luma AI',
    icon: '✨',
  },
  {
    id: 'sora',
    name: 'Sora',
    color: '#10A37F',
    badge: 'Best for Narrative',
    company: 'OpenAI',
    icon: '🌐',
  },
  {
    id: 'minimax',
    name: 'Minimax / Hailuo',
    color: '#845EF7',
    badge: 'Best for Characters',
    company: 'Minimax',
    icon: '🎭',
  },
  {
    id: 'stable-video',
    name: 'Stable Video',
    color: '#8B5CF6',
    badge: 'Best Open Source',
    company: 'Stability AI',
    icon: '🔓',
  },
];

export const MOTION_STYLE_CONFIGS = [
  { id: 'cinematic' as const, label: 'Cinematic', emoji: '🎬' },
  { id: 'dynamic' as const, label: 'Dynamic', emoji: '⚡' },
  { id: 'slow-motion' as const, label: 'Slow Motion', emoji: '🐢' },
  { id: 'timelapse' as const, label: 'Timelapse', emoji: '⏩' },
  { id: 'smooth' as const, label: 'Smooth', emoji: '🌊' },
  { id: 'dramatic' as const, label: 'Dramatic', emoji: '🎭' },
];

export const DURATION_CONFIGS = [
  { id: '2s' as const, label: '2s' },
  { id: '4s' as const, label: '4s' },
  { id: '6s' as const, label: '6s' },
  { id: '8s' as const, label: '8s' },
  { id: '10s' as const, label: '10s' },
];

export const CAMERA_MOVEMENT_CONFIGS = [
  { id: 'static' as const, label: 'Static' },
  { id: 'pan-left' as const, label: 'Pan Left' },
  { id: 'pan-right' as const, label: 'Pan Right' },
  { id: 'zoom-in' as const, label: 'Zoom In' },
  { id: 'zoom-out' as const, label: 'Zoom Out' },
  { id: 'orbit' as const, label: 'Orbit' },
  { id: 'dolly' as const, label: 'Dolly' },
  { id: 'tilt-up' as const, label: 'Tilt Up' },
  { id: 'tilt-down' as const, label: 'Tilt Down' },
];

export function getVideoModelConfig(id: string): VideoModelConfig {
  return VIDEO_MODEL_CONFIGS.find((m) => m.id === id) ?? VIDEO_MODEL_CONFIGS[0];
}
