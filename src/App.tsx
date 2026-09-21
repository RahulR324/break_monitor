import { Header } from '@/components/Header';
import { BreakProgress } from '@/components/BreakProgress';
import { BreakForm } from '@/components/BreakForm';
import { BreakHistory } from '@/components/BreakHistory';
import { useBreakEntries } from '@/hooks/useBreakEntries';
import { getTodayString, getDailyTotal, getActiveBreak } from '@/utils/time';

function App() {
  const { entries, startBreak, endBreak, deleteEntry, clearAll } = useBreakEntries();
  const today = getTodayString();
  const todayTotal = getDailyTotal(entries, today);
  const activeBreak = getActiveBreak(entries);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <BreakProgress entries={entries} today={today} />
            <BreakForm
              activeBreak={activeBreak}
              currentDailyTotal={todayTotal}
              onStart={startBreak}
              onEnd={endBreak}
            />
          </div>
          <div>
            <BreakHistory
              entries={entries}
              onDelete={deleteEntry}
              onClearAll={clearAll}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
