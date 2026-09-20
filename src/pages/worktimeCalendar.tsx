import type { DayDetail } from '../types';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useCalendarLogic } from '../hooks/useCalendarLogic';
import { getLocalDateString } from '../utils/dateUtils';
import { fetchMonthWorkLogs, updateUserSettings, saveWorkLogBatch, clearMonthWorkLogs, fetchUserSettings, toggleMonthFreeze, deleteUserWorkLog } from '../services/dbService';
import { downloadDataAsJSON, downloadCalendarAsCSV, generateFileName } from '../utils/exportUtils';
import ExportPanel from '../components/shared/ExportPanel';
import PremiumPaywallModal from '../components/shared/PremiumPaywallModal';
import { IS_PAYWALL_ACTIVE } from '../config/features';
import { usePageTitle } from '../hooks/usePageTitle';
import { useToastStore } from '../store/useToastStore';

import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarStats from '../components/calendar/CalendarStats';
import DayActionModal from '../components/calendar/DayActionModal';
import CalendarPause from '../components/calendar/CalendarPause';
import { DAYS_OF_WEEK } from '../constants/calendar';
import { TURKISH_HOLIDAYS_2026 } from '../constants/holidays';

export default function WorktimeCalendar() {
  usePageTitle('Mesai Takvimim');

  const { user, settings, setSettings } = useAppStore();
  const { addToast } = useToastStore();

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

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNextMonth();
    } else if (distance < -minSwipeDistance) {
      handlePrevMonth();
    }
  };

  const [workLogs, setWorkLogs] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [isCalendarPaused, setIsCalendarPaused] = useState(false);
  const [pausedDates, setPausedDates] = useState<{ start: string; end: string | null } | null>(null);

  const isPremiumOrAdmin = settings?.role === 'admin' || (settings?.premium_until && new Date(settings.premium_until) > new Date());
  const hasAccessToFreeze = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;
  const [showPaywall, setShowPaywall] = useState(false);

  const actualToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const fetchLogs = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const firstDay = getLocalDateString(new Date(currentYear, currentMonth, 1));
    const lastDay = getLocalDateString(new Date(currentYear, currentMonth + 1, 0));
    const data = await fetchMonthWorkLogs(user.id, firstDay, lastDay);
    if (data) setWorkLogs(data);
    setIsLoading(false);
  }, [user, currentMonth, currentYear]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, baseDate]);

  useEffect(() => {
    if (!user) return;

    const fetchPauseConfig = async () => {
      const data = await fetchUserSettings(user.id);

      if (data) {
        setIsCalendarPaused(data.is_paused || false);
        if (data.is_paused && data.pause_start_date) {
          setPausedDates({
            start: data.pause_start_date,
            end: data.pause_end_date || null
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

    const { error } = await clearMonthWorkLogs(user.id, start, end);

    if (!error) {
      addToast('Seçili aralıktaki tüm kayıtlar başarıyla temizlendi.', 'success');
      fetchLogs();
    } else {
      addToast('Hata oluştu: ' + error?.message, 'error');
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
      const shift = getShiftForDate(item.date, workLogs);
      const isPast = item.date < actualToday;
      const isToday = item.date.toDateString() === actualToday.toDateString();

      if (log && log.status !== 'unlogged_normal' && log.status !== 'off_day' && log.note !== 'SYSTEM_AUTO_OFF' && log.note !== 'SYSTEM_AUTO_NORMAL') {
        if (log.status === 'normal') normal++;
        if (log.status === 'overtime') { normal++; overtimeHours += (Number(log.hours) || 0); }
        if (log.status === 'late' || log.status === 'partial_leave') { normal++; lateHours += (Number(log.hours) || 0); }
        if (log.status === 'absent') absent++;
        if (log.status === 'leave') leave++;
        if (log.status === 'annual_leave') annualLeave++;
        if (log.status === 'holiday_work') holidayWork++;
      } else if (isPast || isToday) {
        if (shift.isOffDay) {
          weekendPaid++;
        } else if (shift.id !== -2) {
          normal++;
        }
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
    import('../utils/pdfGenerator').then(({ generateAdvancedCalendarPDF }) => {
      generateAdvancedCalendarPDF(
        calendarDays,
        workLogs,
        getShiftForDate,
        employmentStartDate,
        baseDate,
        user?.user_metadata?.name || 'Kullanici',
        generateFileName('Vardiyo', baseDate, user?.user_metadata?.name, '.pdf'),
        settings?.work_type || 'aylik'
      );
    });
  };

  const handlePauseRange = async (start: string, end: string | null) => {
    if (!user) return;

    const { error } = await updateUserSettings(user.id, {
      is_paused: true,
      pause_start_date: start,
      pause_end_date: end
    });

    if (!error) {
      setIsCalendarPaused(true);
      setPausedDates({ start, end });
      addToast('Takvim belirlediğiniz tarihler arasında başarıyla duraklatıldı.', 'warning');
    } else {
      addToast('Hata oluştu: ' + error?.message, 'error');
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

    const { error } = await updateUserSettings(user.id, {
      is_paused: false,
      pause_start_date: null,
      pause_end_date: null
    });

    if (!error) {
      setIsCalendarPaused(false);
      setPausedDates(null);
      addToast('Takvim tekrar aktif edildi. Mesai üretimi devam edecek.', 'success');
    }
  };

  const handleSaveAnnualLeave = async (start: string, end: string) => {
    if (!user) return;
    const datesToInsert = [];
    let currentDate = new Date(`${start}T00:00:00`);
    const finalDate = new Date(`${end}T00:00:00`);

    while (currentDate <= finalDate) {
      const dateStr = getLocalDateString(currentDate);
      const isPublicHoliday = !!TURKISH_HOLIDAYS_2026[dateStr];
      const shift = getShiftForDate(currentDate);

      // Sadece çalışılması gereken normal günlere yıllık izin yazılır
      if (!shift.isOffDay && !isPublicHoliday) {
        datesToInsert.push({
          user_id: user.id,
          log_date: dateStr,
          status: 'annual_leave',
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (datesToInsert.length === 0) {
      addToast('Seçilen aralıkta izin düşülecek normal mesai günü bulunamadı (Hafta sonu veya resmi tatile denk gelmiş olabilir).', 'warning');
      return;
    }

    const { error } = await saveWorkLogBatch(user.id, datesToInsert);

    if (!error) {
      addToast(`${datesToInsert.length} günlük Yıllık İzin takvime başarıyla işlendi.`, 'success');
      fetchLogs();
    } else {
      addToast('Hata oluştu: ' + error?.message, 'error');
    }
  };

  const currentMonthKey = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}`;
  const isMonthFrozen = settings?.frozen_months?.includes(currentMonthKey) || false;

  const handleToggleMonthFreeze = async () => {
    if (!user) return;
    if (!hasAccessToFreeze) {
      setShowPaywall(true);
      return;
    }
    const newFrozenStatus = !isMonthFrozen;

    if (newFrozenStatus) {
      if (!window.confirm('Bu ayı kesinleştirmek/kapatmak üzeresiniz. Bu işlem geçmiş günleri kilitler ve vardiya sistemini değiştirseniz bile bu ayın maaşı/vardiyaları etkilenmez. Onaylıyor musunuz?')) return;

      const datesToInsert: any[] = [];
      calendarDays.forEach(item => {
        if (!item.isCurrentMonth || item.date < employmentStartDate) return;

        const dateStr = getLocalDateString(item.date);
        const shift = getShiftForDate(item.date);

        const basePayload = {
          user_id: user.id,
          log_date: dateStr,
          frozen_shift_name: shift.name
        };

        if (workLogs[dateStr]) {
          datesToInsert.push({
            ...basePayload,
            status: workLogs[dateStr].status,
            note: workLogs[dateStr].note || null,
            hours: workLogs[dateStr].hours || 0,
            custom_yevmiye: workLogs[dateStr].custom_yevmiye || null,
            worked_hours: workLogs[dateStr].worked_hours || null
          });
        } else {
          datesToInsert.push({
            ...basePayload,
            status: 'normal',
            note: shift.isOffDay ? 'SYSTEM_AUTO_OFF' : 'SYSTEM_AUTO_NORMAL',
            hours: 0,
            custom_yevmiye: null,
            worked_hours: null
          });
        }
      });

      if (datesToInsert.length > 0) {
        await saveWorkLogBatch(user.id, datesToInsert);
      }
    } else {
      if (!window.confirm('Kilitli ayı açmak üzeresiniz. Otomatik dondurulan boş günler silinecek ve tüm geçmiş günlerin vardiyaları güncel ayarlarınıza göre hesaplanacaktır. Onaylıyor musunuz?')) return;

      const logsToDelete = Object.values(workLogs).filter((log: any) =>
        log.log_date?.startsWith(currentMonthKey) &&
        (log.status === 'off_day' || log.status === 'unlogged_normal' || log.note === 'SYSTEM_AUTO_OFF' || log.note === 'SYSTEM_AUTO_NORMAL')
      );

      const logsToUpdate = Object.values(workLogs).filter((log: any) =>
        log.log_date?.startsWith(currentMonthKey) &&
        !(log.status === 'off_day' || log.status === 'unlogged_normal' || log.note === 'SYSTEM_AUTO_OFF' || log.note === 'SYSTEM_AUTO_NORMAL') &&
        log.frozen_shift_name
      );

      for (const log of logsToDelete) {
        if (log.log_date) {
          await deleteUserWorkLog(user.id, log.log_date);
        }
      }

      if (logsToUpdate.length > 0) {
        const updatePayload = logsToUpdate.map((log: any) => ({
          user_id: user.id,
          log_date: log.log_date,
          status: log.status,
          note: log.note || null,
          hours: log.hours || 0,
          custom_yevmiye: log.custom_yevmiye || null,
          worked_hours: log.worked_hours || null,
          frozen_shift_name: null
        }));
        await saveWorkLogBatch(user.id, updatePayload);
      }
    }

    const { error, data } = await toggleMonthFreeze(user.id, currentMonthKey, newFrozenStatus);
    if (!error && data) {
      setSettings(data);
      fetchLogs();
      addToast(newFrozenStatus ? 'Ay başarıyla donduruldu.' : 'Ay kilidi başarıyla açıldı.', 'success');
    } else {
      addToast('İşlem başarısız: ' + error?.message, 'error');
    }
  };

  const handleClearMonthLogs = async () => {
    if (!user) return;
    if (!hasAccessToFreeze) {
      setShowPaywall(true);
      return;
    }
    const confirmMessage = `${new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(baseDate)} dönemindeki tüm özel kayıtlarınız (mesai, izin, devamsızlık vb.) silinecek. Emin misiniz?`;
    if (!window.confirm(confirmMessage)) return;

    const firstDay = getLocalDateString(new Date(currentYear, currentMonth, 1));
    const lastDay = getLocalDateString(new Date(currentYear, currentMonth + 1, 0));

    const { error } = await clearMonthWorkLogs(user.id, firstDay, lastDay);

    if (!error) {
      addToast('Bu aya ait tüm kayıtlar başarıyla temizlendi.', 'success');
      fetchLogs();
    } else {
      addToast('Kayıtlar silinirken hata oluştu: ' + error?.message, 'error');
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

      <div className="w-full max-w-4xl px-2 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-medium text-base-content/80">
            Bordro dönemini kapatmak ve geçmişi vardiya değişimlerinden korumak için ayı dondurun.
          </h2>
          <span className="text-xs text-base-content/50">
            Günlere tıklayarak özel kayıt girebilirsiniz. Manuel girdiğiniz kayıtlar otomatik dondurulur.
          </span>
        </div>
        <button
          onClick={handleToggleMonthFreeze}
          className={`btn btn-sm shrink-0 shadow-lg flex items-center gap-1 ${isMonthFrozen ? 'bg-amber-900/20 text-amber-400 border-amber-500/50 hover:bg-amber-900/40' : 'bg-indigo-900/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-900/40'}`}
        >
          {isMonthFrozen ? '🔒 Ay Donduruldu (Kilidi Aç)' : '🧊 Bu Ayı Dondur (Bordroyu Kilitle)'}
          {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="ml-1 text-[10px] bg-amber-500 text-black px-1 rounded font-bold">PRO</span>}
        </button>
      </div>

      {isLoading ? (
        <div className="w-full max-w-4xl bg-[#16191d] rounded-xl shadow-2xl border border-base-300 overflow-hidden animate-pulse">
          <div className="grid grid-cols-7 bg-[#1e2329] border-b border-base-300">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="py-2 sm:py-3 text-center text-xs sm:text-sm font-bold text-base-content/70">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="min-h-[5rem] sm:min-h-[7rem] p-2 border-r border-b border-base-300 flex flex-col justify-between">
                <div className="h-4 sm:h-5 w-6 bg-base-content/10 rounded"></div>
                <div className="h-3 sm:h-4 w-12 bg-base-content/10 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="w-full max-w-4xl touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndEvent}
        >
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
        </div>
      )}

      <div className="w-full max-w-4xl mt-6 px-4 sm:px-0 flex justify-end">
        <button
          onClick={handleClearMonthLogs}
          className="btn btn-sm p-6 bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 shadow-sm transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Bu Ayın Tüm Kayıtlarını Temizle
          {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="text-[10px] bg-amber-500 text-black px-1 rounded font-bold">PRO</span>}
        </button>
      </div>

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

      {showPaywall && (
        <PremiumPaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          featureName="Bordro Dönemini Kilitleme"
        />
      )}
    </div>
  );
}
