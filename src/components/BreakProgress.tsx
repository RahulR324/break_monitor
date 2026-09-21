import { formatDuration, getBarColor, getUsageColor } from '@/utils/time';
import type { BreakEntry } from '@/types';
import { DAILY_LIMIT_MINUTES } from '@/types';

interface BreakProgressProps {
  entries: BreakEntry[];
  today: string;
}

export function BreakProgress({ entries, today }: BreakProgressProps) {
  const dailyTotal = entries
    .filter((e) => e.date === today && e.durationMinutes !== null)
    .reduce((sum, e) => sum + (e.durationMinutes as number), 0);

  const percent = Math.min(100, (dailyTotal / DAILY_LIMIT_MINUTES) * 100);
  const remaining = Math.max(0, DAILY_LIMIT_MINUTES - dailyTotal);
  const overLimit = dailyTotal > DAILY_LIMIT_MINUTES;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Today's Break Time
        </h2>
        <span className={`text-sm font-semibold ${getUsageColor(percent)}`}>
          {percent.toFixed(0)}%
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {formatDuration(dailyTotal)}
        </span>
        <span className="text-sm text-slate-400">
          of {formatDuration(DAILY_LIMIT_MINUTES)}
        </span>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(percent)}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        {overLimit ? (
          <span className="font-medium text-red-600">
            {formatDuration(dailyTotal - DAILY_LIMIT_MINUTES)} over limit
          </span>
        ) : (
          <span className="font-medium text-slate-600">
            {formatDuration(remaining)} remaining
          </span>
        )}
        <span className="text-slate-400">
          {entries.filter((e) => e.date === today).length} break
          {entries.filter((e) => e.date === today).length === 1 ? '' : 's'} today
        </span>
      </div>
    </div>
  );
}
