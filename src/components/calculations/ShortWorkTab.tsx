import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import Alert from '../shared/Alert';
import PremiumPaywallModal from '../shared/PremiumPaywallModal';
import { IS_PAYWALL_ACTIVE } from '../../config/features';

export default function ShortWorkTab() {
  const { settings } = useAppStore();
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [workType, setWorkType] = useState<'kisa' | 'yarim'>('kisa');
  
  const [result, setResult] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const CURRENT_GROSS_MIN_WAGE = 20002.50;

  const isPremiumOrAdmin = settings?.role === 'admin' || (settings?.premium_until && new Date(settings.premium_until) > new Date());
  const hasAccess = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;

  const handleCalculate = () => {
    if (!hasAccess) {
      setShowPaywall(true);
      return;
    }

    if (!grossSalary || isNaN(Number(grossSalary))) return;

    const gross = Number(grossSalary);

    if (workType === 'kisa') {
      let allowance = gross * 0.60;
      const maxLimit = CURRENT_GROSS_MIN_WAGE * 1.50; 
      
      if (allowance > maxLimit) allowance = maxLimit;
      const stampDuty = allowance * 0.00759;

      setResult({
        type: 'kisa',
        netAllowance: (allowance - stampDuty).toFixed(2),
        stampDuty: stampDuty.toFixed(2),
        maxCapped: allowance === maxLimit
      });
    } else {
      const employerHalfGross = gross / 2;
      const iskurHalfGross = CURRENT_GROSS_MIN_WAGE / 2;
      const iskurStampDuty = iskurHalfGross * 0.00759;
      const iskurNet = iskurHalfGross - iskurStampDuty;

      setResult({
        type: 'yarim',
        employerGross: employerHalfGross.toFixed(2),
        iskurNet: iskurNet.toFixed(2),
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && (
        <Alert color="amber" title="Premium Özellik" icon="warning" bgStyle="colored">
          Kısa ve Yarım Çalışma Ödeneği hesaplama aracı Premium üyelere özeldir.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-base-content mb-2">Kısa ve Yarım Çalışma Ödeneği</h3>
            <p className="text-sm text-base-content/60 mb-6">Kriz anlarında (Kısa Çalışma) veya doğum sonrası (Yarım Çalışma) devletin yapacağı ödenek desteğini hesaplayın.</p>
            
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
                <label className="label"><span className="label-text font-bold text-base-content/80">Çalışma Tipi</span></label>
                <div className="flex bg-base-200 p-1 rounded-lg">
                  <button 
                    onClick={() => setWorkType('kisa')} 
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${workType === 'kisa' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}
                  >
                    Kısa Çalışma
                  </button>
                  <button 
                    onClick={() => setWorkType('yarim')} 
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${workType === 'yarim' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}
                  >
                    Yarım Çalışma
                  </button>
                </div>
              </div>

              <div className="alert alert-info bg-indigo-900/20 text-indigo-200 border border-indigo-500/30 text-xs sm:text-sm text-left shadow-none mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>
                  {workType === 'kisa' 
                    ? "Kısa çalışma ödeneği brüt maaşın %60'ıdır ancak brüt asgari ücretin %150'sini geçemez."
                    : "Yarım çalışmada maaşın yarısını işveren kendi brütünüzden, diğer yarısını İŞKUR brüt asgari ücret üzerinden öder."}
                </span>
              </div>
            </div>
          </div>

          <button onClick={handleCalculate} className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-6">
            Ödeneği Hesapla
            {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="ml-2 text-xs bg-indigo-900/40 px-2 py-1 rounded text-indigo-200">PRO</span>}
          </button>
        </div>

        <div className="bg-base-200 p-4 sm:p-6 rounded-2xl border border-base-300 flex flex-col justify-center min-h-[300px]">
          {result ? (
            <div className="animate-fade-in space-y-4">
              {result.type === 'kisa' ? (
                <>
                  <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl">
                    <p className="text-xs sm:text-sm font-bold text-indigo-300 mb-2">İŞKUR AYLIK NET ÖDENEĞİ</p>
                    <p className="text-3xl sm:text-4xl font-black text-white">₺ {result.netAllowance}</p>
                  </div>
                  {result.maxCapped && (
                    <p className="text-xs text-orange-400 text-center font-medium">* Maaşınız yüksek olduğu için ödenek yasal sınır olan asgari ücretin %150'sine takılmıştır.</p>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#1e2329] p-4 sm:p-6 rounded-xl border border-emerald-500/30">
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-400/80 mb-1">İŞVERENİN ÖDEYECEĞİ (Kendi Maaşınızdan)</p>
                    <p className="text-2xl sm:text-3xl font-black text-white">₺ {result.employerGross} <span className="text-sm font-normal text-base-content/50">/ Brüt</span></p>
                  </div>
                  <div className="bg-[#1e2329] p-4 sm:p-6 rounded-xl border border-indigo-500/30">
                    <p className="text-[10px] sm:text-xs font-bold text-indigo-400/80 mb-1">İŞKUR'UN ÖDEYECEĞİ (Asgari Ücretten)</p>
                    <p className="text-2xl sm:text-3xl font-black text-white">₺ {result.iskurNet} <span className="text-sm font-normal text-base-content/50">/ Net</span></p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center opacity-50 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="font-medium text-sm sm:text-base">Maaş bilginizi girerek hesapla butonuna basın.</p>
            </div>
          )}
        </div>
      </div>

      <PremiumPaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} featureName="Kısa / Yarım Çalışma Ödeneği" />
    </div>
  );
}