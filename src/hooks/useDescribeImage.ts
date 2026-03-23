import { useState, useCallback } from 'react';
import type { DescribeImageResult } from '../types';

interface DescribeOptions {
  base64: string;
  mediaType: string;
}

interface UseDescribeImageReturn {
  result: DescribeImageResult | null;
  isLoading: boolean;
  error: string | null;
  describe: (opts: DescribeOptions) => Promise<DescribeImageResult | null>;
  reset: () => void;
}

export function useDescribeImage(): UseDescribeImageReturn {
  const [result, setResult] = useState<DescribeImageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const describe = useCallback(async (opts: DescribeOptions): Promise<DescribeImageResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/describe-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': import.meta.env.VITE_APP_SECRET ?? '',
        },
        body: JSON.stringify({
          imageBase64: opts.base64,
          mediaType: opts.mediaType,
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

      const data = await response.json() as DescribeImageResult;

      if (!data.fullDescription) {
        throw new Error('Invalid response from server. Please try again.');
      }

      setResult(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Description failed. Please try again.';
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

  return { result, isLoading, error, describe, reset };
}
