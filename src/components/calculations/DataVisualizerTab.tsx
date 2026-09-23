import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { fetchWorkLogsRange } from '../../services/dbService';
import { generatePayrollData } from '../../core/payrollEngine';
import { calculateMonthlyYevmiyeStats } from '../../core/yevmiyeEngine';
import { IS_PAYWALL_ACTIVE } from '../../config/premiumFeatures';
import Alert from '../shared/Alert';
import Icon from '../shared/Icon';
import StatCard from '../shared/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

export default function DataVisualizerTab() {
  const { settings, user } = useAppStore();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isPremiumOrAdmin = user?.email === 'm3rt7132@gmail.com';
  const hasAccess = true;

  useEffect(() => {
    if (!user || !settings || !hasAccess) return;

    const loadData = async () => {
      setIsLoading(true);

      // Son 6 ayın verilerini çek
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      const firstDayStr = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`;
      // Bu ayın son günü
      const thisMonthLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const lastDayStr = `${thisMonthLastDay.getFullYear()}-${String(thisMonthLastDay.getMonth() + 1).padStart(2, '0')}-${String(thisMonthLastDay.getDate()).padStart(2, '0')}`;

      const logs = await fetchWorkLogsRange(user.id, firstDayStr, lastDayStr);

      const dataPoints = [];
      const isYevmiye = settings.work_type === 'yevmiye';

      let totalNetEarn = 0;
      let totalOvertimeHours = 0;
      let totalAbsentCount = 0;
      let totalNightHoursCount = 0;
      let maxMonthName = '';
      let maxMonthAmount = 0;

      // 6 ay için döngü
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = targetDate.getFullYear();
        const m = targetDate.getMonth(); // 0-11

        const monthPrefix = `${y}-${String(m + 1).padStart(2, '0')}`;

        // Bu aya ait logları filtrele
        const monthLogs = logs.filter((l: any) => l.log_date.startsWith(monthPrefix));

        let net = 0;
        let overtime = 0;
        let absent = 0;

        if (isYevmiye) {
          const logsMap: Record<string, any> = {};
          monthLogs.forEach((l: any) => { logsMap[l.log_date] = l; });
          const stats = calculateMonthlyYevmiyeStats(logsMap, settings, y, m);
          net = stats.netMonthly;
          // Yevmiye için ek kesinti ve mesai verisi pek net değil, şimdilik total çalıştığı günü alalım
          overtime = stats.totalDaysWorked;
        } else {
          const stats = generatePayrollData(settings, monthLogs, targetDate, '0', '0') as any;
          net = stats.hesabaYatanNet;
          overtime = stats.stats.overtimeHours;
          absent = stats.stats.absentDays;
          totalNightHoursCount += stats.calculatedNightHours || 0;
        }

        totalNetEarn += net;
        totalOvertimeHours += overtime;
        totalAbsentCount += absent;

        const monthStr = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(targetDate);
        if (net > maxMonthAmount) {
          maxMonthAmount = net;
          maxMonthName = monthStr;
        }

        dataPoints.push({
          name: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(targetDate),
          Kazanç: Math.round(net),
          Mesai: Math.round(overtime),
          Devamsızlık: absent,
          monthIndex: m
        });
      }

      setChartData(dataPoints);

      // We will store stats in state
      setSummaryStats({
        avgNet: dataPoints.length > 0 ? (totalNetEarn / dataPoints.length) : 0,
        totalOvertime: totalOvertimeHours,
        totalNight: totalNightHoursCount,
        totalAbsent: totalAbsentCount,
        maxMonth: maxMonthName,
        maxAmount: maxMonthAmount
      });

      // 1) Kariyer Kıdemi (Toplam Süre)
      let currentCareerStats = null;
      if (settings.employment_start_date) {
        const start = new Date(settings.employment_start_date);
        const diffMs = now.getTime() - start.getTime();
        if (diffMs >= 0) {
          const days = diffMs / (1000 * 60 * 60 * 24);
          currentCareerStats = {
            years: (days / 365.25).toFixed(2),
            months: (days / 30.436875).toFixed(1),
            weeks: (days / 7).toFixed(1),
            days: days.toFixed(1)
          };
        }
      }
      setCareerStats(currentCareerStats);

      // 2) Bu Ay & Bu Hafta Çalışılan Süre Hesaplaması
      const getWorkedAmount = (startD: Date, endD: Date) => {
        let amount = 0;
        const baseWorkHours = Number(settings.base_work_hours) || 7.5;
        const isYev = settings.work_type === 'yevmiye';

        const cursor = new Date(startD);
        cursor.setHours(0, 0, 0, 0);
        const end = new Date(endD);
        end.setHours(23, 59, 59, 999);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
        const effectiveEnd = end < todayEnd ? end : todayEnd;

        while (cursor <= effectiveEnd) {
          const isSunday = cursor.getDay() === 0;
          const isSaturday = cursor.getDay() === 6;
          const isSaturdayWork = settings.is_saturday_workday || false;
          const isOffDay = settings.work_type === 'fixed' ? (isSunday || (!isSaturdayWork && isSaturday)) : isSunday;

          const dateKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
          const log = logs.find((l: any) => l.log_date === dateKey);

          if (isYev) {
            if (log) {
              if (['normal', 'late', 'partial_leave', 'holiday_work', 'overtime'].includes(log.status)) {
                amount += 1;
              }
            } else {
              if (!isSunday) amount += 1;
            }
          } else {
            let dailyHours = 0;
            if (log) {
              if ((log.status === 'normal' || log.status === 'leave') && !isOffDay) dailyHours = baseWorkHours;
              else if (log.status === 'late' || log.status === 'partial_leave') {
                if (!isOffDay) dailyHours = Math.max(0, baseWorkHours - (Number(log.hours) || 0));
              }
              else if (log.status === 'overtime') {
                if (!isOffDay) dailyHours = baseWorkHours + (Number(log.hours) || 0);
                else dailyHours = (Number(log.hours) || 0);
              }
              else if (log.status === 'holiday_work') {
                dailyHours = baseWorkHours;
              }
            } else {
              if (!isOffDay) dailyHours = baseWorkHours;
            }
            amount += dailyHours;
          }
          cursor.setDate(cursor.getDate() + 1);
        }
        return amount;
      };

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const currentDay = now.getDay() || 7; // 1-7
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - currentDay + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      setCurrentStats({
        monthWorked: getWorkedAmount(monthStart, monthEnd),
        weekWorked: getWorkedAmount(weekStart, weekEnd)
      });

      setIsLoading(false);
    };

    loadData();
  }, [user, settings, hasAccess]);

  const [summaryStats, setSummaryStats] = useState({
    avgNet: 0,
    totalOvertime: 0,
    totalNight: 0,
    totalAbsent: 0,
    maxMonth: '',
    maxAmount: 0
  });

  const [careerStats, setCareerStats] = useState<any>(null);
  const [currentStats, setCurrentStats] = useState({ monthWorked: 0, weekWorked: 0 });

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && (
        <Alert color="amber" title="Premium Özellik" icon="warning" bgStyle="colored">
          Grafiksel İstatistikler ve Veri Görselleştirme araçları Premium üyelere özeldir.
        </Alert>
      )}

      <div className={`relative ${IS_PAYWALL_ACTIVE && !isPremiumOrAdmin ? 'pointer-events-none' : ''}`}>

        {/* Premium Lock Overlay */}
        {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && (
          <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/40 rounded-2xl flex flex-col items-center justify-center p-6 border border-amber-500/30">
            <div className="bg-amber-500/20 p-4 rounded-full mb-4">
              <Icon name="premium" className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bu Özellik Kilitli</h3>
            <p className="text-base-content/70 text-center max-w-sm mb-4">
              Geçmiş aylara dönük kazanç trendleri, mesai yoğunluk haritası ve detaylı analitikleri görmek için Premium'a yükseltin.
            </p>
            <button className="btn bg-amber-500 hover:bg-amber-600 text-black border-none shadow-lg shadow-amber-500/20 font-bold">
              Premium Al (Yakında)
            </button>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-6 ${IS_PAYWALL_ACTIVE && !isPremiumOrAdmin ? 'opacity-30 blur-sm' : ''}`}>

          {/* Genel Kariyer & Güncel Tempo */}
          {careerStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <StatCard
                title="Kıdem Süresi"
                value={`${careerStats.years} Yıl`}
                desc={`${careerStats.months} Ay | ${careerStats.weeks} Hafta`}
                colorTheme="indigo"
                iconName="crown"
              />
              <StatCard
                title="Kıdem (Günlük)"
                value={`${careerStats.days} Gün`}
                desc="İşe girişten bugüne"
                colorTheme="blue"
                iconName="calendar"
              />
              <StatCard
                title="Bu Ay Çalışma"
                value={`${Math.round(currentStats.monthWorked)} ${settings?.work_type === 'yevmiye' ? 'Gün' : 'Saat'}`}
                desc="Ay başından bugüne"
                colorTheme="emerald"
                iconName="clock"
              />
              <StatCard
                title="Bu Hafta Çalışma"
                value={`${Math.round(currentStats.weekWorked)} ${settings?.work_type === 'yevmiye' ? 'Gün' : 'Saat'}`}
                desc="Pazartesiden bugüne"
                colorTheme="orange"
                iconName="clock"
              />
            </div>
          )}

          {/* İstatistik Özet Kartları (Son 6 Ay) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <StatCard
              title="Aylık Ort. Kazanç"
              value={`₺${summaryStats.avgNet.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
              desc="Son 6 ayın ortalaması"
              colorTheme="emerald"
              iconName="money"
            />
            {settings?.work_type === 'yevmiye' ? (
              <StatCard
                title="Toplam Çalışma"
                value={`${summaryStats.totalOvertime} Gün`}
                desc="Son 6 ayda çalışılan gün"
                colorTheme="blue"
                iconName="calendar"
              />
            ) : (
              <StatCard
                title="Toplam Mesai"
                value={`${Math.round(summaryStats.totalOvertime)} Saat`}
                desc="Son 6 aydaki fazla mesai"
                colorTheme="orange"
                iconName="clock"
              />
            )}
            <StatCard
              title="Rekor Kazanç"
              value={`₺${summaryStats.maxAmount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
              desc={summaryStats.maxMonth || '-'}
              colorTheme="indigo"
              iconName="star"
            />
            {settings?.work_type === 'yevmiye' ? (
              <StatCard
                title="Eksik Çalışma"
                value={`${summaryStats.totalAbsent} Gün`}
                desc="Girilmeyen / Pazar dışı"
                colorTheme="red"
                iconName="warning"
              />
            ) : (
              <StatCard
                title="Gece Mesaisi"
                value={`${Math.round(summaryStats.totalNight)} Saat`}
                desc="Kanuni gece çalışması"
                colorTheme="rose"
                iconName="moon"
              />
            )}
          </div>

          <div className="bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4 border-b border-base-300 pb-2">Son 6 Ay Net Kazanç Trendi</h3>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <span className="loading loading-spinner text-indigo-500 loading-lg"></span>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e2329', borderColor: '#4a5568', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Kazanç" name="Net Kazanç (₺)" stroke="#818cf8" strokeWidth={3} dot={{ r: 6, fill: '#818cf8', strokeWidth: 2, stroke: '#1e2329' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4 border-b border-base-300 pb-2">
              {settings?.work_type === 'yevmiye' ? 'Çalışılan Gün Sayısı' : 'Fazla Mesai Saati vs Devamsızlık (Gün)'}
            </h3>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <span className="loading loading-spinner text-emerald-500 loading-lg"></span>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e2329', borderColor: '#4a5568', color: '#fff', borderRadius: '8px' }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <Legend />
                    {settings?.work_type === 'yevmiye' ? (
                      <Bar dataKey="Mesai" name="Çalışılan Gün" fill="#34d399" radius={[4, 4, 0, 0]} />
                    ) : (
                      <>
                        <Bar dataKey="Mesai" name="Fazla Mesai (Saat)" fill="#34d399" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Devamsızlık" name="Devamsızlık (Gün)" fill="#f87171" radius={[4, 4, 0, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
