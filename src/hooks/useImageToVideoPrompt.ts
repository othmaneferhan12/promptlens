import { useState, useCallback } from 'react';
import type { VideoResult, VideoModel, VideoMotionStyle, VideoDuration, VideoCameraMovement, SupportedLanguage } from '../types';

interface ImageToVideoOptions {
  base64: string;
  mediaType: string;
  model: VideoModel;
  motionStyle: VideoMotionStyle;
  duration: VideoDuration;
  cameraMovement: VideoCameraMovement;
  language: SupportedLanguage;
}

interface UseImageToVideoReturn {
  result: VideoResult | null;
  isLoading: boolean;
  error: string | null;
  generate: (opts: ImageToVideoOptions) => Promise<VideoResult | null>;
  reset: () => void;
}

export function useImageToVideoPrompt(): UseImageToVideoReturn {
  const [result, setResult] = useState<VideoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (opts: ImageToVideoOptions): Promise<VideoResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/image-to-video-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': import.meta.env.VITE_APP_SECRET ?? '',
        },
        body: JSON.stringify({
          imageBase64: opts.base64,
          mediaType: opts.mediaType,
          selectedModel: opts.model,
          motionStyle: opts.motionStyle,
          duration: opts.duration,
          cameraMovement: opts.cameraMovement,
          selectedLanguage: opts.language,
        }),
      });

      if (response.status === 429) {
        const data = await response.json() as { message?: string };
        setError(data.message ?? 'Rate limit exceeded. Please try again later.');
        return null;
      }

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? `Server error: ${response.status}`);
      }

      const data = await response.json() as VideoResult;
      if (!data.mainPrompt) throw new Error('Invalid response from server.');

      setResult(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, generate, reset };
}
