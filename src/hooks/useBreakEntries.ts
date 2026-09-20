import { useState, useEffect, useCallback } from 'react';
import type { BreakEntry } from '@/types';

const STORAGE_KEY = 'break-time-monitor-entries';

function loadEntries(): BreakEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function useBreakEntries() {
  const [entries, setEntries] = useState<BreakEntry[]>(loadEntries);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage full or unavailable; silently ignore
    }
  }, [entries]);

  const addEntry = useCallback((entry: Omit<BreakEntry, 'id' | 'createdAt'>) => {
    const newEntry: BreakEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setEntries((prev) => [...prev, newEntry]);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addEntry, deleteEntry, clearAll };
}
