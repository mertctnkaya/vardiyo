export interface YevmiyeStats {
  totalEarned: number;       // Aylık toplam kazanılan (₺)
  totalDaysWorked: number;   // Çalışılan gün sayısı
  weeklyEarning: number;     // Haftalık kazanç ortalaması
  biweeklyEarning: number;   // 15 günlük kazanç
  deductionsTL: number;      // Eksik saat kesintileri (₺)
  netMonthly: number;        // Kesinti sonrası aylık net
  avgDailyRate: number;      // Bu ayın ağırlıklı ortalama günlük yevmiyesi
  paymentPeriodEarning: number;  // Ödeme dönemi kazancı
  paymentPeriodStart: string;    // Ödeme dönemi başlangıç tarihi
  paymentPeriodEnd: string;      // Ödeme dönemi bitiş tarihi
  paymentPeriodDaysWorked: number; // Ödeme döneminde çalışılan gün
  fullMonthProjection: number;   // Tüm ay çalışılırsa kazanılacak tahmini tutar
  workableDaysInMonth: number;   // Ayda Pazar hariç çalışılabilir gün sayısı
}

export interface YevmiyePaymentSettings {
  payment_frequency: 'weekly' | 'biweekly' | 'daily';
  payment_day_of_week: number;
}

export interface YevmiyePayrollViewProps {
  settings: import('./user').UserSettings;
  fetchedLogs: import('./calendar').WorkLog[];
  payrollDate: Date;
}
