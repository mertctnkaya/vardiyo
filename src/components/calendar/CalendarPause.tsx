import { useState } from 'react';

export interface CalendarPauseProps {
  isPaused: boolean;
  pausedDates?: { start: string; end: string | null } | null;
  onPauseRange: (start: string, end: string | null) => void;
  onPauseCurrentMonth: () => void;
  onResume: () => void;
  onSaveAnnualLeave: (start: string, end: string) => void;
  onClearRange: (start: string, end: string) => void; // YENİ EKLENDİ
}

export default function CalendarPause({
  isPaused,
  pausedDates,
  onPauseRange,
  onPauseCurrentMonth,
  onResume,
  onSaveAnnualLeave,
  onClearRange // YENİ EKLENDİ
}: CalendarPauseProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const isValidForLeave = startDate !== '' && endDate !== '' && startDate <= endDate;
  const isValidForPause = startDate !== '' && (endDate === '' || startDate <= endDate);

  return (
    <div className="mt-8 bg-[#1e2329] p-4 sm:p-6 rounded-2xl border border-base-300 shadow-xl w-full max-w-4xl mx-auto">
      {/* BAŞLIK KISMI AYNI */}
      <div className="mb-6 border-b border-base-300/50 pb-4">
        <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
          </svg>
          Takvim Yönetimi & İzinler
        </h3>
        <p className="text-sm text-base-content/60 mt-1">
          Toplu yıllık izin girebilir veya ücretsiz izin/askerlik gibi durumlar için takvimin mesai üretmesini durdurabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* SOL KOLON */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pt-0"><span className="label-text font-bold text-base-content/80">Başlangıç</span></label>
              <input 
                type="date" 
                className="input input-bordered input-sm sm:input-md bg-base-200 focus:border-indigo-500 transition-colors" 
                value={startDate}
                // min={today} KALDIRILDI! Artık geçmiş seçilebilir.
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) setEndDate('');
                }}
              />
            </div>
            <div className="form-control">
              <label className="label pt-0"><span className="label-text font-bold text-base-content/80">Bitiş</span></label>
              <input 
                type="date" 
                className="input input-bordered input-sm sm:input-md bg-base-200 focus:border-indigo-500 transition-colors" 
                value={endDate}
                min={startDate} // Sadece başlangıçtan öncesi seçilemez
                disabled={!startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-[#1e1b4b]/40 border border-indigo-500/30 rounded-xl p-4 flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-indigo-300 mb-1">Tarih Aralığı Seçimi</h4>
              <p className="text-xs text-indigo-200/70 leading-relaxed">
                Tarih aralığı seçtikten sonra yandaki işlemlerden birini uygulayabilirsiniz. Bitiş tarihini boş bırakırsanız işlem süresiz sayılır.
              </p>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div className="flex flex-col justify-center h-full gap-4">
          {isPaused ? (
            /* ... (Duraklatılmış durum arayüzü aynı kalacak) ... */
            <div className="bg-warning/10 border border-warning/30 p-6 rounded-xl text-center flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
              <div>
                <span className="text-warning font-bold block mb-1">Takvim Şu An Duraklatılmış Durumda</span>
                {pausedDates?.start && (
                  <span className="text-xs text-warning/70">
                    ({pausedDates.start} - {pausedDates.end || 'Süresiz'})
                  </span>
                )}
              </div>
              <button onClick={onResume} className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none w-full shadow-lg shadow-indigo-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                Sayımı Yeniden Başlat
              </button>
            </div>
          ) : (
            /* NORMAL DURUM ARAYÜZÜ (SİMETRİK 2x2 GRID) */
            <div className="flex flex-col justify-center gap-3 h-full animate-fade-in">
              
              {/* Üst Satır: İzin İşlemleri */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  disabled={!isValidForLeave}
                  onClick={() => onSaveAnnualLeave(startDate, endDate)}
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-md shadow-emerald-900/20 disabled:opacity-40 transition-all text-xs sm:text-sm"
                >
                  Yıllık İzin Gir
                </button>
                <button 
                  disabled={!isValidForLeave}
                  onClick={() => onClearRange(startDate, endDate)}
                  className="btn bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white border-none disabled:opacity-40 transition-all text-xs sm:text-sm"
                >
                  Seçili İzinleri Sil
                </button>
              </div>

              <div className="divider my-0 text-xs text-base-content/30 font-medium">VEYA</div>

              {/* Alt Satır: Duraklatma İşlemleri */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  disabled={!isValidForPause}
                  onClick={() => onPauseRange(startDate, endDate || null)}
                  className="btn bg-base-200 text-base-content hover:bg-warning/20 hover:text-warning hover:border-warning/50 border border-base-300 disabled:opacity-40 transition-all text-xs sm:text-sm"
                >
                  Aralığı Duraklat
                </button>
                <button 
                  onClick={onPauseCurrentMonth}
                  className="btn bg-base-200 text-base-content hover:bg-warning/20 hover:text-warning hover:border-warning/50 border border-base-300 transition-all text-xs sm:text-sm"
                >
                  Bu Ayı Duraklat
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}