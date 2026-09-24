import { useState, useEffect } from 'react';
import StatCard from '../shared/StatCard';
import Alert from '../shared/Alert';
import Icon from '../shared/Icon';
import { calculateMonthlyYevmiyeStats, getNextPaymentDate } from '../../core/yevmiyeEngine';
import type { YevmiyePayrollViewProps, WorkLog } from '../../types';

export default function YevmiyePayrollView({ settings, fetchedLogs, payrollDate }: YevmiyePayrollViewProps) {
  const [stats, setStats] = useState(() => calculateMonthlyYevmiyeStats({}, settings, payrollDate.getFullYear(), payrollDate.getMonth()));

  useEffect(() => {
    const logsMap: Record<string, WorkLog> = {};
    fetchedLogs.forEach(log => {
      if (log.log_date) {
        logsMap[log.log_date] = log;
      }
    });
    setStats(calculateMonthlyYevmiyeStats(logsMap, settings, payrollDate.getFullYear(), payrollDate.getMonth()));

    if (fetchedLogs.length > 0) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('trigger-inapp-review'));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [settings, fetchedLogs, payrollDate]);

  const frequency = settings.payment_frequency as 'weekly' | 'biweekly' | 'daily' || 'weekly';
  const dayOfWeek = settings.payment_day_of_week || 3;

  const nextPayment = getNextPaymentDate(frequency, dayOfWeek);
  const nextPaymentStr = nextPayment.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  let frequencyLabel = 'Haftalık';
  if (frequency === 'biweekly') frequencyLabel = '15 Günlük';
  else if (frequency === 'daily') frequencyLabel = 'Günlük';

  // Tatil günleri etiketini oluştur
  const restDays: number[] = Array.isArray(settings.rest_days) && settings.rest_days.length > 0
    ? settings.rest_days.map(Number)
    : [0];
  const dayNames: Record<number, string> = { 0: 'Pazar', 1: 'Pazartesi', 2: 'Salı', 3: 'Çarşamba', 4: 'Perşembe', 5: 'Cuma', 6: 'Cumartesi' };
  const restDayNames = restDays.map(d => dayNames[d] || '').filter(Boolean).join(' ve ');

  const fmtMoney = (n: number) => `₺${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <Alert color="amber" icon="info" borderStyle="colored" bgStyle="colored">
        Hesaplamalar yalnızca takvime girdiğiniz günleri baz alır. Giriş yapılmayan günler için kazanç hesaplanmaz.
        Tatil günleriniz ({restDayNames}) otomatik olarak hesap dışı bırakılır.
      </Alert>

      {/* ÜST BÖLÜM: Ödeme dönemi kazancı ve tam ay projeksiyonu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ödeme Dönemi Kazancı */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-[#16191d] rounded-2xl border border-emerald-500/20 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="wallet" className="w-4 h-4 text-emerald-400/70" />
              <p className="text-xs font-bold text-emerald-400/70 uppercase tracking-wider">Ödeme Dönemi Kazancı</p>
            </div>
            <p className="text-xs text-base-content/50 mb-3">
              {stats.paymentPeriodStart} — {stats.paymentPeriodEnd} ({frequencyLabel})
            </p>
            <p className="text-4xl font-black text-emerald-400">{fmtMoney(stats.paymentPeriodEarning)}</p>
            <p className="text-xs text-base-content/50 mt-2">{stats.paymentPeriodDaysWorked} gün giriş yapıldı</p>
          </div>
        </div>

        {/* Tam Ay Projeksiyonu */}
        <div className="bg-gradient-to-br from-indigo-900/20 to-[#16191d] rounded-2xl border border-indigo-500/20 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="calendar" className="w-4 h-4 text-indigo-400/70" />
              <p className="text-xs font-bold text-indigo-400/70 uppercase tracking-wider">Tüm Ay Çalışılırsa</p>
            </div>
            <p className="text-xs text-base-content/50 mb-3">
              {stats.workableDaysInMonth} iş günü × {fmtMoney(Number(settings.daily_yevmiye) || 0)} yevmiye
            </p>
            <p className="text-4xl font-black text-indigo-400">{fmtMoney(stats.fullMonthProjection)}</p>
            <p className="text-xs text-base-content/50 mt-2">{restDayNames} hariç tüm iş günleri çalışılırsa</p>
          </div>
        </div>
      </div>

      {/* ORTA BÖLÜM: Haftalık / 15 Günlük / Aylık tahmini projeksiyonlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Haftalık Tahmini Kazanç"
          value={fmtMoney(stats.weeklyEarning)}
          iconName="calendar"
          colorTheme="indigo"
          desc="Tüm iş günleri çalışılırsa"
        />
        <StatCard
          title="15 Günlük Tahmini Kazanç"
          value={fmtMoney(stats.biweeklyEarning)}
          iconName="calendar"
          colorTheme="orange"
          desc="Tüm iş günleri çalışılırsa"
        />
        <StatCard
          title="Aylık Tahmini Kazanç"
          value={fmtMoney(stats.fullMonthProjection)}
          iconName="wallet"
          colorTheme="emerald"
          desc="Tüm iş günleri çalışılırsa"
        />
      </div>

      {/* Fiili Kazanç (Takvimden) */}
      {stats.totalDaysWorked > 0 && (
        <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-4">
          <div className="bg-emerald-500/20 p-3 rounded-full">
            <Icon name="check" className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-400/80 mb-1">Bu Ay Takvimden Kazanılan</p>
            <p className="text-xs text-base-content/50">{stats.totalDaysWorked} gün giriş yapıldı</p>
          </div>
          <p className="text-2xl font-black text-emerald-300">{fmtMoney(stats.totalEarned)}</p>
        </div>
      )}

      {/* ALT BÖLÜM: Özet tablo */}
      <div className="bg-[#1e2329] rounded-xl border border-base-300 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-base-300 pb-2">Aylık Özet ve Detaylar</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra table-sm w-full">
            <tbody>
              <tr>
                <td className="font-medium text-base-content/80">Takvime Girilen Gün Sayısı</td>
                <td className="text-right font-bold text-white">{stats.totalDaysWorked} Gün</td>
              </tr>
              <tr>
                <td className="font-medium text-base-content/80">Çalışılabilir İş Günü ({restDayNames} Hariç)</td>
                <td className="text-right font-bold text-base-content/60">{stats.workableDaysInMonth} Gün</td>
              </tr>
              <tr>
                <td className="font-medium text-base-content/80">Günlük Yevmiye Ücreti</td>
                <td className="text-right font-bold text-emerald-400">{fmtMoney(Number(settings.daily_yevmiye) || 0)}</td>
              </tr>
              {stats.deductionsTL > 0 && (
                <tr>
                  <td className="font-medium text-base-content/80">Eksik Saat Kesintileri Toplamı</td>
                  <td className="text-right font-bold text-red-400">{fmtMoney(stats.deductionsTL)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sonraki Ödeme Tarihi */}
      <div className="bg-indigo-900/10 border border-indigo-500/30 rounded-xl p-5 flex items-center gap-4">
        <div className="bg-indigo-500/20 p-3 rounded-full">
          <Icon name="clock" className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-indigo-400/80 mb-1">Planlanan Sonraki Ödeme ({frequencyLabel})</p>
          <p className="text-xl font-bold text-indigo-300">{nextPaymentStr}</p>
        </div>
      </div>
    </div>
  );
}
