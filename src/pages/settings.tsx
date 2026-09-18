import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { fetchUserSettings, updateUserSettings } from '../services/dbService';
import { registerAndSubscribeToPush } from '../lib/pushNotifications';
import { LocalNotifications } from '@capacitor/local-notifications'; // NATIVE API
import { isNative } from "../utils/isNative";

import Alert from '../components/shared/Alert';
import SettingsHeader from '../components/settings/SettingsHeader';
import ShiftSystemSection from '../components/settings/ShiftSystemSection';
import DateReferencesSection from '../components/settings/DateReferencesSection';
import PayrollSection from '../components/settings/PayrollSection';
import YevmiyeSection from '../components/settings/YevmiyeSection';
import NotificationSection from '../components/settings/NotificationSection';
import AccountSection from '../components/settings/AccountSection';
import { usePageTitle } from '../hooks/usePageTitle';
import { triggerHaptic } from '../utils/haptics';

export default function Settings() {
  usePageTitle('Ayarlar');
  const { user, setSettings } = useAppStore();
  const [_showAuthModal, setShowAuthModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [workType, setWorkType] = useState('3-shift');
  const [shiftPattern, setShiftPattern] = useState<number[]>([]);
  const [restDays, setRestDays] = useState<number[]>([0]);
  const [isSaturdayWorkday, setIsSaturdayWorkday] = useState(false);
  const [employmentStartDate, setEmploymentStartDate] = useState('2026-06-09');
  const [shiftEpochDate, setShiftEpochDate] = useState('2026-07-06');

  const [shiftStartTime, setShiftStartTime] = useState('08:00');
  const [shiftEndTime, setShiftEndTime] = useState('16:00');
  const [shiftDuration, setShiftDuration] = useState('12');

  const [monthlyGross, setMonthlyGross] = useState('0');
  const [baseWorkHours, setBaseWorkHours] = useState('7.5');
  const [nightBonus, setNightBonus] = useState('10');

  const [saturdayMultiplier, setSaturdayMultiplier] = useState('1.5');
  const [weekendMultiplier, setWeekendMultiplier] = useState('2');
  const [holidayMultiplier, _setHolidayMultiplier] = useState('2');

  const [dailyYevmiye, setDailyYevmiye] = useState('0');
  const [yevmiyeBaseHours, setYevmiyeBaseHours] = useState('12');
  const [paymentFrequency, setPaymentFrequency] = useState('weekly');
  const [paymentDayOfWeek, setPaymentDayOfWeek] = useState('3');

  const [notificationStatus, setNotificationStatus] = useState<string>('default');

  const [notifPrefs, setNotifPrefs] = useState({
    shift_changes: true, holidays: true, reminders: true, payroll: true,
    risks: true, annual_leave: true, daily_log: false, weekly_summary: false,
    night_shift_health: false, app_updates: false
  });

  const handleRequestPermission = async () => {
    if (!user) {
      alert("Bildirim izni verebilmek için lütfen önce giriş yapın!");
      return;
    }

    try {
      if (isNative()) {
        let permStatus = await LocalNotifications.requestPermissions();
        const finalStatus = permStatus.display === 'prompt' ? 'default' : permStatus.display;
        setNotificationStatus(finalStatus);
        if (finalStatus === 'granted') {
          alert('Mobil bildirim izni başarıyla alındı!');
        }
      } else {
        const newStatus = await registerAndSubscribeToPush(user.id);
        if (newStatus) setNotificationStatus(newStatus);
      }
    } catch (error) {
      alert("İzin istenirken sistem hatası oluştu: " + String(error));
    }
  };

  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (isNative()) {
        const permStatus = await LocalNotifications.checkPermissions();
        setNotificationStatus(permStatus.display === 'prompt' ? 'default' : permStatus.display);
      } else {
        if ('Notification' in window) {
          setNotificationStatus(Notification.permission);
        } else {
          setNotificationStatus('denied');
        }
      }
    };
    checkNotificationStatus();
  }, []);

  useEffect(() => {
    async function loadSettings() {
      if (!user) return;
      setIsLoading(true);
      const data = await fetchUserSettings(user.id);

      if (data) {
        setWorkType(data.work_type || '3-shift');
        if (data.shift_pattern) setShiftPattern(data.shift_pattern);
        if (data.rest_days) setRestDays(data.rest_days);
        setIsSaturdayWorkday(data.is_saturday_workday || false);
        if (data.employment_start_date) setEmploymentStartDate(data.employment_start_date);
        if (data.shift_epoch_date) setShiftEpochDate(data.shift_epoch_date);
        if (data.shift_start_time) setShiftStartTime(data.shift_start_time);
        if (data.shift_end_time) setShiftEndTime(data.shift_end_time);
        if (data.shift_duration) setShiftDuration(data.shift_duration.toString());
        if (data.base_work_hours) setBaseWorkHours(data.base_work_hours.toString());
        if (data.night_bonus_percent) setNightBonus(data.night_bonus_percent.toString());
        if (data.saturday_multiplier) setSaturdayMultiplier(data.saturday_multiplier.toString());
        if (data.weekend_multiplier) setWeekendMultiplier(data.weekend_multiplier.toString());
        if (data.daily_wage) setMonthlyGross((data.daily_wage * 30).toFixed(2).replace(/\.00$/, ''));
        if (data.daily_yevmiye) setDailyYevmiye(data.daily_yevmiye.toString());
        if (data.yevmiye_base_hours) setYevmiyeBaseHours(data.yevmiye_base_hours.toString());
        if (data.payment_frequency) setPaymentFrequency(data.payment_frequency);
        if (data.payment_day_of_week) setPaymentDayOfWeek(data.payment_day_of_week.toString());
        if (data.notification_preferences) {
          setNotifPrefs(data.notification_preferences);
        }
      }
      setIsLoading(false);
    }
    loadSettings();
  }, [user]);

  const grossNum = Number(monthlyGross) || 0;
  const hoursNum = Number(baseWorkHours) || 7.5;
  const normalHourly = (grossNum / 30) / hoursNum;
  const overtimeHourly = normalHourly * 1.5;
  const displayOvertime = overtimeHourly > 0 ? overtimeHourly.toFixed(2) : '0.00';

  const calculateEndTime = (startTime: string, hoursToAdd: number) => {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = (h * 60) + m + (hoursToAdd * 60);
    const newH = Math.floor(totalMinutes / 60) % 24;
    const newM = Math.round(totalMinutes % 60);
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  const handleTogglePref = async (key: keyof typeof notifPrefs) => {
    if (!user) return;

    const newPrefs = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(newPrefs);

    await updateUserSettings(user.id, { notification_preferences: newPrefs });
  };

  const handleSaveSettings = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setFeedback(null);

    if (monthlyGross === '' || Number(monthlyGross) <= 0 || baseWorkHours === '') {
      triggerHaptic('error');
      setFeedback({ type: 'error', message: 'Lütfen geçerli bir aylık brüt maaş ve çalışma süresi girin.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    triggerHaptic('medium');
    setIsSaving(true);

    const calculatedDaily = grossNum / 30;
    const finalEndTime = (workType === 'fixed' || workType === 'yevmiye')
      ? shiftEndTime
      : calculateEndTime(shiftStartTime, Number(shiftDuration) || 8);

    const payload = {
      work_type: workType,
      shift_pattern: shiftPattern,
      rest_days: restDays,
      is_saturday_workday: isSaturdayWorkday,
      employment_start_date: employmentStartDate,
      shift_epoch_date: shiftEpochDate,
      shift_start_time: shiftStartTime,
      shift_end_time: finalEndTime,
      shift_duration: Number(shiftDuration) || 8,
      base_work_hours: Number(baseWorkHours) || 7.5,
      daily_wage: calculatedDaily,
      hourly_overtime: Number(displayOvertime),
      night_bonus_percent: Number(nightBonus) || 0,
      saturday_multiplier: Number(saturdayMultiplier) || 1.5,
      weekend_multiplier: Number(weekendMultiplier) || 2,
      holiday_multiplier: Number(holidayMultiplier) || 2,
      daily_yevmiye: Number(dailyYevmiye) || 0,
      yevmiye_base_hours: Number(yevmiyeBaseHours) || 12,
      payment_frequency: paymentFrequency,
      payment_day_of_week: Number(paymentDayOfWeek) || 3,
      updated_at: new Date().toISOString()
    };

    const { error, data } = await updateUserSettings(user.id, payload);

    if (error) {
      triggerHaptic('error');
      setFeedback({ type: 'error', message: 'Hata: ' + error.message });
    } else {
      triggerHaptic('success');
      const msg = typeof navigator !== 'undefined' && !navigator.onLine
        ? 'Ayarlarınız cihaza kaydedildi. İnternet bağlantısı sağlandığında sunucuya aktarılacaktır.'
        : 'Ayarlarınız başarıyla kaydedildi.';
      setFeedback({ type: 'success', message: msg });
      if (data) setSettings(data);
      setShiftEndTime(finalEndTime);
      setTimeout(() => setFeedback(null), 3500);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10">
      <div className="w-full max-w-3xl bg-[#16191d] rounded-xl shadow-2xl border border-base-300 overflow-hidden relative">

        {isLoading && (
          <div className="absolute inset-0 bg-base-100/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          </div>
        )}

        <SettingsHeader user={user} />

        <div className="p-6 sm:p-8 space-y-8 pt-0">
          {feedback?.type === 'success' && <Alert color="emerald" icon="check" title="İşlem Başarılı">{feedback.message}</Alert>}
          {feedback?.type === 'error' && <Alert color="red" icon="warning" title="Kayıt Hatası">{feedback.message}</Alert>}

          <ShiftSystemSection
            workType={workType} setWorkType={setWorkType}
            shiftStartTime={shiftStartTime} setShiftStartTime={setShiftStartTime}
            shiftEndTime={shiftEndTime} setShiftEndTime={setShiftEndTime}
            shiftDuration={shiftDuration} setShiftDuration={setShiftDuration}
            setShiftPattern={setShiftPattern}
            restDays={restDays} setRestDays={setRestDays}
          />

          <DateReferencesSection
            workType={workType}
            employmentStartDate={employmentStartDate} setEmploymentStartDate={setEmploymentStartDate}
            shiftEpochDate={shiftEpochDate} setShiftEpochDate={setShiftEpochDate}
          />

          {workType === 'yevmiye' ? (
            <YevmiyeSection
              dailyYevmiye={dailyYevmiye} setDailyYevmiye={setDailyYevmiye}
              paymentFrequency={paymentFrequency} setPaymentFrequency={setPaymentFrequency}
              paymentDayOfWeek={paymentDayOfWeek} setPaymentDayOfWeek={setPaymentDayOfWeek}
            />
          ) : (
            <PayrollSection
              workType={workType}
              monthlyGross={monthlyGross} setMonthlyGross={setMonthlyGross}
              displayOvertime={displayOvertime}
              baseWorkHours={baseWorkHours} setBaseWorkHours={setBaseWorkHours}
              nightBonus={nightBonus} setNightBonus={setNightBonus}
            />
          )}

          <div className="sticky bottom-4 z-40 mt-8 flex justify-end pt-4 pb-2 sm:pt-6 sm:pb-0 border-t border-base-300 bg-[#16191d]/80 backdrop-blur-xl sm:bg-transparent sm:backdrop-blur-none rounded-2xl sm:rounded-none px-4 sm:px-0 -mx-4 sm:mx-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.5)] sm:shadow-none">
            <button onClick={handleSaveSettings} disabled={isSaving || isLoading} className="btn w-full sm:btn-wide bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/50 h-14 sm:h-12 text-lg sm:text-base">
              {isSaving ? <span className="loading loading-spinner"></span> : 'Ayarları Kaydet'}
            </button>
          </div>

          <NotificationSection
            notificationStatus={notificationStatus}
            onRequestPermission={handleRequestPermission}
            prefs={notifPrefs}
            onToggle={handleTogglePref}
          />

          <AccountSection />
        </div>
      </div>
    </div>
  );
}
