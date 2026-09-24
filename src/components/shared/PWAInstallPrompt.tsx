import { useState, useEffect } from 'react';
import { isNative } from '../../utils/isNative';

export default function PWAInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Eğer halihazırda mobil uygulama içindeyse (Capacitor) gösterme
    if (isNative()) return;

    // Tarayıcının kendi PWA (Ana Ekrana Ekle) banner'ını tamamen engelle
    const blockNativePWA = (e: Event) => e.preventDefault();
    window.addEventListener('beforeinstallprompt', blockNativePWA);

    // Kullanıcı daha önce kapatmışsa tekrar gösterme
    const dismissed = localStorage.getItem('vardiyo_playstore_dismissed');
    if (dismissed) return () => window.removeEventListener('beforeinstallprompt', blockNativePWA);

    // Sadece mobil tarayıcılarda (Android/iOS) göster
    const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobileBrowser) {
      // Sayfa açıldıktan 2 saniye sonra göster
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', blockNativePWA);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', blockNativePWA);
  }, []);

  const handleInstall = () => {
    // Kullanıcıyı Play Store'a yönlendir (uygulamanın gerçek paket adını/linkini buraya yazmalısın)
    // Şimdilik genel bir format, kendi uygulamanın id'si ile değiştirebilirsin
    window.location.href = 'https://play.google.com/store/apps/details?id=com.vardiyo.app';

    // Yönlendirdikten sonra tekrar çıkmaması için dismissed işaretle
    localStorage.setItem('vardiyo_playstore_dismissed', 'true');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('vardiyo_playstore_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 p-4 animate-fade-in pointer-events-none print:hidden">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-[#1e2329]/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-xl shrink-0">
            {/* Play Store İkonu */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.3414L3.626 23.447C3.3992 23.5794 3.12586 23.5413 2.93666 23.3642C2.82526 23.2598 2.7634 23.1118 2.7634 22.9567V1.04327C2.7634 0.767129 2.98725 0.543274 3.2634 0.543274C3.39626 0.543274 3.5248 0.592539 3.6234 0.682674L17.52 8.65863C17.7554 8.79093 17.8389 9.089 17.7066 9.32439C17.658 9.41094 17.587 9.48197 17.5005 9.53063L17.523 15.3414ZM18.9959 14.4819L21.3653 13.1158C21.6033 12.9785 21.6847 12.6743 21.5475 12.4363C21.498 12.3503 21.4243 12.281 21.3364 12.2356L18.9959 10.9329V14.4819Z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-base-content">Google Play'den İndir</p>
            <p className="text-xs text-base-content/60">Tüm özellikleri kullanmak için mobil uygulamamızı indirin.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleDismiss} className="btn btn-xs p-3 btn-ghost text-base-content/50 hover:text-base-content">
              Kapat
            </button>
            <button onClick={handleInstall} className="btn btn-xs p-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/40">
              İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
