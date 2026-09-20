import type { ShiftSystemSectionProps } from '../../types';
import { useToastStore } from '../../store/useToastStore';

export default function ShiftSystemSection({
  workType, setWorkType, shiftStartTime, setShiftStartTime, shiftEndTime, setShiftEndTime,
  shiftDuration, setShiftDuration, setShiftPattern, restDays, setRestDays
}: ShiftSystemSectionProps) {

  // Vardiya Sistemlerine Göre Helper (Bilgi Notu) Metinleri
  const helperTexts: Record<string, string> = {
    'fixed': 'Kurumsal firmalar, bankalar, ofisler ve kamu dairelerinde (Hafta sonu tatil) yaygın olarak uygulanır.',
    '3-shift': 'Fabrikalar, tekstil, metal ve otomotiv gibi 24 saat üretim yapan yerlerde 3 ekiple döner.',
    '2-shift': 'Özel üretim hatlarında 12 saat çalışma, 12 saat dinlenme şeklinde 2 ekiple döner.',
    '4-shift-222': 'Kesintisiz (7/24) üretim yapan ağır sanayi, petrokimya ve cam fabrikalarında 4 ekibin dönüşümlü çalıştığı sistemdir.',
    '12-36': '1 gün çalış, 1.5 gün yat. Özel güvenlik, belediyeler ve bazı sağlık birimlerinde sık görülür.',
    '24-48': '24 saat aralıksız nöbet, 48 saat dinlenme. İtfaiye, 112 Acil, AFAD ve hastane acil servislerinde uygulanır.',
    'yevmiye': 'İnşaat, tarım veya günlük çağrı usulü çalışılan günübirlik sistemdir.'
  };

  // Kullanıcı sistemi değiştirdiğinde arka planda şablonları (pattern) otomatik ayarlıyoruz
  const handleWorkTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setWorkType(val);

    // Döngüsel sistemler için şablonları (0:Gündüz, 1:Gece, 2:Akşam, 3:24Saat, -1:Tatil) atayalım
    if (val === '4-shift-222') {
      setShiftPattern([0, 0, 1, 1, -1, -1]);
    } else if (val === '12-36') {
      setShiftPattern([0, -1]); // 1 gün gündüz, ertesi gün tam tatil
    } else if (val === '24-48') {
      setShiftPattern([3, -1, -1]); // 1 gün 24 saat nöbet, 2 gün tatil
    } else {
      // Döngüsel olmayan (Haftalık sabit) sistemlerde pattern'i temizle
      setShiftPattern([]);
      if (val === '3-shift' || val === '2-shift') {
        setRestDays([0]); // 3 veya 2 vardiya seçildiğinde izin gününü zorunlu olarak Pazar (0) yap
      } else if (val === 'fixed' || val === 'yevmiye') {
        setRestDays([0, 6]); // Sabit veya Yevmiye seçildiğinde Cumartesi (6) ve Pazar (0) default izin
      }
    }
  };

  // Sabit izin günlerini (Pzt-Pazar) değiştiren fonksiyon
  const toggleRestDay = (dayIndex: number) => {
    if (restDays.includes(dayIndex)) {
      setRestDays(restDays.filter(d => d !== dayIndex));
    } else {
      const maxDays = (workType === 'fixed' || workType === 'yevmiye') ? 2 : 1;
      if (restDays.length >= maxDays) {
        useToastStore.getState().addToast(maxDays === 1 ? "Bu vardiya sisteminde sistemin şaşmaması için en fazla 1 gün izin seçilebilir." : "Gerçekçi çalışma standartlarına göre en fazla 2 gün izin seçebilirsiniz.", 'warning');
        return;
      }
      setRestDays([...restDays, dayIndex].sort());
    }
  };

  const hideRestDaySelector = ['3-shift', '2-shift', '4-shift-222', '12-36', '24-48'].includes(workType);
  const maxAllowedDays = (workType === 'fixed' || workType === 'yevmiye') ? 2 : 1;

  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-400 mb-4 border-b border-base-300 pb-2">1. Vardiya Sistemi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* VARDİYA SİSTEMİ SEÇİCİ */}
        <div className="form-control w-full md:col-span-2">
          <label className="label"><span className="label-text font-bold text-base-content/80">Sistem Tipi</span></label>
          <select
            className="select select-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500"
            value={workType}
            onChange={handleWorkTypeChange}
          >
            <option value="fixed">Sabit Gündüz / Ofis</option>
            <option value="3-shift">3'lü Vardiya (8 Saat)</option>
            <option value="2-shift">2'li Vardiya (12 Saat)</option>
            <option value="4-shift-222">4'lü Vardiya (Örn: 2+2+2 Sistemi)</option>
            <option value="12-36">12/36 Sistemi</option>
            <option value="24-48">24/48 Sistemi</option>
            <option value="yevmiye">Yevmiye (Günlük Ücret)</option>
          </select>
          <span className="text-xs text-base-content/60 mt-2 ml-1 animate-fade-in block leading-relaxed">
            {helperTexts[workType]}
          </span>
        </div>

        {/* HAFTALIK İZİN GÜNÜ SEÇİCİ (Sadece haftalık sabit sistemlerde görünür) */}
        {!hideRestDaySelector && (
          <div className="form-control w-full md:col-span-2 animate-fade-in">
            <label className="label"><span className="label-text font-bold text-base-content/80">Haftalık İzin Günleri (Max {maxAllowedDays})</span></label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 0].map((dayIdx, i) => {
                const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
                const isSelected = restDays.includes(dayIdx);
                return (
                  <button
                    key={dayIdx}
                    type="button"
                    onClick={() => toggleRestDay(dayIdx)}
                    className={`btn btn-sm rounded-full px-4 py-1 h-auto min-h-0 ${isSelected ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md shadow-indigo-900/40' : 'bg-base-200 hover:bg-base-300 text-base-content/80 border-base-300'}`}
                  >
                    {dayNames[i]}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-base-content/50 mt-2 ml-1">İşaretlediğiniz günler takvimde "Hafta Tatili" olarak görünür ve mesai yazılmaz.</span>
          </div>
        )}

        <div className="form-control w-full">
          <label className="label pb-1"><span className="label-text font-bold text-base-content/80">Gündüz / Başlangıç Saati</span></label>
          <input type="time" className="input input-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500" value={shiftStartTime} onChange={(e) => setShiftStartTime(e.target.value)} />
          <div className="p-1 mt-1">
            <span className="text-xs text-base-content/50 whitespace-normal block leading-snug">
              Sabah vardiyasına veya mesaiye başladığınız saati (Örn: 08:00) seçin.
            </span>
          </div>
        </div>

        {workType === 'fixed' && (
          <div className="form-control w-full animate-fade-in">
            <label className="label pb-1"><span className="label-text font-bold text-base-content/80">Bitiş Saati</span></label>
            <input type="time" className="input input-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500" value={shiftEndTime} onChange={(e) => setShiftEndTime(e.target.value)} />
            <div className="p-1 mt-1">
              <span className="text-xs text-base-content/50 whitespace-normal block leading-snug">
                Mesainin bittiği saat. Saatlik izin ve geç kalma hesapları bu iki saat üzerinden yapılır.
              </span>
            </div>
          </div>
        )}

        {workType === '2-shift' && (
          <div className="form-control w-full animate-fade-in">
            <label className="label"><span className="label-text font-bold text-base-content/80">Vardiya Süresi (Saat)</span></label>
            <input type="number" className="input input-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500" placeholder="Örn: 12" value={shiftDuration} onChange={(e) => setShiftDuration(e.target.value)} />
          </div>
        )}
      </div>
    </div>
  );
}
