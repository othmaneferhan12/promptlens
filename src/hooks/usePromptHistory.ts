import { useState, useCallback } from 'react';
import type { HistoryItem, AnalysisResult, AIModel, PromptStyle } from '../types';
import { generateThumbnail } from '../utils/imageUtils';

const STORAGE_KEY = 'promptlens_history';
const MAX_ITEMS = 20;

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // Quota exceeded — trim older entries and retry
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 5)));
    } catch {
      // ignore
    }
  }
}

export function usePromptHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);

  const addToHistory = useCallback(
    async (
      previewUrl: string,
      model: AIModel,
      style: PromptStyle,
      result: AnalysisResult,
      imageName: string
    ) => {
      let thumbnail = previewUrl;
      try {
        thumbnail = await generateThumbnail(previewUrl, 80);
      } catch {
        // fallback to original previewUrl
      }

      const item: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        thumbnail,
        model,
        style,
        result,
        imageName,
      };

      setHistory((prev) => {
        const updated = [item, ...prev].slice(0, MAX_ITEMS);
        saveHistory(updated);
        return updated;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setHistory([]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  return { history, addToHistory, clearHistory, removeItem };
}
