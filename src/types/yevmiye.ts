export interface YevmiyeStats {
  totalEarned: number;       // Takvime giriş yapılan günlerden kazanılan toplam (₺)
  totalDaysWorked: number;   // Takvime giriş yapılan gün sayısı
  weeklyEarning: number;     // Haftalık tahmini kazanç (projeksiyon)
  biweeklyEarning: number;   // 15 günlük tahmini kazanç (projeksiyon)
  deductionsTL: number;      // Eksik saat kesintileri (₺)
  netMonthly: number;        // Takvimden kazanılan toplam net
  avgDailyRate: number;      // Ortalama günlük yevmiye
  paymentPeriodEarning: number;  // Ödeme dönemi kazancı (sadece girişli günler)
  paymentPeriodStart: string;    // Ödeme dönemi başlangıç tarihi
  paymentPeriodEnd: string;      // Ödeme dönemi bitiş tarihi
  paymentPeriodDaysWorked: number; // Ödeme döneminde giriş yapılan gün
  fullMonthProjection: number;   // Tüm iş günleri çalışılırsa tahmini kazanç
  workableDaysInMonth: number;   // Ayda tatil hariç çalışılabilir iş günü sayısı
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
