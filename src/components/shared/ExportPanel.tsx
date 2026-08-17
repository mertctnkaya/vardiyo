import { useState } from 'react';
import type { ExportPanelProps } from "../../types/index";
import { useAppStore } from '../../store/useAppStore';
import PremiumPaywallModal from './PremiumPaywallModal';
import { IS_PAYWALL_ACTIVE } from '../../config/features'; // Şalteri içeri alıyoruz

export default function ExportPanel({ 
  title = "Raporu Dışa Aktar", 
  description = "Bu ayki çalışma dökümünüzü cihazınıza indirin veya yazdırın.", 
  onExportCSV, 
  onPrintPDF, 
  onExportJSON 
}: ExportPanelProps) {
  const { settings } = useAppStore();
  const [showPaywall, setShowPaywall] = useState(false);
  const [attemptedFeature, setAttemptedFeature] = useState('');

  // Kullanıcının Premium veya Admin olma durumu
  const isPremiumOrAdmin = 
    settings?.role === 'admin' || 
    (settings?.premium_until && new Date(settings.premium_until) > new Date());

  // KİLİT NOKTA: Şalter kapalıysa VEYA kullanıcı premiumsa erişim ver
  const hasAccess = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;

  // Tıklanan butonu kontrol eden aracı fonksiyon
  const handleRestrictedAction = (action: () => void, featureName: string) => {
    if (hasAccess) {
      action();
    } else {
      setAttemptedFeature(featureName);
      setShowPaywall(true);
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mt-4 bg-[#1e2329] rounded-xl border border-base-300 p-6 shadow-lg animate-fade-in print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Metin Alanı */}
          <div className="w-full text-left">
            <h4 className="font-bold text-base-content text-lg flex items-center gap-2">
              {title}
            </h4>
            <p className="text-sm text-base-content/60 mt-1">{description}</p>
          </div>
          
          {/* Butonlar Alanı */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-2 w-full md:w-auto">
            
            <button 
              onClick={() => handleRestrictedAction(onExportCSV, 'Excel (CSV) Dışa Aktarma')} 
              className="btn btn-sm md:btn-md bg-green-900/30 text-green-400 hover:bg-green-600 hover:text-white border-green-500/30 whitespace-nowrap flex-nowrap px-2 md:px-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel (CSV)
              {/* Sadece şalter açık ve kullanıcı ücretsizse PRO yazar */}
              {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="text-[9px] bg-amber-500 text-black px-1 rounded font-bold ml-1">PRO</span>}
            </button>
            
            <button 
              onClick={() => handleRestrictedAction(onPrintPDF, 'PDF Olarak Kaydet / Yazdır')} 
              className="btn btn-sm md:btn-md bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white border-red-500/30 whitespace-nowrap flex-nowrap px-2 md:px-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Yazdır / PDF
              {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="text-[9px] bg-amber-500 text-black px-1 rounded font-bold ml-1">PRO</span>}
            </button>
            
            <button 
              onClick={() => handleRestrictedAction(onExportJSON, 'JSON Veri Dışa Aktarma')} 
              className="btn btn-sm md:btn-md btn-ghost bg-gray-700 border-base-300 text-base-content/60 hover:bg-base-200 whitespace-nowrap flex-nowrap col-span-2 md:col-span-1 px-2 md:px-4" 
              title="Ham Veri Yedeği"
            >
              JSON
              {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="text-[9px] bg-amber-500 text-black px-1 rounded font-bold ml-1">PRO</span>}
            </button>
            
          </div>
        </div>
      </div>

      {/* Premium Modal (Şalter kapalıyken asla açılmaz çünkü onClick engellemez) */}
      <PremiumPaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName={attemptedFeature} 
      />
    </>
  );
}