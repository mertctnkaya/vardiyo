/**
 * Vardiyo Premium Feature Registry
 * ──────────────────────────────────
 * Her özellik burada tanımlıdır. `isPremium: true` olan özellikler
 * sadece Premium kullanıcılara açıktır.
 *
 * Admin olarak istediğin özelliğin `isPremium` değerini false yaparak
 * o özelliği herkese ücretsiz açabilirsin — başka hiçbir dosyaya dokunmana gerek yok.
 */

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  tier: 'free' | 'pro';
  category: 'takvim' | 'hesaplama' | 'cv' | 'dışa_aktarım' | 'veri';
}

export const PREMIUM_FEATURES: Record<string, PremiumFeature> = {
  // ─── TAKVİM ───
  CALENDAR_FREEZE: {
    id: 'CALENDAR_FREEZE',
    name: 'Ay Dondurma & Kilit',
    description: 'Geçmiş ayları kilitleyerek verilerin değişmesini önler.',
    isPremium: true,
    tier: 'pro',
    category: 'takvim',
  },
  CALENDAR_BULK_CLEAR: {
    id: 'CALENDAR_BULK_CLEAR',
    name: 'Toplu Temizleme',
    description: 'Seçtiğiniz tarih aralığındaki tüm mesai kayıtlarını toplu siler.',
    isPremium: true,
    tier: 'pro',
    category: 'takvim',
  },

  // ─── HESAPLAMA ───
  SEVERANCE_CALCULATOR: {
    id: 'SEVERANCE_CALCULATOR',
    name: 'Kıdem & İhbar Tazminatı',
    description: 'Tam teşekküllü tazminat hesaplama ve simülasyon.',
    isPremium: true,
    tier: 'pro',
    category: 'hesaplama',
  },
  ANNUAL_LEAVE_ADVANCED: {
    id: 'ANNUAL_LEAVE_ADVANCED',
    name: 'Gelişmiş İzin Yönetimi',
    description: 'Toplu izin girişi ve izin bakiyesi takibi.',
    isPremium: true,
    tier: 'pro',
    category: 'hesaplama',
  },
  DATA_VISUALIZER: {
    id: 'DATA_VISUALIZER',
    name: 'Veri Görselleştirici',
    description: 'Mesai ve bordro verilerinizin grafiksel analizi.',
    isPremium: true,
    tier: 'pro',
    category: 'veri',
  },

  // ─── CV ───
  CV_UNLIMITED: {
    id: 'CV_UNLIMITED',
    name: 'Sınırsız CV Oluşturma',
    description: 'Birden fazla CV oluşturma ve düzenleme hakkı.',
    isPremium: true,
    tier: 'pro',
    category: 'cv',
  },

  // ─── DIŞA AKTARIM ───
  EXPORT_PDF: {
    id: 'EXPORT_PDF',
    name: 'PDF Dışa Aktarım',
    description: 'Mesai ve bordro dökümanlarını PDF olarak indirme.',
    isPremium: true,
    tier: 'pro',
    category: 'dışa_aktarım',
  },
  EXPORT_EXCEL: {
    id: 'EXPORT_EXCEL',
    name: 'Excel / CSV Dışa Aktarım',
    description: 'Verilerinizi tablolama programlarına aktarma.',
    isPremium: true,
    tier: 'pro',
    category: 'dışa_aktarım',
  },
};

/** Belirli bir özelliğin premium olup olmadığını kontrol eder */
export function isFeaturePremium(featureId: string): boolean {
  return PREMIUM_FEATURES[featureId]?.isPremium ?? false;
}

/** Tüm premium özelliklerin listesini döndürür (Paywall vitrini için) */
export function getProFeatures(): PremiumFeature[] {
  return Object.values(PREMIUM_FEATURES).filter((f) => f.isPremium);
}

/**
 * Global paywall anahtarı.
 * false iken HİÇBİR özellik kısıtlanmaz (herkes kullanabilir).
 * true yapıldığında premium olarak işaretlenen özellikler kısıtlanır.
 */
export const IS_PAYWALL_ACTIVE = false;

