import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] animate-fade-in">
      <div className="bg-indigo-900 border border-indigo-500/50 shadow-2xl shadow-indigo-900/50 rounded-xl p-4 max-w-sm flex flex-col gap-3">
        <div className="flex gap-3 items-start">
          <div className="bg-indigo-500/20 p-2 rounded-full shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Yeni Sürüm Mevcut!</h4>
            <p className="text-indigo-200/80 text-xs mt-1">Uygulamanın yeni bir versiyonu var. Daha iyi bir deneyim için hemen güncelleyin.</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => setNeedRefresh(false)} 
            className="btn btn-sm btn-ghost text-indigo-300 hover:bg-indigo-800/50"
          >
            Sonra
          </button>
          <button 
            onClick={() => updateServiceWorker(true)} 
            className="btn btn-sm bg-indigo-500 hover:bg-indigo-400 text-white border-none shadow-lg shadow-indigo-900/50"
          >
            Yenile
          </button>
        </div>
      </div>
    </div>
  );
}

