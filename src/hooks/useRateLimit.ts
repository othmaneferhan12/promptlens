import { useState, useEffect, useCallback } from 'react';
import type { RateLimitState } from '../types';

const MAX_USAGE = 10;

function getTodayKey(): string {
  const d = new Date();
  return `promptlens_usage_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMidnightMs(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return midnight.getTime();
}

function formatTimeUntilReset(msUntilReset: number): string {
  if (msUntilReset <= 0) return '0m';
  const totalMinutes = Math.ceil(msUntilReset / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function useRateLimit(): RateLimitState {
  const [usageCount, setUsageCount] = useState<number>(() => {
    try {
      const key = getTodayKey();
      const stored = localStorage.getItem(key);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [timeUntilReset, setTimeUntilReset] = useState<string>(() => {
    return formatTimeUntilReset(getMidnightMs() - Date.now());
  });

  // Update countdown every minute
  useEffect(() => {
    const tick = () => {
      setTimeUntilReset(formatTimeUntilReset(getMidnightMs() - Date.now()));

      // Also refresh count from localStorage (handles midnight rollover)
      try {
        const key = getTodayKey();
        const stored = localStorage.getItem(key);
        const count = stored ? parseInt(stored, 10) : 0;
        setUsageCount(count);
      } catch {
        // ignore
      }
    };

    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const incrementUsage = useCallback(() => {
    const key = getTodayKey();
    const newCount = usageCount + 1;
    try {
      localStorage.setItem(key, String(newCount));
    } catch {
      // ignore storage errors
    }
    setUsageCount(newCount);
  }, [usageCount]);

  return {
    canAnalyze: usageCount < MAX_USAGE,
    usageCount,
    maxUsage: MAX_USAGE,
    timeUntilReset,
    incrementUsage,
  };
}
