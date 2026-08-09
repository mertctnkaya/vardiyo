import { useState } from 'react';

export default function UnemploymentTab() {
  const [salary, setSalary] = useState<string>('');
  const [salaryType, setSalaryType] = useState<'net' | 'gross'>('net');
  const [premiumDays, setPremiumDays] = useState<string>('600');
  
  const CURRENT_GROSS_MIN_WAGE = 20002.50; 

  const calculateUnemployment = () => {
    if (!salary || isNaN(Number(salary))) return null;

    let gross = Number(salary);
    
    // Eğer işçi Net maaş girdiyse, ortalama %15 vergi + %15 SGK/İşsizlik payını (Toplam %71.49 çarpanı)
    // tersine çevirerek yaklaşık brüt maaşını tahmin ediyoruz.
    if (salaryType === 'net') {
      gross = gross / 0.7149;
    }

    let calculatedAllowance = gross * 0.40; // Yasa gereği brütün %40'ı
    const maxLimit = CURRENT_GROSS_MIN_WAGE * 0.80; // Asgari ücretin %80'ini geçemez

    if (calculatedAllowance > maxLimit) {
      calculatedAllowance = maxLimit;
    }

    const stampDuty = calculatedAllowance * 0.00759; // Binde 7.59 Damga Vergisi
    const netAllowance = calculatedAllowance - stampDuty;

    let duration = 0;
    if (premiumDays === '600') duration = 6;
    else if (premiumDays === '900') duration = 8;
    else if (premiumDays === '1080') duration = 10;

    return {
      netAllowance: netAllowance.toFixed(2),
      stampDuty: stampDuty.toFixed(2),
      grossAllowance: calculatedAllowance.toFixed(2),
      duration,
      totalPayment: (netAllowance * duration).toFixed(2),
      estimatedGross: gross.toFixed(2)
    };
  };

  const result = calculateUnemployment();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in px-2 sm:px-0">
      
      {/* SOL: Girdi Formu */}
      <div className="bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl">
        <h3 className="text-xl font-bold text-base-content mb-2">İşsizlik Maaşı Hesaplama</h3>
        <p className="text-sm text-base-content/60 mb-6">Mevcut maaşınıza göre ne kadar süreyle ve kaç TL işsizlik ödeneği alacağınızı hızlıca öğrenin.</p>
        
        <div className="space-y-6">
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold text-base-content/80">Maaş Türü</span></label>
            <div className="flex bg-base-200 p-1 rounded-lg">
              <button 
                onClick={() => setSalaryType('net')} 
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${salaryType === 'net' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}
              >
                Net Maaş
              </button>
              <button 
                onClick={() => setSalaryType('gross')} 
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${salaryType === 'gross' ? 'bg-indigo-600 text-white shadow-md' : 'text-base-content/60 hover:text-base-content'}`}
              >
                Brüt Maaş
              </button>
            </div>
          </div>

          <div className="form-control w-full animate-fade-in">
            <label className="label"><span className="label-text font-bold text-base-content/80">Aylık Maaşınız (TL)</span></label>
            <input 
              type="number" 
              placeholder="Örn: 25000" 
              className="input input-bordered w-full bg-base-200 focus:border-indigo-500 text-lg font-medium" 
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold text-base-content/80">Son 3 Yıldaki Prim Gün Sayınız</span></label>
            <select 
              className="select select-bordered w-full bg-base-200 focus:border-indigo-500"
              value={premiumDays}
              onChange={(e) => setPremiumDays(e.target.value)}
            >
              <option value="600">600 Gün (6 Ay Ödenek)</option>
              <option value="900">900 Gün (8 Ay Ödenek)</option>
              <option value="1080">1080 Gün veya Fazlası (10 Ay Ödenek)</option>
            </select>
          </div>
          
          {/* O taşıp çirkin duran uyarı yazısı artık şık bir uyarı kutusu */}
          <div className="alert alert-info bg-indigo-900/20 text-indigo-200 border border-indigo-500/30 text-xs sm:text-sm text-left shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Kendi isteğiniz dışında (işten çıkarılma) işsiz kalmanız ve son 120 gün SGK'lı hizmet akdine tabi olmanız şartı aranır.</span>
          </div>
        </div>
      </div>

      {/* SAĞ: Sonuç Ekranı */}
      <div className="bg-base-200 p-4 sm:p-6 rounded-2xl border border-base-300 flex flex-col justify-center min-h-[300px]">
        {result ? (
          <div className="animate-fade-in">
            <h4 className="text-lg font-bold text-base-content mb-4 sm:mb-6 pb-2 border-b border-base-300">Ödenek Detayları</h4>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-[#1e2329] p-3 sm:p-4 rounded-xl border border-base-300">
                <p className="text-[10px] sm:text-xs font-bold text-base-content/60 uppercase">Aylık Net Ödenek</p>
                <p className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">₺ {result.netAllowance}</p>
              </div>
              <div className="bg-[#1e2329] p-3 sm:p-4 rounded-xl border border-base-300">
                <p className="text-[10px] sm:text-xs font-bold text-base-content/60 uppercase">Ödenek Süresi</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{result.duration} Ay</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {salaryType === 'net' && (
                <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                  <span className="text-base-content/50 italic">Tahmini Brüt Maaşınız</span>
                  <span className="font-medium text-base-content/50">₺ {result.estimatedGross}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                <span className="text-base-content/70">Yasal Brüt Ödenek (%40)</span>
                <span className="font-bold">₺ {result.grossAllowance}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                <span className="text-base-content/70">Damga Vergisi Kesintisi</span>
                <span className="font-bold text-red-400">- ₺ {result.stampDuty}</span>
              </div>
              <div className="flex justify-between items-center bg-indigo-900/10 p-3 sm:p-4 rounded-lg border border-indigo-500/20 mt-4">
                <span className="font-bold text-base-content">Alınacak Toplam Ödeme</span>
                <span className="font-black text-indigo-400 text-lg">₺ {result.totalPayment}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium">Hesaplama için maaş bilginizi girin.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}