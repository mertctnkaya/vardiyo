import { useState } from 'react';
import { useAppStore, isPremiumUser } from '../../store/useAppStore';
import PremiumPaywallModal from '../shared/PremiumPaywallModal';

export default function SubscriptionSection() {
  const { user, settings, isRevenueCatPro } = useAppStore();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  if (!user || !settings) return null;

  const isPro = isPremiumUser(settings, isRevenueCatPro);
  const isLifetime = settings.premium_until?.includes('2099');

  const getPlanName = () => {
    if (isLifetime) return '✨ Sınırsız (Ömür Boyu)';
    if (isRevenueCatPro && (!settings.premium_until || new Date(settings.premium_until) <= new Date())) {
      return '⭐ Vardiyo Premium (Mobil Abonelik)';
    }
    if (!isPro) return 'Ücretsiz (Free)';

    if (settings.premium_until) {
      const endDate = new Date(settings.premium_until);
      const now = new Date();
      const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) return `1 Haftalık (${diffDays} gün kaldı)`;
      if (diffDays <= 31) return `1 Aylık (${diffDays} gün kaldı)`;
      if (diffDays <= 93) return `3 Aylık (${diffDays} gün kaldı)`;
      if (diffDays <= 186) return `6 Aylık (${diffDays} gün kaldı)`;
      return `Yıllık (${diffDays} gün kaldı)`;
    }

    return 'Premium';
  };

  const planName = getPlanName();
  const endDateStr = (isPro && !isLifetime && settings.premium_until)
    ? new Date(settings.premium_until).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="space-y-6 pt-6 border-t border-base-300">
      <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        Aboneliğim
      </h3>

      <div className="bg-[#1e2329] rounded-xl p-5 border border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-base-content/60 mb-1">Mevcut Planınız</p>
          <div className="flex items-center gap-2">
            <h4 className={`text-xl font-black ${isPro ? (isLifetime ? 'text-emerald-400' : 'text-indigo-400') : 'text-base-content'}`}>
              {planName}
            </h4>
            {settings.role === 'admin' && (
              <span className="badge badge-sm bg-red-900/30 text-red-400 border-red-500/30">Kurucu</span>
            )}
          </div>
          {endDateStr && (
            <p className="text-xs text-base-content/50 mt-1">
              Bitiş Tarihi: {endDateStr}
            </p>
          )}
        </div>

        {(!isLifetime || settings.role === 'admin' || user.email === 'm3rt7132@gmail.com') && (
          <button
            onClick={() => setIsPaywallOpen(true)}
            className={`btn btn-sm sm:btn-md p-2 ${isPro && !(settings.role === 'admin' && isLifetime) ? 'bg-base-300/30 text-base-content/70 hover:bg-base-300 hover:text-white border-none' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50 border-none'}`}
          >
            {settings.role === 'admin' && isLifetime
              ? '💳 Ödeme Test Et (Admin)'
              : (isPro ? 'Paketi Uzat / Yönet' : 'Premium\'a Geç')}
          </button>
        )}
      </div>

      <PremiumPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName="Vardiyo Premium"
      />
    </div>
  );
}
