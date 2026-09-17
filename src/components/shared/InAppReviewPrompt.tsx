import { useState, useEffect } from 'react';
import { triggerHaptic } from '../../utils/haptics';

export default function InAppReviewPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we should show it
    const hasSeenPrompt = localStorage.getItem('hasSeenReviewPrompt');
    if (hasSeenPrompt) return;

    // Show after 10 seconds of app usage (temp logic) or wait for a specific trigger
    // Better logic: show it specifically when the user calculates payroll or visits calculations.
    // For now, we listen to a custom event
    const handleTrigger = () => {
      const alreadySeen = localStorage.getItem('hasSeenReviewPrompt');
      if (!alreadySeen) {
        setIsVisible(true);
      }
    };

    window.addEventListener('trigger-inapp-review', handleTrigger);
    return () => window.removeEventListener('trigger-inapp-review', handleTrigger);
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    triggerHaptic('light');
    setIsVisible(false);
    localStorage.setItem('hasSeenReviewPrompt', 'true');
  };

  const handleReview = () => {
    triggerHaptic('success');
    setIsVisible(false);
    localStorage.setItem('hasSeenReviewPrompt', 'true');
    // For now, open a temp link
    window.open('https://play.google.com/store/apps/details?id=com.vardiyo.app', '_blank');
  };

  return (
    <div className="toast toast-bottom toast-center z-[9999] w-full px-4 sm:max-w-md pb-20 sm:pb-6">
      <div className="alert bg-indigo-900/90 border border-indigo-500/50 shadow-2xl shadow-indigo-900/50 backdrop-blur-md rounded-2xl flex flex-col items-center p-6 animate-fade-in-up relative overflow-hidden">

        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/30 mb-3 border-4 border-[#1e2329]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Uygulamamızı Beğendiniz mi?</h3>
          <p className="text-indigo-100/80 text-sm mb-6 leading-relaxed">
            Vardiyo ile emeğinizin karşılığını hesaplamak artık çok daha kolay. Bize destek olmak için Play Store'da 5 yıldız verebilirsiniz!
          </p>
        </div>

        <div className="flex w-full gap-3">
          <button onClick={handleDismiss} className="btn flex-1 btn-ghost text-indigo-200 hover:bg-white/10 hover:text-white rounded-xl">
            Sonra
          </button>
          <button onClick={handleReview} className="btn flex-1 bg-white text-indigo-900 hover:bg-indigo-50 border-none shadow-lg rounded-xl font-bold">
            Puan Ver ⭐️
          </button>
        </div>
      </div>
    </div>
  );
}

