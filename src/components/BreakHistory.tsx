import { useState } from 'react';
import { Trash2, Clock, History, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDuration, formatTimeDisplay, formatDateDisplay } from '@/utils/time';
import type { BreakEntry } from '@/types';
import { DAILY_LIMIT_MINUTES } from '@/types';

interface BreakHistoryProps {
  entries: BreakEntry[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

interface DayGroup {
  date: string;
  entries: BreakEntry[];
  total: number;
}

function groupByDate(entries: BreakEntry[]): DayGroup[] {
  const groups = new Map<string, BreakEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.date) ?? [];
    list.push(entry);
    groups.set(entry.date, list);
  }

  return Array.from(groups.entries())
    .map(([date, dayEntries]) => ({
      date,
      entries: dayEntries.sort((a, b) => b.createdAt - a.createdAt),
      total: dayEntries
        .filter((e) => e.durationMinutes !== null)
        .reduce((sum, e) => sum + (e.durationMinutes as number), 0),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function BreakHistory({ entries, onDelete, onClearAll }: BreakHistoryProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [confirmClear, setConfirmClear] = useState(false);

  const groups = groupByDate(entries);

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          History
        </h2>
        <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <History className="h-6 w-6 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600">
            No breaks logged yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Your break history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          History
        </h2>
        {confirmClear ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Clear all?</span>
            <button
              onClick={() => {
                onClearAll();
                setConfirmClear(false);
              }}
              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs font-medium text-slate-400 transition-colors hover:text-red-600"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {groups.map((group) => {
          const isExpanded = expandedDays.has(group.date);
          const overLimit = group.total > DAILY_LIMIT_MINUTES;
          const visibleEntries = isExpanded
            ? group.entries
            : group.entries.slice(0, 2);

          return (
            <div
              key={group.date}
              className="rounded-lg border border-slate-200 bg-slate-50/50"
            >
              <button
                onClick={() => toggleDay(group.date)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {formatDateDisplay(group.date)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      overLimit
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {formatDuration(group.total)}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              <div className="border-t border-slate-200">
                {visibleEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-white"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Clock className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700">
                          {formatTimeDisplay(entry.startTime)} —{' '}
                          {entry.endTime ? formatTimeDisplay(entry.endTime) : 'In progress'}
                        </p>
                        {entry.note && (
                          <p className="truncate text-xs text-slate-400">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700">
                        {entry.durationMinutes !== null
                          ? formatDuration(entry.durationMinutes)
                          : '—'}
                      </span>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="text-slate-300 transition-colors hover:text-red-600 group-hover:text-slate-400"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!isExpanded && group.entries.length > 2 && (
                <button
                  onClick={() => toggleDay(group.date)}
                  className="w-full px-4 py-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
                >
                  Show {group.entries.length - 2} more
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
