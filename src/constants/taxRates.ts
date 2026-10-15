/**
 * Türkiye Vergi ve SGK Mevzuatı Sabitleri (Gelir Vergisi Kanunu 103, 23/18 vb.)
 */

export interface TaxBracket {
  limit: number; // Kümülatif üst sınır (TL). Son dilim için Infinity.
  rate: number;  // Gelir vergisi oranı (örn: 0.15)
}

/**
 * 2025/2026 Gelir Vergisi Dilimleri (Ücret Gelirleri İçin GVK 103)
 * 1. Dilim: 158.000 TL'ye kadar %15
 * 2. Dilim: 380.000 TL'nin 158.000 TL'si için 23.700 TL, fazlası %20
 * 3. Dilim: 1.400.000 TL'nin 380.000 TL'si için 68.100 TL, fazlası %27 (Ücretliler için)
 * 4. Dilim: 4.300.000 TL'nin 1.400.000 TL'si için 343.500 TL, fazlası %35
 * 5. Dilim: 4.300.000 TL'den fazlasının 4.300.000 TL'si için 1.358.500 TL, fazlası %40
 */
export const TAX_BRACKETS: TaxBracket[] = [
  { limit: 158000, rate: 0.15 },
  { limit: 380000, rate: 0.20 },
  { limit: 1400000, rate: 0.27 },
  { limit: 4300000, rate: 0.35 },
  { limit: Infinity, rate: 0.40 }
];

/**
 * Asgari Ücret Vergi İstisnaları (GVK Madde 23/18):
 * 2026/2025 Brüt Asgari Ücret: 26.005,50 TL
 * Aylık SGK Primi (%14): 3.640,77 TL
 * Aylık İşsizlik Fonu (%1): 260,06 TL
 * Aylık Vergi Matrahı: 22.104,67 TL
 * Damga Vergisi İstisnası: 197,38 TL (veya binde 7,59)
 * 
 * Asgari ücretlinin kümülatif matrahı 8. ayda (Ağustos) 158.000 TL sınırını aşarak %20 dilimine girer.
 * Bu nedenle Ağustos - Aralık döneminde asgari ücret gelir vergisi istisnası artar.
 */
export const MONTHLY_MIN_WAGE_GV_EXEMPTIONS: Record<number, number> = {
  0: 3315.70, // Ocak (0-indeksli)
  1: 3315.70, // Şubat
  2: 3315.70, // Mart
  3: 3315.70, // Nisan
  4: 3315.70, // Mayıs
  5: 3315.70, // Haziran
  6: 3315.70, // Temmuz
  7: 3570.83, // Ağustos (Dilim geçişi başlangıcı)
  8: 4420.93, // Eylül (%20 tam dilim)
  9: 4420.93, // Ekim
  10: 4420.93, // Kasım
  11: 4420.93  // Aralık
};

export const TAX_CONSTANTS = {
  STAMP_TAX_RATE: 0.00759,
  INCOME_TAX_TIER_1: 0.15,
  HOURLY_CALC_NET_LIMIT: 4462.03,
  HOURLY_CALC_COEF_1: 0.71491,
  HOURLY_CALC_COEF_2: 0.85,
  SGK_RATE: 0.14,
  UNEMPLOYMENT_RATE: 0.01,
  TAX_RATE_TIER_1: 0.15,
  MIN_WAGE_GV_EXEMPTION: 3315.70, // Varsayılan 1. dilim istisnası
  MIN_WAGE_DV_EXEMPTION: 197.38   // Damga vergisi istisnası (26.005,50 * 0.00759)
};
