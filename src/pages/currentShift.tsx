import { useOutletContext } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchUserReminders, toggleUserReminder, deleteUserReminder } from "../services/dbService";
import { useNavigate } from "react-router-dom";
import { isNative } from "../utils/isNative";
import { LocalNotifications } from "@capacitor/local-notifications"; // NATIVE API
import type { Reminder } from '../types';

import DateSelectorCard from '../components/current-shift/DateSelectorCard';
import ShiftDisplayCard from '../components/current-shift/ShiftDisplayCard';
import WelcomeBanner from '../components/current-shift/WelcomeBanner';
import NotificationPromo from '../components/current-shift/NotificationPromo';
import RemindersList from '../components/current-shift/RemindersList';
import ReminderModal from '../components/current-shift/ReminderModal';
import GuestPromoCard from '../components/current-shift/GuestPromoCard';

import { usePageTitle } from '../hooks/usePageTitle';

import type { ShiftContextType } from '../types';
export default function CurrentShift() {
  usePageTitle('Güncel Vardiya');
  const { targetDate, setTargetDate, currentShift } = useOutletContext<ShiftContextType>();
  const { user, settings } = useAppStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showNotificationPromo, setShowNotificationPromo] = useState(false);

  const [isCalendarPaused, setIsCalendarPaused] = useState(false);
  const [pausedDates, setPausedDates] = useState<{ start: string; end: string | null } | null>(null);

  const formattedDateValue = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    const checkInitialNotifStatus = async () => {
      const isDismissed = localStorage.getItem('hideNotificationPromo');
      if (isDismissed === 'true') return;

      if (isNative()) {
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display === 'prompt') {
          setShowNotificationPromo(true);
        }
      } else {
        if ('Notification' in window && Notification.permission === 'default') {
          setShowNotificationPromo(true);
        }
      }
    };
    checkInitialNotifStatus();

    const isHiddenWelcome = localStorage.getItem('hideWelcomeInfo');
    if (isHiddenWelcome !== 'true') {
      setShowWelcome(true);
    }
  }, []);

  const fetchReminders = useCallback(async () => {
    if (!user) return;
    const data = await fetchUserReminders(user.id);
    if (data) setReminders(data);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchPauseConfig = async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('is_paused, pause_start_date, pause_end_date')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setIsCalendarPaused(data.is_paused || false);
        if (data.is_paused && data.pause_start_date) {
          setPausedDates({ start: data.pause_start_date, end: data.pause_end_date });
        }
      }
    };
    fetchPauseConfig();
    fetchReminders();

    Promise.all([fetchPauseConfig(), fetchReminders()]).then(() => {
      setIsLoading(false);
    });
  }, [user, fetchReminders]);

  const isDatePaused = useMemo(() => {
    if (!isCalendarPaused || !pausedDates?.start) return false;

    if (pausedDates.end) {
      return formattedDateValue >= pausedDates.start && formattedDateValue <= pausedDates.end;
    }
    return formattedDateValue >= pausedDates.start;
  }, [isCalendarPaused, pausedDates, formattedDateValue]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setTargetDate(new Date(e.target.value));
  };

  const shiftDate = (days: number) => {
    const newDate = new Date(targetDate);
    newDate.setDate(newDate.getDate() + days);
    setTargetDate(newDate);
  };

  const calculateEndTime = (startTime: string, hoursToAdd: number) => {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = (h * 60) + m + (hoursToAdd * 60);
    const newH = Math.floor(totalMinutes / 60) % 24;
    const newM = Math.round(totalMinutes % 60);
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  const getShiftHours = () => {
    if (!settings || currentShift.id === -1) return null;
    const start = settings.shift_start_time || '08:00';
    const type = settings.work_type || '3-shift';
    let duration = 8, offset = 0;

    if (type === 'fixed') return `${start} - ${settings.shift_end_time || '18:00'}`;
    if (type === 'yevmiye') return `${settings.yevmiye_base_hours || 12} Saatlik Mesai (Yevmiye)`;
    if (type === '2-shift') {
      duration = Number(settings.shift_duration) || 12;
      if (currentShift.id === 1) offset = duration;
    } else {
      duration = 8;
      if (currentShift.id === 2) offset = 8;
      if (currentShift.id === 1) offset = 16;
    }
    const shiftStart = calculateEndTime(start, offset);
    const shiftEnd = calculateEndTime(shiftStart, duration);
    return `${shiftStart} - ${shiftEnd}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fade-in w-full pb-10">
      <DateSelectorCard
        targetDate={targetDate}
        formattedDateValue={formattedDateValue}
        onDateChange={handleDateChange}
        onShiftDate={shiftDate}
        onSetToday={() => setTargetDate(new Date())}
      />

      <ShiftDisplayCard
        currentShift={currentShift}
        shiftHours={getShiftHours()}
        isDatePaused={isDatePaused}
        isLoading={isLoading}
      />

      <WelcomeBanner
        showWelcome={showWelcome}
        onClose={() => { localStorage.setItem('hideWelcomeInfo', 'true'); setShowWelcome(false); }}
      />

      <NotificationPromo
        showPromo={showNotificationPromo}
        onRequest={() => navigate('/settings')}
        onDismiss={() => { localStorage.setItem('hideNotificationPromo', 'true'); setShowNotificationPromo(false); }}
      />

      <RemindersList
        reminders={reminders}
        onToggle={async (id, status) => { if (user) { await toggleUserReminder(user.id, id, status); fetchReminders(); } }}
        onDelete={async (id) => { if (user) { await deleteUserReminder(user.id, id); fetchReminders(); } }}
        onOpenModal={() => setShowReminderModal(true)}
      />

      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        defaultDate={formattedDateValue}
        user={user}
        onSuccess={() => { setShowReminderModal(false); fetchReminders(); }}
      />

      <GuestPromoCard user={user} />
    </div>
  );
}