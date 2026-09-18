import type { DateReferencesSectionProps } from '../../types';

export default function DateReferencesSection({
  workType, employmentStartDate, setEmploymentStartDate, shiftEpochDate, setShiftEpochDate
}: DateReferencesSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-400 mb-4 border-b border-base-300 pb-2">2. Tarih Referansları</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control w-full">
          <label className="label pb-1"><span className="label-text font-bold text-base-content/80">İşe Başlama Tarihi</span></label>
          <input type="date" className="input input-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500" value={employmentStartDate} onChange={(e) => setEmploymentStartDate(e.target.value)} />
          <div className="p-1 mt-1">
            <span className="text-xs text-base-content/50 whitespace-normal block leading-snug">
              İşe girdiğiniz resmi tarih. Kıdem, ihbar ve yıllık izin hesaplamaları tamamen bu tarihe göre yapılır.
            </span>
          </div>
        </div>

        {!['fixed', 'yevmiye'].includes(workType) && (
          <div className="form-control w-full animate-fade-in">
            <label className="label pb-1"><span className="label-text font-bold text-base-content/80">Vardiya Döngü Başlangıcı (Milat)</span></label>
            <input type="date" className="input input-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500" value={shiftEpochDate} onChange={(e) => setShiftEpochDate(e.target.value)} />
            <div className="p-1 mt-1">
              <span className="text-xs text-base-content/50 whitespace-normal block leading-snug">
                Geçmişte veya yakın zamanda <strong>"1. Vardiya / Gündüz"</strong> vardiyasında başladığınız <strong>herhangi bir günü</strong> seçin. Takvim, vardiyalarınızı bu günden itibaren ileriye ve geriye doğru otomatik sayarak dizecektir.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
