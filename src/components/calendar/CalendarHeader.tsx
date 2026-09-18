import type { CalendarHeaderProps } from '../../types/calendar';
import { useAppStore } from '../../store/useAppStore';

export default function CalendarHeader({ baseDate, onPrev, onNext, onToday }: CalendarHeaderProps) {
  const { settings } = useAppStore();

  let workTypeLabel = '3 Vardiya';
  if (settings?.work_type === '2-shift') workTypeLabel = '2 Vardiya';
  else if (settings?.work_type === 'fixed') workTypeLabel = 'Sabit Vardiya';
  else if (settings?.work_type === 'yevmiye') workTypeLabel = 'Yevmiye (Günlük)';
  else if (settings?.work_type === '4-shift-222') workTypeLabel = '4\'lü Vardiya (2+2+2)';
  else if (settings?.work_type === '12-36') workTypeLabel = '12/36 Sistemi';
  else if (settings?.work_type === '24-48') workTypeLabel = '24/48 Sistemi';

  return (
    <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-6 px-2 gap-4">
      {/* Başlık ve Vardiya Türü Rozeti - Her ekranda her zaman görünür */}
      <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-base-content whitespace-nowrap">
          {new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(baseDate)}
        </h2>
        <span className="badge bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-bold px-2.5 py-1.5 shadow-sm">
          {workTypeLabel}
        </span>
      </div>

      {/* Navigasyon Butonları */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={onPrev}
          className="btn btn-sm sm:btn-md p-3 bg-base-200 hover:bg-base-100 border border-base-300 text-base-content text-xs sm:text-sm shadow-sm transition-all"
        >
          &laquo; Önceki Ay
        </button>
        <button
          onClick={onToday}
          className="btn btn-sm sm:btn-md p-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md shadow-indigo-900/40 text-xs sm:text-sm transition-all"
        >
          Bugün
        </button>
        <button
          onClick={onNext}
          className="btn btn-sm sm:btn-md p-3 bg-base-200 hover:bg-base-100 border border-base-300 text-base-content text-xs sm:text-sm shadow-sm transition-all"
        >
          Sonraki Ay &raquo;
        </button>
      </div>
    </div>
  );
}
