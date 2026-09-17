import type { WorkLog, UserSettings } from '../types';
import type { YevmiyeStats } from '../types/yevmiye';

/**
 * Bir günün yevmiye kazancını hesaplar.
 */
export const calculateDailyEarning = (
  log: WorkLog | undefined,
  date: Date,
  defaultYevmiye: number,
  baseHours: number
): number => {
  const isSunday = date.getDay() === 0;

  // Log yoksa
  if (!log) {
    if (isSunday) return 0; // Pazar log girilmediyse 0
    return defaultYevmiye; // Diğer günler için varsayılan
  }

  // Log varsa, özel yevmiye değeri varsa onu al
  const dayYevmiye = log.custom_yevmiye != null ? Number(log.custom_yevmiye) : defaultYevmiye;

  // Statüye göre hesaplama
  switch (log.status) {
    case 'normal':
    case 'holiday_work':
      // Normal veya resmi tatil mesaisi, tam ödeme (saat belirtilmişse bile normal mesaide kesinti yapılmaz, saat sadece ekstra bilgi olabilir, ama kesinti için geç/erken kullanılmalı. Ya da normal için de saat hesabı yapalım mı? Hayır, normal mesaida çalıştıysa tamdır. Geç kalma 'late' veya 'partial_leave' olarak işaretlenmeli)
      return dayYevmiye;
      
    case 'late':
    case 'partial_leave':
      // Kesinti var. worked_hours doluysa orantılı, boşsa yevmiye'den saatlik oran kesilebilir.
      // Modalda saat sorulacak. Girilen saat 'eksik saat' değil 'çalışılan saat' mi? Yoksa 'eksik saat' mi?
      // Kullanıcı talebine göre: "çalıştığı saati de yazmalı ... hesaplanıp günlük yevmiyenin çalışılan saate bölünüp ne kadar süre ise eksiltilmesi lazım."
      // Yani log.hours = eksik saat. log.worked_hours = çalışılan saat.
      // Eğer worked_hours varsa doğrudan ona göre.
      if (log.worked_hours != null) {
        return Math.max(0, dayYevmiye * (Number(log.worked_hours) / baseHours));
      } else if (log.hours != null) {
        // saat eksik saat (late/partial_leave)
        const eksikSaat = Number(log.hours);
        const calisilanSaat = Math.max(0, baseHours - eksikSaat);
        return dayYevmiye * (calisilanSaat / baseHours);
      }
      return dayYevmiye; // saat bilgisi yoksa tam say

    case 'absent':
    case 'annual_leave':
    case 'leave':
      // Yevmiyecide bu durumlarda ödeme yapılmaz
      return 0;

    case 'overtime':
      // Fazla mesai yevmiyede normal mesaiyle aynı mıdır? Özel yevmiye girilmiş olabilir.
      // Eğer fazla mesai seçildiyse + olarak mı yansıyacak? Modal'da 'Fazla mesai' seçeneğini gizlemiştik! 
      // Sadece 'normal', 'late', 'partial_leave', 'holiday_work' açık.
      return dayYevmiye;

    default:
      return dayYevmiye;
  }
};

/**
 * Aylık yevmiye istatistiklerini hesaplar.
 */
export const calculateMonthlyYevmiyeStats = (
  logsMap: Record<string, WorkLog>,
  settings: UserSettings,
  year: number,
  month: number
): YevmiyeStats => {
  const defaultYevmiye = Number(settings.daily_yevmiye) || 0;
  const baseHours = Number(settings.yevmiye_base_hours) || 12;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let totalEarned = 0;
  let totalDaysWorked = 0;
  let deductionsTL = 0;
  let workableDaysInMonth = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const log = logsMap[dateStr];
    
    const isSunday = date.getDay() === 0;

    // Pazar hariç çalışılabilir günleri say
    if (!isSunday) workableDaysInMonth++;
    
    const dayYevmiye = (log?.custom_yevmiye != null) ? Number(log.custom_yevmiye) : defaultYevmiye;
    
    // Potansiyel tam kazanç (Pazar log yoksa 0)
    let potentialEarning = 0;
    if (log) {
       if (['normal', 'late', 'partial_leave', 'holiday_work'].includes(log.status)) {
           potentialEarning = dayYevmiye;
       }
    } else {
       if (!isSunday) potentialEarning = dayYevmiye;
    }

    const actualEarning = calculateDailyEarning(log, date, defaultYevmiye, baseHours);

    if (actualEarning > 0) {
      totalEarned += actualEarning;
      totalDaysWorked += 1;
      
      // Kesinti: Potansiyel kazanç - gerçekleşen
      if (potentialEarning > actualEarning) {
        deductionsTL += (potentialEarning - actualEarning);
      }
    } else {
      // Eğer log yok, Pazar değilse ama absent girilmişse kesinti olarak yansıtılabilir, 
      // ancak yevmiyede direkt kazanç 0 olur, özel bir "ceza" kesintisi genellikle yoktur.
    }
  }

  const netMonthly = totalEarned;
  const avgDailyRate = totalDaysWorked > 0 ? (totalEarned / totalDaysWorked) : 0;
  
  // Basit ortalama
  const weeklyEarning = (netMonthly / daysInMonth) * 7;
  const biweeklyEarning = (netMonthly / daysInMonth) * 14;

  // Tam ay projeksiyonu: Tüm çalışılabilir günler (Pazar hariç) * varsayılan yevmiye
  const fullMonthProjection = workableDaysInMonth * defaultYevmiye;

  // Ödeme dönemi hesaplaması
  const frequency = (settings.payment_frequency as 'weekly' | 'biweekly' | 'daily') || 'weekly';
  const dayOfWeek = Number(settings.payment_day_of_week) || 3;
  const { periodStart, periodEnd, periodEarning, periodDaysWorked } = calculatePaymentPeriodEarning(
    logsMap, frequency, dayOfWeek, defaultYevmiye, baseHours /* year, month */
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
 * Kullanıcının ödeme sıklığına göre (haftalık/15 günlük/günlük) son ödeme günü ile 
 * bir sonraki ödeme günü arasındaki fiili kazancı hesaplar.
 */
const calculatePaymentPeriodEarning = (
  logsMap: Record<string, WorkLog>,
  frequency: 'weekly' | 'biweekly' | 'daily',
  dayOfWeek: number,
  defaultYevmiye: number,
  baseHours: number
  /* year: number,
  month: number */
): { periodStart: string; periodEnd: string; periodEarning: number; periodDaysWorked: number } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (frequency === 'daily') {
    // Günlük ödeme: bugünkü kazancı göster
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const log = logsMap[dateStr];
    const earning = calculateDailyEarning(log, today, defaultYevmiye, baseHours);
    const todayStr = formatDateTR(today);
    return { periodStart: todayStr, periodEnd: todayStr, periodEarning: earning, periodDaysWorked: earning > 0 ? 1 : 0 };
  }

  // Haftalık veya 15 günlük: Son ödeme gününü bul, oradan şu anki dönemi hesapla
  const periodDays = frequency === 'weekly' ? 7 : 14;

  // Son ödeme gününü bul (bugünden geriye bakarak)
  const lastPayDay = new Date(today);
  let diff = (today.getDay() - dayOfWeek + 7) % 7;
  if (diff === 0 && today.getDay() === dayOfWeek) {
    // Bugün ödeme günü, ama bu dönem bugünle biter
    diff = 0;
  }
  lastPayDay.setDate(today.getDate() - diff);

  // Dönem başlangıcı: son ödeme gününden 'periodDays' gün öncesi + 1 gün
  const periodStart = new Date(lastPayDay);
  periodStart.setDate(lastPayDay.getDate() - periodDays + 1);
  
  // Dönem bitişi: son ödeme günü
  const periodEnd = new Date(lastPayDay);

  // Eğer bugün ödeme günü ise bu dönem bugüne kadar hesapla
  // Eğer dönem ortasındaysak, dönem başından bugüne kadar hesapla
  const effectiveEnd = today < periodEnd ? today : periodEnd;

  let periodEarning = 0;
  let periodDaysWorked = 0;

  const cursor = new Date(periodStart);
  while (cursor <= effectiveEnd) {
    const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    const log = logsMap[dateStr];
    const earning = calculateDailyEarning(log, cursor, defaultYevmiye, baseHours);
    if (earning > 0) {
      periodEarning += earning;
      periodDaysWorked++;
    }
    cursor.setDate(cursor.getDate() + 1);
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
  dayOfWeek: number, // 0=Sunday(kullanılmıyor genelde), 1=Monday... 6=Saturday
  from: Date = new Date()
): Date => {
  const next = new Date(from);
  next.setHours(0, 0, 0, 0);

  if (frequency === 'daily') {
    // Sonraki iş günü (Pazar atlanır)
    next.setDate(next.getDate() + 1);
    if (next.getDay() === 0) next.setDate(next.getDate() + 1);
    return next;
  }

  if (frequency === 'weekly' || frequency === 'biweekly') {
    let daysToAdd = (dayOfWeek - next.getDay() + 7) % 7;
    if (daysToAdd === 0) {
      daysToAdd = frequency === 'weekly' ? 7 : 14;
    } else if (frequency === 'biweekly') {
      // Basit yaklaşım: Günü bul, üzerine 1 hafta daha ekle
      // (Gerçek hayatta son ödeme tarihinden 14 gün sonrası olur ama burada statik hesaplıyoruz)
      daysToAdd += 7; 
    }
    next.setDate(next.getDate() + daysToAdd);
    return next;
  }

  return next;
};

