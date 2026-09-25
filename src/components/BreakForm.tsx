import { useState } from 'react';
import { Play, Square, AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import { getTodayString, getCurrentTimeString, calculateDuration } from '@/utils/time';
import type { BreakEntry } from '@/types';
import { DAILY_LIMIT_MINUTES } from '@/types';

interface BreakFormProps {
  activeBreak: BreakEntry | null;
  currentDailyTotal: number;
  onStart: (startTime: string, note: string, date: string) => void;
  onEnd: (id: string, endTime: string) => void;
}

export function BreakForm({
  activeBreak,
  currentDailyTotal,
  onStart,
  onEnd,
}: BreakFormProps) {
  const [startTime, setStartTime] = useState('');
  const [note, setNote] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [overLimitMsg, setOverLimitMsg] = useState('');

  const today = getTodayString();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOverLimitMsg('');

    const time = startTime || getCurrentTimeString();

    onStart(time, note.trim(), today);

    setStartTime('');
    setNote('');
  };

  const handleEnd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!activeBreak) return;

    const time = endTime || getCurrentTimeString();

    const dur = calculateDuration(activeBreak.startTime, time);
    if (dur <= 0) {
      setError('End time must be after the start time.');
      return;
    }

    const newTotal = currentDailyTotal + dur;

    onEnd(activeBreak.id, time);
    setEndTime('');

    if (newTotal > DAILY_LIMIT_MINUTES) {
      const over = Math.floor(newTotal - DAILY_LIMIT_MINUTES);
      setOverLimitMsg(
        `You've taken ${over} min more than your 1 hr limit today.`
      );
    }
  };

  const handleCancel = () => {
    setError('');
    setEndTime('');
  };

  if (activeBreak) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200">
            <Clock className="h-4 w-4 text-amber-700" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Break in progress
          </h2>
        </div>

        <div className="mt-4 rounded-lg bg-white px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Started at</span>
            <span className="font-semibold text-slate-900">
              {activeBreak.startTime}
            </span>
          </div>
          {activeBreak.note && (
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-slate-500">Note</span>
              <span className="font-medium text-slate-700">{activeBreak.note}</span>
            </div>
          )}
        </div>


        <form onSubmit={handleEnd} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="end-time"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              End Time{' '}
              <span className="text-slate-400">
                (leave blank to use current time)
              </span>
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 active:bg-slate-950"
            >
              <Square className="h-4 w-4" />
              End Break
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Start a Break
      </h2>

      <form onSubmit={handleStart} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="start-time"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Start Time{' '}
            <span className="text-slate-400">
              (leave blank to use current time)
            </span>
          </label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
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

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {overLimitMsg && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{overLimitMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 active:bg-slate-950"
        >
          <Play className="h-4 w-4" />
          Start Break
        </button>
      </form>
    </div>
  );
}
