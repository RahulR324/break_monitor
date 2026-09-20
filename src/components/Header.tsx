import { Clock } from 'lucide-react';

export function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white sm:h-12 sm:w-12">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Break Time Monitor
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">{today}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
