import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import Alert from '../shared/Alert';
import PremiumPaywallModal from '../shared/PremiumPaywallModal';
import { IS_PAYWALL_ACTIVE } from '../../config/features';

export default function ReportPayTab() {
  const { settings } = useAppStore();
  
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [reportDays, setReportDays] = useState<string>('');
  const [treatmentType, setTreatmentType] = useState<'ayakta' | 'yatarak'>('ayakta');
  
  // Hesaplanan sonucu tutmak için state
  const [result, setResult] = useState<any>(null);

  // Premium Kontrolleri
  const [showPaywall, setShowPaywall] = useState(false);
  const isPremiumOrAdmin = settings?.role === 'admin' || (settings?.premium_until && new Date(settings.premium_until) > new Date());
  const hasAccess = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;

  const handleCalculate = () => {
    // Premium Kontrolü
    if (!hasAccess) {
      setShowPaywall(true);
      return;
    }

    if (!grossSalary || isNaN(Number(grossSalary)) || !reportDays || isNaN(Number(reportDays))) return;

    const gross = Number(grossSalary);
    const days = Math.floor(Number(reportDays));

    if (days < 3) {
      setResult({ error: 'SGK, 3 günden az (1 veya 2 günlük) raporlar için işgöremezlik ödeneği yatırmaz. Bu günlerin ücreti işveren insiyatifindedir.' });
      return;
    }

    const dailyGross = gross / 30;
    const paidDays = days - 2;
    const rate = treatmentType === 'ayakta' ? (2 / 3) : (1 / 2);
    const sgkPayment = dailyGross * rate * paidDays;

    setResult({
      dailyGross: dailyGross.toFixed(2),
      paidDays,
      unpaidDays: 2,
      sgkPayment: sgkPayment.toFixed(2),
      error: null
    });
  };

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      
      {/* PREMIUM UYARISI */}
      {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && (
        <Alert color="amber" title="Premium Özellik" icon="warning">
          SGK İş Göremezlik (Rapor Parası) hesaplama modülü Premium üyelere özel bir özelliktir.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-base-content mb-2">SGK Rapor Parası (İş Göremezlik)</h3>
            <p className="text-sm text-base-content/60 mb-6">3 gün ve üzeri istirahat raporlarında devletin size PTT veya Banka üzerinden yatıracağı tutarı hesaplayın.</p>
            
            <div className="space-y-6">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-content/80">Aylık Brüt Maaşınız (TL)</span></label>
                <input 
                  type="number" 
                  placeholder="Örn: 30000" 
                  className="input input-bordered w-full bg-base-200 focus:border-indigo-500 text-lg font-medium" 
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-content/80">Toplam Rapor Gün Sayısı</span></label>
                <input 
                  type="number" 
                  placeholder="Örn: 5" 
                  className="input input-bordered w-full bg-base-200 focus:border-indigo-500 text-lg font-medium" 
                  value={reportDays}
                  onChange={(e) => setReportDays(e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-content/80">Tedavi Türü</span></label>
                <div className="flex bg-base-200 p-1 rounded-lg">
                  <button 
                    onClick={() => setTreatmentType('ayakta')} 
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${treatmentType === 'ayakta' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}
                  >
                    Ayakta Tedavi
                  </button>
                  <button 
                    onClick={() => setTreatmentType('yatarak')} 
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${treatmentType === 'yatarak' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}
                  >
                    Yatarak Tedavi
                  </button>
                </div>
                <span className="text-[10px] text-base-content/40 pl-1 mt-1">
                  *Ayakta tedavilerde brütün 2/3'ü, hastanede yatarak tedavilerde 1/2'si ödenir.
                </span>
              </div>
            </div>
          </div>

          <button onClick={handleCalculate} className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-6">
            Hesapla
            {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="ml-2 text-xs bg-indigo-900/40 px-2 py-1 rounded text-indigo-200">PRO</span>}
          </button>
        </div>

        <div className="bg-base-200 p-4 sm:p-6 rounded-2xl border border-base-300 flex flex-col justify-center min-h-[300px]">
          {result ? (
            result.error ? (
              <div className="alert alert-warning bg-orange-900/20 text-orange-200 border border-orange-500/30 text-sm shadow-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{result.error}</span>
              </div>
            ) : (
              <div className="animate-fade-in space-y-4">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl relative overflow-hidden">
                  <p className="text-xs sm:text-sm font-bold text-indigo-300 mb-2">SGK TARAFINDAN YATIRILACAK TUTAR</p>
                  <p className="text-3xl sm:text-4xl font-black text-white">₺ {result.sgkPayment}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-[#1e2329] p-3 sm:p-4 rounded-xl border border-base-300">
                    <p className="text-[10px] sm:text-xs font-bold text-base-content/60">ÖDEME YAPILACAK GÜN</p>
                    <p className="text-lg sm:text-xl font-black text-emerald-400 mt-1">{result.paidDays} Gün</p>
                  </div>
                  <div className="bg-[#1e2329] p-3 sm:p-4 rounded-xl border border-base-300">
                    <p className="text-[10px] sm:text-xs font-bold text-base-content/60">KESİLEN GÜN (İLK 2 GÜN)</p>
                    <p className="text-lg sm:text-xl font-black text-red-400 mt-1">{result.unpaidDays} Gün</p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center opacity-50 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              <p className="font-medium text-sm sm:text-base">Maaş ve gün bilginizi girip 'Hesapla' butonuna basın.</p>
            </div>
          )}
        </div>
      </div>

      <PremiumPaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName="Rapor Parası Hesaplama" 
      />
    </div>
  );
}