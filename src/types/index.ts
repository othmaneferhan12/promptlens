export type AIModel =
  | 'midjourney'
  | 'stable-diffusion'
  | 'flux'
  | 'dalle3'
  | 'firefly'
  | 'leonardo'
  | 'ideogram';

export type PromptStyle =
  | 'cinematic'
  | 'technical'
  | 'artistic'
  | 'minimal'
  | 'epic'
  | 'photographic';

export interface ModelConfig {
  id: AIModel;
  name: string;
  color: string;
  badge: string;
  description: string;
  icon: string;
}

export interface StyleConfig {
  id: PromptStyle;
  label: string;
  emoji: string;
  description: string;
}

export interface AnalysisResult {
  mainPrompt: string;
  negativePrompt: string;
  remixPrompt: string;
  subject: string;
  composition: string;
  lighting: string;
  colorPalette: string[];
  mood: string;
  style: string;
  suggestedAspectRatio: string;
  qualityTags: string[];
  styleTags: string[];
  modelSpecificParams: string;
  confidence: number;
}

export interface UploadedImage {
  file: File | null;
  previewUrl: string;
  base64: string;
  mediaType: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  name: string;
  source: 'file' | 'url' | 'clipboard';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string;
  model: AIModel;
  style: PromptStyle;
  result: AnalysisResult;
  imageName: string;
}

export interface RateLimitState {
  canAnalyze: boolean;
  usageCount: number;
  maxUsage: number;
  timeUntilReset: string;
  incrementUsage: () => void;
}

export interface CompressedImage {
  base64: string;
  mediaType: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type AppPhase = 'upload' | 'loading' | 'result';

export type SupportedLanguage =
  | 'en'
  | 'fr'
  | 'es'
  | 'de'
  | 'pt'
  | 'ar'
  | 'ja'
  | 'zh'
  | 'it'
  | 'nl';

export type VideoModel =
  | 'veo'
  | 'kling'
  | 'runway'
  | 'pika'
  | 'luma'
  | 'sora'
  | 'minimax'
  | 'stable-video';

export type VideoMotionStyle =
  | 'cinematic'
  | 'dynamic'
  | 'slow-motion'
  | 'timelapse'
  | 'smooth'
  | 'dramatic';

export type VideoDuration = '2s' | '4s' | '6s' | '8s' | '10s';

export type VideoCameraMovement =
  | 'static'
  | 'pan-left'
  | 'pan-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'orbit'
  | 'dolly'
  | 'tilt-up'
  | 'tilt-down';

export interface VideoModelConfig {
  id: VideoModel;
  name: string;
  color: string;
  badge: string;
  company: string;
  icon: string;
}

export interface VideoResult {
  mainPrompt: string;
  motionDescription: string;
  cameraDirection: string;
  creativeVariant: string;
  motionTags: string[];
  suggestedAspectRatio: string;
  modelTips: string;
  confidence: number;
}

export interface DescribeImageResult {
  fullDescription: string;
  keyElements: {
    subjects: string[];
    objects: string[];
    setting: string;
    people: string;
  };
  visualAnalysis: {
    dominantColors: string[];
    lighting: string;
    composition: string;
    mood: string;
  };
  altText: string;
}

export interface LanguageConfig {
  code: SupportedLanguage;
  label: string;
  flag: string;
  nativeName: string;
}
