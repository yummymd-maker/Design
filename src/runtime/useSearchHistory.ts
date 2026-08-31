import { useState, useCallback, useEffect } from 'react';

const HISTORY_KEY = 'agent_search_history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const addHistory = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setHistory(prev => {
      const filtered = prev.filter(k => k !== trimmed);
      const next = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const removeHistory = useCallback((keyword: string) => {
    setHistory(prev => {
      const next = prev.filter(k => k !== keyword);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { history, addHistory, clearHistory, removeHistory };
}
