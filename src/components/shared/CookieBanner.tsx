import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vardiyo_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vardiyo_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-fade-in pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="bg-[#1e2329]/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-base-content/80 text-center sm:text-left flex-1">
            <span className="font-bold text-base-content">Çerez & Veri Kullanımı: </span>
            Uygulamanın temel işlevlerini sağlamak ve oturumunuzu açık tutmak için tarayıcınızın yerel depolama özelliklerini kullanıyoruz.
            Detaylar için <Link to="/privacy" className="text-indigo-400 hover:underline font-medium">Gizlilik Politikasını</Link> okuyabilirsiniz.
          </div>
          <div className="flex w-full sm:w-auto shrink-0">
            <button
              onClick={handleAccept}
              className="btn w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/40 px-8"
            >
              Anladım
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

