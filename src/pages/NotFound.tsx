import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Sayfa Bulunamadı');

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in w-full mt-10 sm:mt-20 px-4">
      <div className="w-full max-w-md bg-[#16191d] rounded-2xl shadow-2xl border border-base-300 overflow-hidden text-center">
        <div className="bg-base-200 border-b border-base-300 p-8">
          <h1 className="text-7xl font-black text-indigo-500 tracking-wider mb-2">404</h1>
          <h2 className="text-2xl font-bold text-base-content">Sayfa Bulunamadı</h2>
        </div>
        
        <div className="p-8 space-y-6">
          <p className="text-base-content/70 text-sm leading-relaxed">
            Ulaşmaya çalıştığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
          </p>
          
          <Link 
            to="/" 
            className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/50 mt-4"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

