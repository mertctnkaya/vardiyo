import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { usePageTitle } from '../hooks/usePageTitle';
import { useShiftCalculator } from '../hooks/useShiftCalculator';
import WeekList from '../components/next-weeks/WeekList';

export default function NextWeeks() {
  usePageTitle('Gelecek Haftalar');
  const { settings } = useAppStore();
  const { getShiftForDate } = useShiftCalculator();

  const upcomingWeeks = useMemo(() => {
    const list = [];
    const today = new Date();

    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + diffToMonday);
    currentMonday.setHours(0, 0, 0, 0);

    const workType = settings?.work_type || '3-shift';

    for (let i = 0; i < 10; i++) {
      const weekStart = new Date(currentMonday);
      weekStart.setDate(currentMonday.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      let shiftName = '';
      if (workType === 'yevmiye') {
        shiftName = 'Yevmiye (Günlük Çalışma)';
      } else if (['fixed', '3-shift', '2-shift'].includes(workType)) {
        // For weekly systems, find the first non-off day to represent the week
        let firstWorkingShift = 'Hafta Tatili';
        for (let d = 0; d < 7; d++) {
          const testDate = new Date(weekStart);
          testDate.setDate(weekStart.getDate() + d);
          const s = getShiftForDate(testDate);
          if (!s.isOffDay) {
            firstWorkingShift = s.name;
            break;
          }
        }
        shiftName = firstWorkingShift;
      } else {
        // For daily rotating cyclic systems (4-shift, 12-36, 24-48)
        // Extract the unique pattern for the week to show a summary
        const days = [];
        for (let d = 0; d < 7; d++) {
          const testDate = new Date(weekStart);
          testDate.setDate(weekStart.getDate() + d);
          const s = getShiftForDate(testDate);
          days.push(s.name === 'Hafta Tatili' ? 'Tatil' : s.name);
        }

        const summary = [];
        for (let j = 0; j < days.length; j++) {
          if (j === 0 || days[j] !== days[j - 1]) {
            summary.push(days[j]);
          }
        }

        shiftName = summary.join(' ➔ ');
        // If it's too long (like 12-36 repeating), truncate it safely
        if (shiftName.length > 35) {
          shiftName = summary.slice(0, 4).join(' ➔ ') + ' ➔ ...';
        }
      }

      list.push({ weekStart, weekEnd, shiftName });
    }
    return list;
  }, [settings, getShiftForDate]);

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10">
      <div className="w-full max-w-4xl mb-6 px-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Gelecek Haftalar</h2>
          <p className="text-base-content/60 mt-1">Önümüzdeki 10 haftanın vardiya planlaması.</p>
        </div>
      </div>

      <WeekList upcomingWeeks={upcomingWeeks} />
    </div>
  );
}
