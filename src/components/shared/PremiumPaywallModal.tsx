import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Crown, CreditCard, ChevronRight } from 'lucide-react';
import type { PremiumPaywallModalProps } from '../../types';
import { PRICING } from '../../config/pricing';
import { fetchOfferings, purchasePackage, restorePurchases, REVENUECAT_ENTITLEMENT } from '../../services/revenuecat';
import { isNative } from '../../utils/isNative';

export default function PremiumPaywallModal({ isOpen, onClose, featureName }: PremiumPaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const features = [
    'Sınırsız CV Oluşturma & Düzenleme',
    'PDF & Excel Mesai Dışa Aktarımı',
    'Kıdem & İhbar Tazminatı Hesaplayıcı',
    'Gelişmiş Veri Görselleştirici',
    'Ay Dondurma & Toplu Temizleme',
    'Öncelikli Destek'
  ];

  const handlePurchase = async () => {
    setIsProcessing(true);

    if (!isNative()) {
      alert("Premium abonelik işlemleri güvenliğiniz için Google Play üzerinden yapılmaktadır. Lütfen telefonunuza Vardiyo mobil uygulamasını indirerek satın alma işlemini gerçekleştirin.");
      setIsProcessing(false);
      return;
    }

    try {
      const packages = await fetchOfferings();
      if (!packages || packages.length === 0) {
        alert("Paketler yüklenemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
        setIsProcessing(false);
        return;
      }

      const targetIdentifier = `$rc_${selectedPlan}`;
      const selectedPackage = packages.find((p: any) => p.identifier === targetIdentifier);

      if (!selectedPackage) {
        alert("Seçilen paket şu an kullanılamıyor.");
        setIsProcessing(false);
        return;
      }

      const customerInfo = await purchasePackage(selectedPackage);
      if (customerInfo && typeof customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT] !== 'undefined') {
        alert("Tebrikler! Premium özellikleriniz başarıyla aktif edildi.");
        onClose();
        window.location.reload();
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        alert("Satın alma işlemi sırasında bir hata oluştu.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);

    if (!isNative()) {
      alert("Satın alımları geri yükleme işlemi sadece mobil uygulama (Google Play) üzerinden yapılabilmektedir.");
      setIsProcessing(false);
      return;
    }

    try {
      const customerInfo = await restorePurchases();
      if (customerInfo && typeof customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT] !== 'undefined') {
        alert("Satın alımlarınız başarıyla geri yüklendi! Premium aktif.");
        onClose();
        window.location.reload();
      } else {
        alert("Hesabınızda aktif bir Premium abonelik bulunamadı.");
      }
    } catch (error) {
      alert("Geri yükleme işlemi başarısız oldu.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <div className="bg-[#1e2329] border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative z-10 shadow-[0_0_80px_rgba(245,158,11,0.15)] w-full max-w-lg flex flex-col text-center max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Header Icon */}
        <div className="mx-auto bg-gradient-to-br from-amber-400 to-orange-600 p-4 rounded-full mb-5 shadow-lg shadow-amber-900/40">
          <Crown className="w-8 h-8 text-black" />
        </div>

        <h3 className="font-black text-3xl text-white mb-2">Vardiyo <span className="text-amber-400">Premium</span></h3>
        <p className="text-base-content/70 mb-6 text-sm">
          <strong>"{featureName}"</strong> özelliği Premium'a özeldir. Mavi yakanın dijital asistanıyla tam güce ulaşın!
        </p>

        {/* Features List */}
        <div className="text-left bg-black/40 rounded-2xl p-5 mb-6 border border-white/5 space-y-3">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-1 rounded-full shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-white/90">{feat}</span>
            </div>
          ))}
        </div>

        {/* Pricing Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            {
              id: 'monthly',
              title: 'Aylık',
              price: PRICING.PLANS.MONTHLY.price.toString(),
              subtitle: null,
              badge: null,
              highlight: false,
            },
            {
              id: 'annual',
              title: 'Yıllık',
              price: PRICING.PLANS.ANNUAL.price.toString(),
              subtitle: `${(PRICING.PLANS.ANNUAL.price / 12).toFixed(2)} TL / ay`,
              badge: '%45 İNDİRİM',
              highlight: true,
            },
            {
              id: 'lifetime',
              title: 'Ömür Boyu',
              price: PRICING.PLANS.LIFETIME.price.toString(),
              subtitle: 'Tek Seferlik',
              badge: 'SINIRSIZ',
              highlight: false,
            }
          ].map((plan) => (
            <button
              key={plan.id}
              onClick={() => !isProcessing && setSelectedPlan(plan.id as any)}
              disabled={isProcessing}
              className={`relative p-3 sm:p-4 rounded-2xl border-2 text-left transition-all overflow-hidden flex flex-col justify-center ${selectedPlan === plan.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-base-300 hover:border-amber-500/50 bg-black/20'
                } ${plan.id === 'lifetime' ? 'col-span-2 md:col-span-1' : ''} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute top-0 right-0 text-black text-[10px] font-black px-2 py-0.5 rounded-bl-lg ${plan.highlight ? 'bg-amber-500' : 'bg-indigo-400'}`}>
                  {plan.badge}
                </div>
              )}
              <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.highlight ? 'text-amber-400' : 'text-base-content/60'}`}>
                {plan.title}
              </div>
              <div className="flex items-end gap-1">
                <span className="text-xl sm:text-2xl font-black text-white">{plan.price}</span>
                <span className="text-sm text-base-content/60 mb-1">TL</span>
              </div>
              {plan.subtitle && (
                <div className="text-[10px] sm:text-xs text-base-content/50 mt-1">{plan.subtitle}</div>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-lg border-none shadow-xl shadow-amber-900/30 w-full rounded-2xl h-14"
          >
            {isProcessing ? <span className="loading loading-spinner"></span> : (
              <>
                <CreditCard className="w-5 h-5 mr-1" />
                Satın Al
              </>
            )}
          </button>

          <button
            onClick={handleRestore}
            disabled={isProcessing}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1 mt-2 disabled:opacity-50"
          >
            {isProcessing ? 'İşleniyor...' : (
              <>
                Satın Alımları Geri Yükle <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <Link to="/contact" className="text-xs text-base-content/40 hover:text-white mt-4 underline decoration-base-content/20">
            Farklı ödeme yöntemleri için yöneticiyle iletişime geç
          </Link>

          <button onClick={onClose} className="text-xs text-base-content/40 hover:text-base-content/60 mt-2 transition-colors">
            Vazgeç ve Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
