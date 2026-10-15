import { TAX_BRACKETS, MONTHLY_MIN_WAGE_GV_EXEMPTIONS, TAX_CONSTANTS, type TaxBracket } from '../constants/taxRates';

export interface TaxCalculationParams {
  previousCumulativeBase: number;
  currentMonthBase: number;
  monthIndex: number; // 0: Ocak, ..., 11: Aralık
}

export interface TaxBracketBreakdownItem {
  bracketRate: number; // örn: 0.15
  portionAmount: number; // örn: 20000
  taxAmount: number; // örn: 3000
}

export interface CumulativeTaxResult {
  taxBase: number;                    // Bu ayın saf vergi matrahı
  previousCumulativeBase: number;     // Önceki aylardan devreden kümülatif matrah
  newCumulativeBase: number;          // Bu ay sonu yeni kümülatif matrah
  taxRaw: number;                     // İstisna öncesi hesaplanan brüt gelir vergisi
  exemption: number;                  // Asgari ücret vergi istisnası
  taxFinal: number;                   // Net maaştan kesilecek nihai gelir vergisi
  effectiveRate: number;              // Efektif vergi oranı (%)
  activeBracketLabel: string;         // Örn: "%15", "%20", "%15 -> %20 (Dilim Geçişi)"
  isBracketCrossed: boolean;          // Bu ay dilim atlandı mı?
  breakdown: TaxBracketBreakdownItem[]; // Parçalı vergi hesabı detayı
}

/**
 * 0'dan x kümülatif matrahına kadar olan toplam kümülatif gelir vergisini hesaplar.
 */
export const calculateTotalTaxUpTo = (cumulativeAmount: number, brackets: TaxBracket[] = TAX_BRACKETS): number => {
  if (cumulativeAmount <= 0) return 0;
  
  let totalTax = 0;
  let lowerLimit = 0;

  for (const bracket of brackets) {
    if (cumulativeAmount <= lowerLimit) break;

    const taxableChunk = Math.min(cumulativeAmount, bracket.limit) - lowerLimit;
    if (taxableChunk > 0) {
      totalTax += taxableChunk * bracket.rate;
    }

    if (cumulativeAmount <= bracket.limit) {
      break;
    }
    lowerLimit = bracket.limit;
  }

  return totalTax;
};

/**
 * Kümülatif Gelir Vergisi Matrahı Dilim ve İstisna Motoru
 * Türk Vergi Mevzuatı (GVK 103 ve 23/18) uyarınca parçalı dilim ve asgari ücret istisnası işletir.
 */
export const calculateProgressiveIncomeTax = ({
  previousCumulativeBase,
  currentMonthBase,
  monthIndex
}: TaxCalculationParams): CumulativeTaxResult => {
  const safePrev = Math.max(0, Number(previousCumulativeBase) || 0);
  const safeBase = Math.max(0, Number(currentMonthBase) || 0);
  const newCumulative = safePrev + safeBase;

  if (safeBase <= 0) {
    return {
      taxBase: 0,
      previousCumulativeBase: safePrev,
      newCumulativeBase: safePrev,
      taxRaw: 0,
      exemption: 0,
      taxFinal: 0,
      effectiveRate: 0,
      activeBracketLabel: '%15',
      isBracketCrossed: false,
      breakdown: []
    };
  }

  // 1. Dilim bazlı parçalı hesaplama ve döküm
  const breakdown: TaxBracketBreakdownItem[] = [];
  let lowerLimit = 0;
  let initialBracketRate: number | null = null;
  let finalBracketRate: number | null = null;

  for (const bracket of TAX_BRACKETS) {
    const chunkStart = Math.max(safePrev, lowerLimit);
    const chunkEnd = Math.min(newCumulative, bracket.limit);

    if (chunkEnd > chunkStart) {
      const portion = chunkEnd - chunkStart;
      const tax = portion * bracket.rate;
      breakdown.push({
        bracketRate: bracket.rate,
        portionAmount: portion,
        taxAmount: tax
      });

      if (initialBracketRate === null) initialBracketRate = bracket.rate;
      finalBracketRate = bracket.rate;
    }

    if (newCumulative <= bracket.limit) {
      break;
    }
    lowerLimit = bracket.limit;
  }

  // 2. Ham Vergi Tutarı
  const taxRaw = breakdown.reduce((sum, item) => sum + item.taxAmount, 0);

  // 3. Dilim etiketi ve geçiş durumu
  const isBracketCrossed = breakdown.length > 1;
  let activeBracketLabel = '%15';
  if (breakdown.length === 1 && finalBracketRate !== null) {
    activeBracketLabel = `%${Math.round(finalBracketRate * 100)}`;
  } else if (breakdown.length > 1 && initialBracketRate !== null && finalBracketRate !== null) {
    activeBracketLabel = `%${Math.round(initialBracketRate * 100)} → %${Math.round(finalBracketRate * 100)} (Geçiş)`;
  }

  // 4. Asgari Ücret Vergi İstisnası Mahsubu (GVK 23/18)
  const safeMonth = Math.min(11, Math.max(0, monthIndex));
  const rawExemption = MONTHLY_MIN_WAGE_GV_EXEMPTIONS[safeMonth] ?? TAX_CONSTANTS.MIN_WAGE_GV_EXEMPTION;
  
  // İstisna tutarı ham vergiden fazla olamaz (vergi eksiye düşemez)
  const taxFinal = Math.max(0, taxRaw - rawExemption);
  const actualExemptionApplied = Math.min(taxRaw, rawExemption);

  // 5. Efektif vergi oranı
  const effectiveRate = safeBase > 0 ? (taxFinal / safeBase) * 100 : 0;

  return {
    taxBase: safeBase,
    previousCumulativeBase: safePrev,
    newCumulativeBase: newCumulative,
    taxRaw,
    exemption: actualExemptionApplied,
    taxFinal,
    effectiveRate: Number(effectiveRate.toFixed(2)),
    activeBracketLabel,
    isBracketCrossed,
    breakdown
  };
};

/**
 * Kullanıcının seçili aydan önceki aylardaki kümülatif vergi matrahını hesaplar.
 * settings.starting_tax_base varsa üzerine ekler.
 * Geçmiş ayların takvim puantajından veya aylık standart brütünden (30 gün) matrah türetir.
 */
export const estimatePriorMonthsTaxBase = (
  settings: any,
  year: number,
  currentMonthIndex: number, // 0: Ocak, 1: Şubat...
  priorLogs: any[] = []
): number => {
  const startingOverride = Number(settings?.starting_tax_base) || 0;
  if (currentMonthIndex === 0) {
    return startingOverride;
  }

  const dailyGross = Number(settings?.daily_wage) || 0;
  const standardMonthlyGross = dailyGross * 30;
  const sgkAndUnempRate = TAX_CONSTANTS.SGK_RATE + TAX_CONSTANTS.UNEMPLOYMENT_RATE; // %15
  const standardMonthlyTaxBase = Math.max(0, standardMonthlyGross * (1 - sgkAndUnempRate));

  // Eğer geçmiş loglar verilmişse log_date gruplayarak daha hassas hesapla
  let accumulatedBase = startingOverride;

  const logsByMonth: Record<number, any[]> = {};
  priorLogs.forEach(log => {
    if (!log.log_date) return;
    const [lY, lM] = log.log_date.split('-').map(Number);
    if (lY === year && lM - 1 < currentMonthIndex) {
      const mIdx = lM - 1;
      if (!logsByMonth[mIdx]) logsByMonth[mIdx] = [];
      logsByMonth[mIdx].push(log);
    }
  });

  const empDateStr = settings?.employment_start_date;
  let empMonthIndex = 0;
  if (empDateStr) {
    const [eY, eM] = empDateStr.split('-').map(Number);
    if (eY === year) {
      empMonthIndex = Math.max(0, eM - 1);
    } else if (eY > year) {
      return startingOverride;
    }
  }

  for (let m = empMonthIndex; m < currentMonthIndex; m++) {
    const monthLogs = logsByMonth[m];
    if (monthLogs && monthLogs.length > 0) {
      // O ayda girilmiş devamsızlık ve mesaileri hesaba kat
      let absentDays = 0;
      let lateHours = 0;
      let otHours = 0;
      monthLogs.forEach(l => {
        if (l.status === 'absent') absentDays++;
        else if (l.status === 'late') lateHours += Number(l.hours) || 0;
        else if (l.status === 'overtime') otHours += Number(l.hours) || 0;
      });
      const hourlyGross = dailyGross / (Number(settings?.base_work_hours) || 7.5);
      const deductions = (absentDays * dailyGross) + (lateHours * hourlyGross);
      const grossWithOt = Math.max(0, standardMonthlyGross - deductions + (otHours * hourlyGross * 1.5));
      accumulatedBase += grossWithOt * (1 - sgkAndUnempRate);
    } else {
      // Log girilmemiş geçmiş aylar tam standart matrah sayılır
      accumulatedBase += standardMonthlyTaxBase;
    }
  }

  return Math.round(accumulatedBase * 100) / 100;
};
