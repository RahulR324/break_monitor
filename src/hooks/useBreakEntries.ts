import { useState, useEffect, useCallback } from 'react';
import type { BreakEntry } from '@/types';
import { calculateDuration } from '@/utils/time';

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

  const startBreak = useCallback(
    (startTime: string, note: string, date: string) => {
      const newEntry: BreakEntry = {
        id: crypto.randomUUID(),
        date,
        startTime,
        endTime: null,
        durationMinutes: null,
        note,
        createdAt: Date.now(),
      };
      setEntries((prev) => [...prev, newEntry]);
    },
    []
  );

  const endBreak = useCallback((id: string, endTime: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;
        const dur = calculateDuration(entry.startTime, endTime);
        return { ...entry, endTime, durationMinutes: dur };
      })
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, startBreak, endBreak, deleteEntry, clearAll };
}
