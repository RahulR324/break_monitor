import type { BreakEntry } from '@/types';
import { DAILY_LIMIT_MINUTES } from '@/types';

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h} hr ${m} min`;
  if (h > 0) return `${h} hr`;
  return `${m} min`;
}

export function formatTimeDisplay(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function calculateDuration(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin < startMin) {
    endMin += 24 * 60;
  }

  return endMin - startMin;
}

export function getDailyTotal(entries: BreakEntry[], date: string): number {
  return entries
    .filter((e) => e.date === date && e.durationMinutes !== null)
    .reduce((sum, e) => sum + (e.durationMinutes as number), 0);
}

export function getActiveBreak(entries: BreakEntry[]): BreakEntry | null {
  return entries.find((e) => e.endTime === null) ?? null;
}

export function getCurrentTimeString(): string {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function getRemainingMinutes(entries: BreakEntry[], date: string): number {
  return Math.max(0, DAILY_LIMIT_MINUTES - getDailyTotal(entries, date));
}

export function getUsagePercent(entries: BreakEntry[], date: string): number {
  return Math.min(100, (getDailyTotal(entries, date) / DAILY_LIMIT_MINUTES) * 100);
}
export function getUsageColor(percent: number): string {
  if (percent >= 100) return 'text-red-600';
  if (percent >= 80) return 'text-amber-600';
  return 'text-emerald-600';
}

export function getBarColor(percent: number): string {
  if (percent >= 100) return 'bg-red-500';
  if (percent >= 80) return 'bg-amber-500';
  return 'bg-emerald-500';
}
