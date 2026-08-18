import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import Alert from '../shared/Alert';
import PremiumPaywallModal from '../shared/PremiumPaywallModal';
import { IS_PAYWALL_ACTIVE } from '../../config/features';

export default function RaiseSimulatorTab() {
  const { settings } = useAppStore();
  const [currentSalary, setCurrentSalary] = useState<string>('');
  const [raiseType, setRaiseType] = useState<'percent' | 'flat'>('percent');
  const [raiseValue, setRaiseValue] = useState<string>('');

  const [result, setResult] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const isPremiumOrAdmin = settings?.role === 'admin' || (settings?.premium_until && new Date(settings.premium_until) > new Date());
  const hasAccess = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;

  const handleCalculate = () => {
    if (!hasAccess) {
      setShowPaywall(true);
      return;
    }

    if (!currentSalary || isNaN(Number(currentSalary)) || !raiseValue || isNaN(Number(raiseValue))) return;

    const base = Number(currentSalary);
    const value = Number(raiseValue);
    
    let newSalary = 0;
    let raiseAmount = 0;

    if (raiseType === 'percent') {
      raiseAmount = base * (value / 100);
      newSalary = base + raiseAmount;
    } else {
      raiseAmount = value;
      newSalary = base + raiseAmount;
    }

    const effectivePercent = ((raiseAmount / base) * 100).toFixed(1);

    setResult({
      base: base.toFixed(2),
      newSalary: newSalary.toFixed(2),
      raiseAmount: raiseAmount.toFixed(2),
      effectivePercent
    });
  };

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      
      {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && (
        <Alert color="amber" title="Premium Özellik" icon="warning" bgStyle="colored">
          Gelişmiş Zam Simülatörü sadece Premium üyelere açıktır.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-base-content mb-2">Zam Simülatörü</h3>
            <p className="text-sm text-base-content/60 mb-6">Maaşınıza yapılacak zammın cebinize nasıl yansıyacağını anında görün.</p>
            
            <div className="space-y-6">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-content/80">Mevcut Maaşınız (TL)</span></label>
                <input type="number" placeholder="Örn: 25000" className="input input-bordered w-full bg-base-200 focus:border-indigo-500 text-lg font-medium" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-content/80">Zam Türü Seçimi</span></label>
                <div className="flex bg-base-200 p-1 rounded-lg mb-1">
                  <button onClick={() => setRaiseType('percent')} className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${raiseType === 'percent' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}>% Yüzdelik Zam</button>
                  <button onClick={() => setRaiseType('flat')} className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${raiseType === 'flat' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}>₺ Sabit Tutar</button>
                </div>
              </div>

              <div className="form-control w-full animate-fade-in">
                <label className="label"><span className="label-text font-bold text-base-content/80">{raiseType === 'percent' ? 'Zam Oranı (%)' : 'Eklenecek Sabit Tutar (TL)'}</span></label>
                <div className="relative">
                  <input type="number" placeholder={raiseType === 'percent' ? "Örn: 35" : "Örn: 8000"} className="input input-bordered w-full bg-base-200 focus:border-indigo-500 pl-10 text-lg font-medium" value={raiseValue} onChange={(e) => setRaiseValue(e.target.value)} />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 font-bold">{raiseType === 'percent' ? '%' : '₺'}</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleCalculate} className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-6">
            Zammı Hesapla
            {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="ml-2 text-xs bg-indigo-900/40 px-2 py-1 rounded text-indigo-200">PRO</span>}
          </button>
        </div>

        <div className="bg-base-200 p-4 sm:p-6 rounded-2xl border border-base-300 flex flex-col justify-center min-h-[300px]">
          {result ? (
            <div className="animate-fade-in space-y-4 sm:space-y-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl relative overflow-hidden">
                <p className="text-xs sm:text-sm font-bold text-indigo-300 mb-2">YENİ MAAŞINIZ</p>
                <p className="text-3xl sm:text-5xl font-black text-white">₺ {result.newSalary}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-[#1e2329] p-3 sm:p-4 rounded-xl border border-base-300 flex flex-col justify-between">
                  <p className="text-[10px] sm:text-xs font-bold text-base-content/60">NET ZAM MİKTARI</p>
                  <p className="text-lg sm:text-xl font-black text-emerald-400 mt-2">+ ₺ {result.raiseAmount}</p>
                </div>
                <div className="bg-[#1e2329] p-3 sm:p-4 rounded-xl border border-base-300 flex flex-col justify-between">
                  <p className="text-[10px] sm:text-xs font-bold text-base-content/60">ZAM ORANI ETKİSİ</p>
                  <p className="text-lg sm:text-xl font-black text-indigo-400 mt-2">% {result.effectivePercent}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-50 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <p className="font-medium text-sm sm:text-base">Mevcut maaş ve zam bilgisini girip 'Hesapla' butonuna basın.</p>
            </div>
          )}
        </div>
      </div>

      <PremiumPaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} featureName="Gelişmiş Zam Simülatörü" />
    </div>
  );
}