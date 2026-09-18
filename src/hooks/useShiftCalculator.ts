import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const SHIFTS = [
  { id: 0, name: 'Gündüz', note: '' },
  { id: 1, name: 'Gece', note: 'DİKKAT: Bu gece akşamından servise biniş!' },
  { id: 2, name: 'Akşam', note: '' },
  { id: 3, name: '24 Saat Nöbet', note: 'Ertesi gün istirahat.' }
];

export function useShiftCalculator() {
  const { settings } = useAppStore();
  const [targetDate, setTargetDate] = useState<Date>(new Date());

  const epochDate = useMemo(() => {
    return settings?.shift_epoch_date 
      ? new Date(settings.shift_epoch_date + 'T00:00:00') 
      : new Date('2026-07-06T00:00:00');
  }, [settings]);

  // Yardımcı fonksiyon: Tarihler arası tam gün farkını hesaplar (Timezone güvenli)
  const getDiffDays = (date1: Date, date2: Date) => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getShiftForDate = (date: Date, workLogsMap?: Record<string, any>) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Eğer logun üzerinde önceden basılmış bir damga varsa (manuel veya ayı kapat ile) her zaman koru.
    if (workLogsMap && workLogsMap[dateStr]) {
      const log = workLogsMap[dateStr];
      if (log.frozen_shift_name) {
        const isYevmiyeEmpty = log.frozen_shift_name.includes('Boş / Çalışılmadı');
        return {
          id: isYevmiyeEmpty ? -2 : 999, // Kilitli vardiyalar için geçici id
          name: log.frozen_shift_name,
          note: '🔒 Kilitli Gün: Bu vardiya geçmişte dondurulmuştur.',
          isOffDay: log.status === 'off_day' || log.note === 'SYSTEM_AUTO_OFF',
          isNight: log.frozen_shift_name.toLowerCase().includes('gece')
        };
      }
    }

    const workType = settings?.work_type || '3-shift';
    const dayOfWeek = date.getDay(); // 0: Pazar, 1: Pzt...
    const diffDays = getDiffDays(date, epochDate);

    // DÖNGÜSEL (PATTERN) VARDİYALAR İÇİN (2+2+2, 12/36, 24/48 vb.)
    if (settings?.shift_pattern && settings.shift_pattern.length > 0) {
      const len = settings.shift_pattern.length;
      // Negatif farkları doğru modüle çevirme (geçmiş tarihler için)
      const patternIndex = ((diffDays % len) + len) % len;
      const shiftId = settings.shift_pattern[patternIndex];

      if (shiftId === -1) {
        return { id: -1, name: 'Hafta Tatili', note: '', isOffDay: true, isNight: false };
      }

      const shiftDef = SHIFTS.find(s => s.id === shiftId) || SHIFTS[0];
      return { ...shiftDef, isOffDay: false, isNight: shiftDef.id === 1 };
    }

    // HAFTALIK SABİT DÖNGÜLÜ VARDİYALAR İÇİN (Klasik 3'lü, Sabit, Yevmiye vb.)
    let isOffDay = false;
    if (settings?.rest_days) {
      isOffDay = settings.rest_days.includes(dayOfWeek);
    } else {
      // Fallback: Eski kullanıcılar için rest_days tanımlı değilse
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      const isSaturdayWork = settings?.is_saturday_workday || false;

      isOffDay = isSunday;
      if (workType === 'fixed') {
        isOffDay = isSunday || (!isSaturdayWork && isSaturday);
      } else if (workType === 'yevmiye') {
        isOffDay = isSunday;
      }
    }

    if (isOffDay) {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      // Hafta sonu izininden sonraki gün gece vardiyası mı başlıyor? (Eski servise biniş uyarısı fallback)
      let note = '';
      const diffToMondayNext = nextDay.getDay() === 0 ? -6 : 1 - nextDay.getDay();
      const mondayNext = new Date(nextDay);
      mondayNext.setDate(nextDay.getDate() + diffToMondayNext);
      const diffWeeksNext = Math.floor(getDiffDays(mondayNext, epochDate) / 7);
      
      let nextShiftIdx = 0;
      if (workType === '3-shift') nextShiftIdx = ((diffWeeksNext % 3) + 3) % 3;
      else if (workType === '2-shift') nextShiftIdx = ((diffWeeksNext % 2) + 2) % 2;

      if (SHIFTS[nextShiftIdx]?.id === 1 && (workType === '3-shift' || workType === '2-shift')) {
        note = 'DİKKAT: Bu gece akşamından servise biniş!';
      }

      return { id: -1, name: 'Hafta Tatili', note, isOffDay: true, isNight: false };
    }

    // İzin günü değilse, o haftaki vardiyasını bul
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayDate = new Date(date);
    mondayDate.setDate(date.getDate() + diffToMonday);
    
    const diffWeeks = Math.floor(getDiffDays(mondayDate, epochDate) / 7);

    let shiftIndex = 0;
    if (workType === '3-shift') {
        shiftIndex = ((diffWeeks % 3) + 3) % 3;
    } else if (workType === '2-shift') {
        shiftIndex = ((diffWeeks % 2) + 2) % 2;
    } else if (workType === 'fixed' || workType === 'yevmiye') {
        shiftIndex = 0;
    }

    if (workType === 'yevmiye') {
        return { id: -2, name: 'Boş / Çalışılmadı', note: 'Bugün çalıştıysanız tıklayıp işaretleyin.', isOffDay: false, isNight: false };
    }

    const shift = { ...SHIFTS[shiftIndex] };
    if (workType === 'fixed') shift.name = 'Sabit Gündüz';

    shift.note = ''; // Uyarılar sadece isOffDay (izin gününde) verilir
    return { ...shift, isOffDay: false, isNight: shift.id === 1 };
  };

  const currentShift = useMemo(() => {
    return getShiftForDate(targetDate);
  }, [targetDate, epochDate, settings]);

  const scheduleList = useMemo(() => {
    const list = [];
    const baseDate = new Date(targetDate);
    
    const day = baseDate.getDay();
    const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(baseDate.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 5; i++) {
      const weekStart = new Date(startOfWeek);
      weekStart.setDate(weekStart.getDate() + (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 5); 

      const s = getShiftForDate(weekStart);
      list.push({ weekStart, weekEnd, shift: s });
    }
    return list;
  }, [targetDate, epochDate, settings]);

  return { targetDate, setTargetDate, currentShift, scheduleList, getShiftForDate };
}
