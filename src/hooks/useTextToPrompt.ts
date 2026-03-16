import { useState, useCallback } from 'react';
import type { AnalysisResult, AIModel, PromptStyle, SupportedLanguage } from '../types';

interface TextToPromptOptions {
  text: string;
  model: AIModel;
  style: PromptStyle;
  language: SupportedLanguage;
}

interface UseTextToPromptReturn {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  enhance: (opts: TextToPromptOptions) => Promise<AnalysisResult | null>;
  reset: () => void;
}

export function useTextToPrompt(): UseTextToPromptReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = useCallback(async (opts: TextToPromptOptions): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/text-to-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': import.meta.env.VITE_APP_SECRET ?? '',
        },
        body: JSON.stringify({
          textDescription: opts.text,
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
      const msg = err instanceof Error ? err.message : 'Enhancement failed. Please try again.';
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

  return { result, isLoading, error, enhance, reset };
}
