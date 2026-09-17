import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { fetchWorkLogsRange } from '../../services/dbService';
import { generatePayrollData } from '../../core/payrollEngine';
import { calculateMonthlyYevmiyeStats } from '../../core/yevmiyeEngine';
import { IS_PAYWALL_ACTIVE } from '../../config/features';
import Alert from '../shared/Alert';
import Icon from '../shared/Icon';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

export default function DataVisualizerTab() {
  const { settings, user } = useAppStore();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isPremiumOrAdmin = user?.email === 'm3rt7132@gmail.com';
  const hasAccess = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;

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
      setIsLoading(false);
    };

    loadData();
  }, [user, settings, hasAccess]);

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
