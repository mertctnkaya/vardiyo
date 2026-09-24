import type { WorkLog, UserSettings } from '../types';
import type { YevmiyeStats } from '../types/yevmiye';

/**
 * Settings'den rest_days array'ini parse eder.
 * Varsayılan: [0] (yalnızca Pazar)
 */
const parseRestDays = (settings: UserSettings): number[] => {
  if (Array.isArray(settings.rest_days) && settings.rest_days.length > 0) {
    return settings.rest_days.map(Number);
  }
  return [0];
};

/**
 * Bir günün yevmiye kazancını hesaplar.
 * Log yoksa kazanç 0'dır — sadece takvime girilen günler hesaba katılır.
 */
export const calculateDailyEarning = (
  log: WorkLog | undefined,
  _date: Date,
  defaultYevmiye: number,
  baseHours: number,
  _restDays: number[] = [0]
): number => {
  // Log yoksa: giriş yapılmamış gün → 0
  if (!log) {
    return 0;
  }

  const dayYevmiye = log.custom_yevmiye != null ? Number(log.custom_yevmiye) : defaultYevmiye;

  switch (log.status) {
    case 'normal':
    case 'holiday_work':
      return dayYevmiye;

    case 'late':
    case 'partial_leave':
      if (log.worked_hours != null) {
        return Math.max(0, dayYevmiye * (Number(log.worked_hours) / baseHours));
      } else if (log.hours != null) {
        const eksikSaat = Number(log.hours);
        const calisilanSaat = Math.max(0, baseHours - eksikSaat);
        return dayYevmiye * (calisilanSaat / baseHours);
      }
      return dayYevmiye;

    case 'absent':
    case 'annual_leave':
    case 'leave':
      return 0;

    case 'overtime':
      return dayYevmiye;

    default:
      return dayYevmiye;
  }
};

/**
 * Aylık yevmiye istatistiklerini hesaplar.
 * Yalnızca takvime giriş yapılan günler fiili kazanca yansır.
 * Projeksiyon (tam ay çalışılırsa) ayrı hesaplanır.
 */
export const calculateMonthlyYevmiyeStats = (
  logsMap: Record<string, WorkLog>,
  settings: UserSettings,
  year: number,
  month: number
): YevmiyeStats => {
  const defaultYevmiye = Number(settings.daily_yevmiye) || 0;
  const baseHours = Number(settings.yevmiye_base_hours) || 12;
  const restDays = parseRestDays(settings);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let totalEarned = 0;
  let totalDaysWorked = 0;
  let deductionsTL = 0;
  let workableDaysInMonth = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const log = logsMap[dateStr];

    const isRestDay = restDays.includes(date.getDay());

    // Tatil günleri hariç çalışılabilir günleri say
    if (!isRestDay) workableDaysInMonth++;

    const dayYevmiye = (log?.custom_yevmiye != null) ? Number(log.custom_yevmiye) : defaultYevmiye;

    // Potansiyel tam kazanç (log varsa ve çalışma statüsündeyse)
    let potentialEarning = 0;
    if (log) {
      if (['normal', 'late', 'partial_leave', 'holiday_work', 'overtime'].includes(log.status)) {
        potentialEarning = dayYevmiye;
      }
    }

    const actualEarning = calculateDailyEarning(log, date, defaultYevmiye, baseHours, restDays);

    if (actualEarning > 0) {
      totalEarned += actualEarning;
      totalDaysWorked += 1;

      if (potentialEarning > actualEarning) {
        deductionsTL += (potentialEarning - actualEarning);
      }
    }
  }

  const netMonthly = totalEarned;
  const avgDailyRate = totalDaysWorked > 0 ? (totalEarned / totalDaysWorked) : defaultYevmiye;

  // Haftalık ve 15 günlük TAHMİNİ projeksiyonlar (tatil günleri hariç)
  const workableDaysPerWeek = 7 - restDays.length;
  const weeklyEarning = workableDaysPerWeek * defaultYevmiye;
  const biweeklyEarning = workableDaysPerWeek * 2 * defaultYevmiye;

  // Tam ay projeksiyonu: Tüm çalışılabilir günler × varsayılan yevmiye
  const fullMonthProjection = workableDaysInMonth * defaultYevmiye;

  // Ödeme dönemi hesaplaması
  const frequency = (settings.payment_frequency as 'weekly' | 'biweekly' | 'daily') || 'weekly';
  const dayOfWeek = Number(settings.payment_day_of_week) || 3;
  const { periodStart, periodEnd, periodEarning, periodDaysWorked } = calculatePaymentPeriodEarning(
    logsMap, frequency, dayOfWeek, defaultYevmiye, baseHours, restDays
  );

  return {
    totalEarned,
    totalDaysWorked,
    weeklyEarning,
    biweeklyEarning,
    deductionsTL,
    netMonthly,
    avgDailyRate,
    paymentPeriodEarning: periodEarning,
    paymentPeriodStart: periodStart,
    paymentPeriodEnd: periodEnd,
    paymentPeriodDaysWorked: periodDaysWorked,
    fullMonthProjection,
    workableDaysInMonth
  };
};

/**
 * Ödeme dönemi kazancını hesaplar.
 * Yalnızca takvime giriş yapılan günlerin kazancını toplar.
 */
const calculatePaymentPeriodEarning = (
  logsMap: Record<string, WorkLog>,
  frequency: 'weekly' | 'biweekly' | 'daily',
  dayOfWeek: number,
  defaultYevmiye: number,
  baseHours: number,
  restDays: number[]
): { periodStart: string; periodEnd: string; periodEarning: number; periodDaysWorked: number } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (frequency === 'daily') {
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const log = logsMap[dateStr];
    const earning = calculateDailyEarning(log, today, defaultYevmiye, baseHours, restDays);
    const todayStr = formatDateTR(today);
    return { periodStart: todayStr, periodEnd: todayStr, periodEarning: earning, periodDaysWorked: earning > 0 ? 1 : 0 };
  }

  const periodDays = frequency === 'weekly' ? 7 : 14;

  const lastPayDay = new Date(today);
  let diff = (today.getDay() - dayOfWeek + 7) % 7;
  if (diff === 0 && today.getDay() === dayOfWeek) {
    diff = 0;
  }
  lastPayDay.setDate(today.getDate() - diff);

  const periodStart = new Date(lastPayDay);
  periodStart.setDate(lastPayDay.getDate() - periodDays + 1);

  const periodEnd = new Date(lastPayDay);
  const effectiveEnd = today < periodEnd ? today : periodEnd;

  let periodEarning = 0;
  let periodDaysWorked = 0;

  const cursor = new Date(periodStart);
  while (cursor <= effectiveEnd) {
    const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    const log = logsMap[dateStr];
    const earning = calculateDailyEarning(log, cursor, defaultYevmiye, baseHours, restDays);
    if (earning > 0) {
      periodEarning += earning;
      periodDaysWorked++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  // Dönemdeki çalışılabilir gün sayısını hesapla (projeksiyon için)
  let workableDaysInPeriod = 0;
  const counter = new Date(periodStart);
  while (counter <= periodEnd) {
    if (!restDays.includes(counter.getDay())) {
      workableDaysInPeriod++;
    }
    counter.setDate(counter.getDate() + 1);
  }

  return {
    periodStart: formatDateTR(periodStart),
    periodEnd: formatDateTR(periodEnd),
    periodEarning,
    periodDaysWorked
  };
};

/** Tarih formatlama yardımcısı: "17 Eyl" gibi kısa Türkçe format */
const formatDateTR = (date: Date): string => {
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

/**
 * Sonraki ödeme tarihini hesaplar
 */
export const getNextPaymentDate = (
  frequency: 'weekly' | 'biweekly' | 'daily',
  dayOfWeek: number,
  from: Date = new Date()
): Date => {
  const next = new Date(from);
  next.setHours(0, 0, 0, 0);

  if (frequency === 'daily') {
    next.setDate(next.getDate() + 1);
    if (next.getDay() === 0) next.setDate(next.getDate() + 1);
    return next;
  }

  if (frequency === 'weekly' || frequency === 'biweekly') {
    let daysToAdd = (dayOfWeek - next.getDay() + 7) % 7;
    if (daysToAdd === 0) {
      daysToAdd = frequency === 'weekly' ? 7 : 14;
    } else if (frequency === 'biweekly') {
      daysToAdd += 7;
    }
    next.setDate(next.getDate() + daysToAdd);
    return next;
  }

  return next;
};
