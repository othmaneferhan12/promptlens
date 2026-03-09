import { useState, useCallback } from 'react';
import type { AnalysisResult, AIModel, PromptStyle, SupportedLanguage } from '../types';

interface AnalysisOptions {
  base64: string;
  mediaType: string;
  model: AIModel;
  style: PromptStyle;
  language: SupportedLanguage;
}

interface UseImageAnalysisReturn {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  analyze: (opts: AnalysisOptions) => Promise<AnalysisResult | null>;
  reset: () => void;
}

export function useImageAnalysis(): UseImageAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (opts: AnalysisOptions): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': import.meta.env.VITE_APP_SECRET ?? '',
        },
        body: JSON.stringify({
          imageBase64: opts.base64,
          mediaType: opts.mediaType,
          selectedModel: opts.model,
          selectedStyle: opts.style,
          selectedLanguage: opts.language,
        }),
      });

      if (response.status === 429) {
        const data = await response.json() as { message?: string; resetTime?: number };
        const msg = data.message ?? 'Rate limit exceeded. Please try again later.';
        setError(msg);
        setIsLoading(false);
        return null;
      }

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? `Server error: ${response.status}`);
      }

      const data = await response.json() as AnalysisResult;

      if (!data.mainPrompt) {
        throw new Error('Invalid response from server. Please try again.');
      }

      setResult(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(msg);
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

  return { result, isLoading, error, analyze, reset };
}
