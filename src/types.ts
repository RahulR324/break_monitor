export interface BreakEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24-hour)
  endTime: string; // HH:MM (24-hour)
  durationMinutes: number;
  note: string;
  createdAt: number;
}

export const DAILY_LIMIT_MINUTES = 60;
