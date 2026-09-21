export interface BreakEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24-hour)
  endTime: string | null; // HH:MM (24-hour), null while break is active
  durationMinutes: number | null; // null while break is active
  note: string;
  createdAt: number;
}

export const DAILY_LIMIT_MINUTES = 60;

export function isActiveBreak(entry: BreakEntry): boolean {
  return entry.endTime === null || entry.durationMinutes === null;
}
