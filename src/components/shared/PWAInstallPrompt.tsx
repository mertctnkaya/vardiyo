import { useState, useEffect } from 'react';
import { isNative } from '../../utils/isNative';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isNative()) return;

    const dismissed = localStorage.getItem('vardiyo_pwa_dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('vardiyo_pwa_dismissed', 'true');
    }
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('vardiyo_pwa_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 p-4 animate-fade-in pointer-events-none print:hidden">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-[#1e2329]/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-xl shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-base-content">Ana Ekrana Ekle</p>
            <p className="text-xs text-base-content/60">Vardiyo'yu hızlı erişim için ana ekranınıza ekleyin.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleDismiss} className="btn btn-xs btn-ghost text-base-content/50 hover:text-base-content">
              Kapat
            </button>
            <button onClick={handleInstall} className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/40">
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

