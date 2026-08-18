import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import Alert from '../shared/Alert';
import PremiumPaywallModal from '../shared/PremiumPaywallModal';
import { IS_PAYWALL_ACTIVE } from '../../config/features';

export default function MaternityLeaveTab() {
  const { settings } = useAppStore();
  
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  
  const [result, setResult] = useState<any>(null);

  const [showPaywall, setShowPaywall] = useState(false);
  const isPremiumOrAdmin = settings?.role === 'admin' || (settings?.premium_until && new Date(settings.premium_until) > new Date());
  const hasAccess = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;

  const handleCalculate = () => {
    if (!hasAccess) {
      setShowPaywall(true);
      return;
    }

    if (!grossSalary || isNaN(Number(grossSalary)) || !birthDate) return;

    const gross = Number(grossSalary);
    const date = new Date(birthDate);

    const totalDays = 112; 
    const dailyGross = gross / 30;
    const totalAllowance = (dailyGross * (2 / 3)) * totalDays;

    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - (8 * 7));
    
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + (8 * 7));

    const lactationEnd = new Date(date);
    lactationEnd.setFullYear(lactationEnd.getFullYear() + 1);

    const formatDate = (d: Date) => d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });

    setResult({
      totalAllowance: totalAllowance.toFixed(2),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      lactationEnd: formatDate(lactationEnd)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      
      {/* PREMIUM UYARISI */}
      {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && (
        <Alert color="amber" title="Premium Özellik" icon="warning">
          Doğum ve Süt İzni Planlama modülü sadece Premium üyelere açıktır.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-base-content mb-2">Doğum & Süt İzni Hesaplayıcı</h3>
            <p className="text-sm text-base-content/60 mb-6">Anneler için 16 haftalık (112 gün) yasal doğum izni tarihlerini ve SGK'nın yatıracağı toplam Analık Ödeneğini bulun.</p>
            
            <div className="space-y-6">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-content/80">Aylık Brüt Maaşınız (TL)</span></label>
                <input 
                  type="number" 
                  placeholder="Örn: 40000" 
                  className="input input-bordered w-full bg-base-200 focus:border-indigo-500 text-lg font-medium" 
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-content/80">Tahmini Doğum Tarihi</span></label>
                <input 
                  type="date" 
                  className="input input-bordered w-full bg-base-200 focus:border-indigo-500 font-medium" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div className="alert alert-success bg-emerald-900/20 text-emerald-200 border border-emerald-500/30 text-xs sm:text-sm text-left shadow-none mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Bebek 1 yaşına gelene kadar annelere günde <strong>1.5 saat süt izni</strong> kullandırılması yasal bir zorunluluktur.</span>
              </div>
            </div>
          </div>

          <button onClick={handleCalculate} className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-6">
            Planlamayı Hesapla
            {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="ml-2 text-xs bg-indigo-900/40 px-2 py-1 rounded text-indigo-200">PRO</span>}
          </button>
        </div>

        <div className="bg-base-200 p-4 sm:p-6 rounded-2xl border border-base-300 flex flex-col justify-center min-h-[300px]">
          {result ? (
            <div className="animate-fade-in space-y-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl">
                <p className="text-xs sm:text-sm font-bold text-indigo-300 mb-2">SGK TOPLAM ANALIK ÖDENEĞİ</p>
                <p className="text-3xl sm:text-4xl font-black text-white">₺ {result.totalAllowance}</p>
                <p className="text-[10px] text-indigo-300/60 mt-2">*İzin bitiminde PTT veya Banka hesabınıza yatırılır.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#1e2329] p-3 rounded-lg border border-base-300">
                  <span className="text-xs font-bold text-base-content/60">İZNİN BAŞLAMASI (DOĞUMDAN ÖNCE)</span>
                  <span className="font-bold text-emerald-400">{result.startDate}</span>
                </div>
                <div className="flex justify-between items-center bg-[#1e2329] p-3 rounded-lg border border-base-300">
                  <span className="text-xs font-bold text-base-content/60">İZNİN BİTMESİ (DOĞUMDAN SONRA)</span>
                  <span className="font-bold text-red-400">{result.endDate}</span>
                </div>
                <div className="flex justify-between items-center bg-[#1e2329] p-3 rounded-lg border border-base-300">
                  <span className="text-xs font-bold text-base-content/60">SÜT İZNİ BİTİŞ TARİHİ</span>
                  <span className="font-bold text-indigo-400">{result.lactationEnd}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-50 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
              <p className="font-medium text-sm sm:text-base">Hesaplama için maaş ve tahmini doğum tarihi girin.</p>
            </div>
          )}
        </div>
      </div>

      <PremiumPaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName="Doğum ve Süt İzni Hesaplama" 
      />
    </div>
  );
}