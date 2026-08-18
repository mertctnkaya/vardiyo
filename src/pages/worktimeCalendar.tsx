import type { DayDetail } from '../types';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useCalendarLogic } from '../hooks/useCalendarLogic';
import { getLocalDateString } from '../utils/dateUtils';
import { fetchMonthWorkLogs } from '../services/dbService';
import { printDocumentAsPDF, downloadDataAsJSON, downloadCalendarAsCSV, generateFileName } from '../utils/exportUtils';
import { supabase } from '../lib/supabaseClient';
import ExportPanel from '../components/shared/ExportPanel';

import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarStats from '../components/calendar/CalendarStats';
import DayActionModal from '../components/calendar/DayActionModal';
import CalendarPause from '../components/calendar/CalendarPause';

export default function WorktimeCalendar() {
  const { user } = useAppStore();

  const {
    baseDate,
    currentYear,
    currentMonth,
    employmentStartDate,
    calendarDays,
    handlePrevMonth,
    handleNextMonth,
    handleGoToToday,
    getShiftForDate
  } = useCalendarLogic();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);

  const [workLogs, setWorkLogs] = useState<Record<string, any>>({});

  const [isCalendarPaused, setIsCalendarPaused] = useState(false);
  const [pausedDates, setPausedDates] = useState<{ start: string; end: string | null } | null>(null);

  const actualToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    const firstDay = getLocalDateString(new Date(currentYear, currentMonth, 1));
    const lastDay = getLocalDateString(new Date(currentYear, currentMonth + 1, 0));
    const data = await fetchMonthWorkLogs(user.id, firstDay, lastDay);
    if (data) setWorkLogs(data);
  }, [user, currentMonth, currentYear]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, baseDate]);

  useEffect(() => {
    if (!user) return;

    const fetchPauseConfig = async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('is_paused, pause_start_date, pause_end_date')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setIsCalendarPaused(data.is_paused || false);
        if (data.is_paused && data.pause_start_date) {
          setPausedDates({
            start: data.pause_start_date,
            end: data.pause_end_date
          });
        }
      }
    };

    fetchPauseConfig();
  }, [user]);

  const handleDayClick = (dayData: DayDetail, isBeforeEmployment: boolean) => {
    if (isBeforeEmployment) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedDay(dayData);
    setIsModalOpen(true);
  };

  const handleUpdateLog = (dateKey: string, data: any) => {
    setWorkLogs(prev => ({ ...prev, [dateKey]: data }));
  };

  const handleDeleteLogState = (dateKey: string) => {
    setWorkLogs(prev => {
      const newLogs = { ...prev };
      delete newLogs[dateKey];
      return newLogs;
    });
  };

  const handleClearRange = async (start: string, end: string) => {
    if (!user) return;
    if (!window.confirm(`${start} ile ${end} tarihleri arasındaki tüm kayıtlar silinecek. Onaylıyor musunuz?`)) return;

    const { error } = await supabase
      .from('work_logs')
      .delete()
      .eq('user_id', user.id)
      .gte('log_date', start)
      .lte('log_date', end);

    if (!error) {
      alert('Seçili aralıktaki tüm kayıtlar başarıyla temizlendi.');
      fetchLogs();
    } else {
      alert('Hata oluştu: ' + error.message);
    }
  };

  const monthlyStats = useMemo(() => {
    let normal = 0, overtimeHours = 0, lateHours = 0, absent = 0;
    let leave = 0, annualLeave = 0, holidayWork = 0, weekendPaid = 0;
    let maxConsecutiveAbsent = 0, currentConsecutive = 0;

    calendarDays.forEach(item => {
      if (!item.isCurrentMonth || item.date < employmentStartDate) return;

      const dateKey = getLocalDateString(item.date);
      const log = workLogs[dateKey];
      const shift = getShiftForDate(item.date);
      const isPast = item.date < actualToday;
      const isToday = item.date.toDateString() === actualToday.toDateString();

      if (log) {
        if (log.status === 'normal') normal++;
        if (log.status === 'overtime') { normal++; overtimeHours += (Number(log.hours) || 0); }
        if (log.status === 'late' || log.status === 'partial_leave') { normal++; lateHours += (Number(log.hours) || 0); }
        if (log.status === 'absent') absent++;
        if (log.status === 'leave') leave++;
        if (log.status === 'annual_leave') annualLeave++;
        if (log.status === 'holiday_work') holidayWork++;
      } else if (isPast || isToday) {
        if (!shift.isOffDay) normal++;
        else weekendPaid++;
      }

      if (log && log.status === 'absent') {
        currentConsecutive++;
        if (currentConsecutive > maxConsecutiveAbsent) maxConsecutiveAbsent = currentConsecutive;
      } else if (!shift.isOffDay) {
        currentConsecutive = 0;
      }
    });

    const isDangerAbsent = absent >= 3 || maxConsecutiveAbsent >= 2;

    return {
      normal, overtimeHours, lateHours, absent, leave, annualLeave, holidayWork, weekendPaid,
      isDangerAbsent, maxConsecutiveAbsent
    };
  }, [calendarDays, workLogs, employmentStartDate, actualToday, getShiftForDate]);

  const handleExportCSV = () => {
    const fileName = generateFileName('Vardiyo', baseDate, user?.user_metadata?.name, '.csv');
    downloadCalendarAsCSV(fileName, calendarDays, workLogs, employmentStartDate, getShiftForDate);
  };

  const handleExportJSON = () => {
    const currentMonthLogs: Record<string, any> = {};
    calendarDays.forEach(item => {
      if (!item.isCurrentMonth || item.date < employmentStartDate) return;
      const dateStr = getLocalDateString(item.date);
      if (workLogs[dateStr]) currentMonthLogs[dateStr] = workLogs[dateStr];
    });
    downloadDataAsJSON(generateFileName('Vardiyo', baseDate, user?.user_metadata?.name, '.json'), currentMonthLogs);
  };

  const handlePrintPDF = () => {
    printDocumentAsPDF(generateFileName('Vardiyo', baseDate, user?.user_metadata?.name, ''));
  };

  const handlePauseRange = async (start: string, end: string | null) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_settings')
      .update({
        is_paused: true,
        pause_start_date: start,
        pause_end_date: end
      })
      .eq('user_id', user.id);

    if (!error) {
      setIsCalendarPaused(true);
      setPausedDates({ start, end });
      alert('Takvim belirlediğiniz tarihler arasında başarıyla duraklatıldı.');
    } else {
      alert('Hata oluştu: ' + error.message);
    }
  };

  const handlePauseCurrentMonth = async () => {
    const today = new Date();
    const firstDay = getLocalDateString(new Date(today.getFullYear(), today.getMonth(), 1));
    const lastDay = getLocalDateString(new Date(today.getFullYear(), today.getMonth() + 1, 0));

    await handlePauseRange(firstDay, lastDay);
  };

  const handleResume = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_settings')
      .update({
        is_paused: false,
        pause_start_date: null,
        pause_end_date: null
      })
      .eq('user_id', user.id);

    if (!error) {
      setIsCalendarPaused(false);
      setPausedDates(null);
      alert('Takvim tekrar aktif edildi. Mesai üretimi devam edecek.');
    }
  };

  const handleSaveAnnualLeave = async (start: string, end: string) => {
    if (!user) return;
    const datesToInsert = [];
    let currentDate = new Date(`${start}T00:00:00`);
    const finalDate = new Date(`${end}T00:00:00`);

    while (currentDate <= finalDate) {
      datesToInsert.push({
        user_id: user.id,
        log_date: getLocalDateString(currentDate),
        status: 'annual_leave',
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const { error } = await supabase.from('work_logs').upsert(datesToInsert, { onConflict: 'user_id, log_date' });

    if (!error) {
      alert(`${datesToInsert.length} günlük Yıllık İzin takvime başarıyla işlendi.`);
      fetchLogs();
    } else {
      alert('Yıllık izin kaydedilirken hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>

      {isCalendarPaused && (
        <div className="w-full max-w-5xl px-2 mb-4 mt-2 animate-fade-in">
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex gap-4 items-center shadow-lg">
            <div className="bg-warning/20 p-2 rounded-full shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-warning font-bold text-sm sm:text-base mb-0.5">Takvim Duraklatıldı</h3>
              <p className="text-warning/80 text-xs sm:text-sm">
                Sistem <strong>{pausedDates?.start}</strong> ile <strong>{pausedDates?.end || 'Belirsiz'}</strong> tarihleri arasında vardiya ve mesai üretmeyecektir. Alt bölümden işlemi iptal edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      )}

      <CalendarHeader
        baseDate={baseDate}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={handleGoToToday}
      />

      <CalendarGrid
        calendarDays={calendarDays}
        getShiftForDate={getShiftForDate}
        actualToday={actualToday}
        employmentStartDate={employmentStartDate}
        workLogs={workLogs}
        onDayClick={handleDayClick}
        isPaused={isCalendarPaused}
        pausedDates={pausedDates}
      />

      <CalendarStats
        monthlyStats={monthlyStats}
        baseDate={baseDate}
      />

      <ExportPanel
        onExportCSV={handleExportCSV}
        onPrintPDF={handlePrintPDF}
        onExportJSON={handleExportJSON}
      />

      <CalendarPause
        isPaused={isCalendarPaused}
        pausedDates={pausedDates}
        onPauseRange={handlePauseRange}
        onPauseCurrentMonth={handlePauseCurrentMonth}
        onResume={handleResume}
        onSaveAnnualLeave={handleSaveAnnualLeave}
        onClearRange={handleClearRange}
      />

      {isModalOpen && selectedDay && (
        <DayActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDay={selectedDay}
          existingLog={workLogs[getLocalDateString(selectedDay.date)]}
          actualToday={actualToday}
          user={user}
          onUpdateLog={handleUpdateLog}
          onDeleteLog={handleDeleteLogState}
        />
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setShowAuthModal(false)}></div>
          <div className="bg-base-200 border border-base-300 rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl w-full max-w-sm flex flex-col animate-fade-in text-center">
            <h3 className="font-bold text-xl text-base-content mb-2">Giriş Yapmanız Gerekiyor</h3>
            <p className="text-base-content/70 mb-6 text-sm">Bu güne dair mesai durumu veya not girmek için oturum açmalısınız.</p>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none">Giriş Yap / Kayıt Ol</Link>
              <button className="btn btn-ghost hover:bg-base-300 text-base-content/80" onClick={() => setShowAuthModal(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}