import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { calculateDuration, getTodayString } from '@/utils/time';
import type { BreakEntry } from '@/types';
import { DAILY_LIMIT_MINUTES } from '@/types';

interface BreakFormProps {
  onAdd: (entry: Omit<BreakEntry, 'id' | 'createdAt'>) => void;
  currentDailyTotal: number;
}

export function BreakForm({ onAdd, currentDailyTotal }: BreakFormProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [duration, setDuration] = useState<number | null>(null);

  const today = getTodayString();

  const handleCalculate = () => {
    if (!startTime || !endTime) {
      setDuration(null);
      return;
    }
    const dur = calculateDuration(startTime, endTime);
    if (dur <= 0) {
      setDuration(null);
      return;
    }
    setDuration(dur);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startTime || !endTime) {
      setError('Please enter both start and end times.');
      return;
    }

    const dur = calculateDuration(startTime, endTime);
    if (dur <= 0) {
      setError('End time must be after start time.');
      return;
    }

    const newTotal = currentDailyTotal + dur;
    if (newTotal > DAILY_LIMIT_MINUTES) {
      const over = newTotal - DAILY_LIMIT_MINUTES;
      setError(
        `This break would exceed your daily limit by ${over} min. Current total: ${currentDailyTotal} min.`
      );
      return;
    }

    onAdd({
      date: today,
      startTime,
      endTime,
      durationMinutes: dur,
      note: note.trim(),
    });

    setStartTime('');
    setEndTime('');
    setNote('');
    setDuration(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Log a Break
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start-time"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Start Time
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setDuration(null);
              }}
              onBlur={handleCalculate}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              End Time
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setDuration(null);
              }}
              onBlur={handleCalculate}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="note"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Note <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Lunch, Coffee, Walk"
            maxLength={50}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {duration !== null && duration > 0 && (
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Break duration:{' '}
            <span className="font-semibold text-slate-900">
              {duration >= 60
                ? `${Math.floor(duration / 60)} hr ${duration % 60} min`
                : `${duration} min`}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 active:bg-slate-950"
        >
          <Plus className="h-4 w-4" />
          Add Break
        </button>
      </form>
    </div>
  );
}
