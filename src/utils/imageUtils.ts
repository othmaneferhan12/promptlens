import type { ModelConfig, StyleConfig } from '../types';

export const MODEL_CONFIGS: ModelConfig[] = [
  {
    id: 'midjourney',
    name: 'Midjourney',
    color: '#00b4d8',
    badge: 'Best for Art',
    description: 'Artistic, dreamy, stylized outputs',
    icon: '🎨',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    color: '#ff6b35',
    badge: 'Best for Control',
    description: 'Precise, customizable generation',
    icon: '⚙️',
  },
  {
    id: 'flux',
    name: 'Flux',
    color: '#7c3aed',
    badge: 'Best Quality',
    description: 'Photorealistic output at highest fidelity',
    icon: '⚡',
  },
  {
    id: 'dalle3',
    name: 'DALL·E 3',
    color: '#10a37f',
    badge: 'Best for Concepts',
    description: 'Creative & literal interpretation',
    icon: '🧠',
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    color: '#ff0000',
    badge: 'Commercial Safe',
    description: 'Cleared for commercial use',
    icon: '🦋',
  },
  {
    id: 'leonardo',
    name: 'Leonardo AI',
    color: '#f59e0b',
    badge: 'Best for Gaming',
    description: 'Fantasy & game art specialist',
    icon: '🎮',
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    color: '#06b6d4',
    badge: 'Best for Text',
    description: 'Renders text in images accurately',
    icon: '✍️',
  },
];

export const STYLE_CONFIGS: StyleConfig[] = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    emoji: '🎬',
    description: 'Film-grade, dramatic lighting',
  },
  {
    id: 'technical',
    label: 'Technical',
    emoji: '🔬',
    description: 'Precise, hyper-realistic',
  },
  {
    id: 'artistic',
    label: 'Artistic',
    emoji: '🎨',
    description: 'Painterly, stylized, creative',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    emoji: '✨',
    description: 'Clean, essence-focused',
  },
  {
    id: 'epic',
    label: 'Epic',
    emoji: '🌌',
    description: 'Grand scale, atmospheric',
  },
  {
    id: 'photographic',
    label: 'Photographic',
    emoji: '📸',
    description: 'Camera specs, lens, aperture',
  },
];

export function getModelConfig(id: string): ModelConfig {
  return MODEL_CONFIGS.find((m) => m.id === id) ?? MODEL_CONFIGS[0];
}

export function getStyleConfig(id: string): StyleConfig {
  return STYLE_CONFIGS.find((s) => s.id === id) ?? STYLE_CONFIGS[0];
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
    reader.readAsDataURL(blob);
  });
}

export function generateThumbnail(dataUrl: string, maxSize = 80): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No canvas context'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
    img.src = dataUrl;
  });
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
