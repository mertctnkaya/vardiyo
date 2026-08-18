import { Link } from 'react-router-dom';

interface PremiumPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function PremiumPaywallModal({ isOpen, onClose, featureName }: PremiumPaywallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" 
        onClick={onClose}
      ></div>
      
      <div className="bg-[#1e2329] border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative z-10 shadow-[0_0_50px_rgba(245,158,11,0.15)] w-full max-w-md flex flex-col text-center">
        
        <div className="mx-auto bg-amber-500/10 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        </div>

        <h3 className="font-bold text-2xl text-base-content mb-2">
          Premium Özellik
        </h3>
        
        <p className="text-base-content/70 mb-6 text-sm">
          <strong>"{featureName}"</strong> özelliği sadece Premium üyelerimize özeldir. Sınırsız takvim, PDF/Excel çıktıları ve gelişmiş simülatörler için Vardiyo Premium'a yükseltin.
        </p>

        <div className="flex flex-col gap-3">
          <button className="btn bg-amber-500 hover:bg-amber-600 text-black font-bold border-none shadow-lg shadow-amber-500/20">
            Premium'a Yükselt (Çok Yakında)
          </button>
          <Link to="/contact" className="btn bg-base-200 text-base-content/80 hover:bg-base-300 border-none">
            Yöneticiyle İletişime Geç
          </Link>
          <button 
            className="text-xs text-base-content/40 hover:text-base-content/60 mt-2 transition-colors"
            onClick={onClose}
          >
            Vazgeç ve Kapat
          </button>
        </div>
      </div>
    </div>
  );
}