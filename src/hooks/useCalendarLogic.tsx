import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useShiftCalculator } from './useShiftCalculator';

export function useCalendarLogic() {
  const { settings } = useAppStore();
  const [baseDate, setBaseDate] = useState(new Date());

  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();

  const employmentStartDate = useMemo(() => {
    return settings?.employment_start_date
      ? new Date(settings.employment_start_date + 'T00:00:00')
      : new Date('2026-06-09T00:00:00');
  }, [settings]);

  const { getShiftForDate: getShiftEngineDate } = useShiftCalculator();

  const handlePrevMonth = () => setBaseDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setBaseDate(new Date(currentYear, currentMonth + 1, 1));
  const handleGoToToday = () => setBaseDate(new Date());

  const getShiftForDate = (date: Date, workLogsMap?: Record<string, any>) => {
    const shift = getShiftEngineDate(date, workLogsMap);
    return {
      id: shift.id,
      name: shift.name === 'Hafta Tatili' ? 'Tatil' : shift.name,
      isNight: shift.isNight,
      isOffDay: shift.isOffDay
    };
  };

  const generateCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;

    const days = [];
    for (let i = 1; i < startDayOfWeek; i++) {
      const prevDate = new Date(currentYear, currentMonth, 1 - (startDayOfWeek - i));
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({ date: new Date(currentYear, currentMonth, i), isCurrentMonth: true });
    }
    const totalCells = days.length > 35 ? 42 : 35;
    const extraDays = totalCells - days.length;
    for (let i = 1; i <= extraDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  const calendarDays = generateCalendar();

  return {
    baseDate,
    currentYear,
    currentMonth,
    employmentStartDate,
    calendarDays,
    handlePrevMonth,
    handleNextMonth,
    handleGoToToday,
    getShiftForDate
  };
}
