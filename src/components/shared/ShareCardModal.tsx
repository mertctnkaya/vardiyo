import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useShiftCalculator } from '../../hooks/useShiftCalculator';
import { isNative } from '../../utils/isNative';
import { useAppStore } from '../../store/useAppStore';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDate: Date;
}

const DAYS_OF_WEEK = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const WORK_TYPES: Record<string, string> = {
  'fixed': 'Sabit Vardiya',
  '3-shift': '3 Vardiya Sistemi',
  '2-shift': '2 Vardiya (12 Saat)',
  '4-shift-222': '4 Vardiya (2-2-2)',
  '12-36': '12/36 Vardiya Sistemi',
  '24-48': '24/48 Vardiya Sistemi',
  'yevmiye': 'Yevmiye (Günlük)'
};

export default function ShareCardModal({ isOpen, onClose, targetDate }: ShareCardModalProps) {
  const { getShiftForDate } = useShiftCalculator();
  const { settings } = useAppStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weekDays, setWeekDays] = useState<any[]>([]);
  const [nextShiftDetails, setNextShiftDetails] = useState<{ dateStr: string, dayStr: string, shiftName: string, isNight: boolean } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    // Modal kapandığında state'i sıfırla
    if (!isOpen) {
      setGeneratedImage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(targetDate);
        currentDate.setDate(targetDate.getDate() + i);
        const shift = getShiftForDate(currentDate);

        days.push({
          dateObj: currentDate,
          dayName: DAYS_OF_WEEK[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1], // Pazartesi = 0, Pazar = 6 index'i için
          formattedDate: `${currentDate.getDate()} ${MONTHS[currentDate.getMonth()]}`,
          shiftName: shift.name === 'Hafta Tatili' ? 'Tatil' : shift.name,
          isOffDay: shift.isOffDay,
          isNight: shift.isNight
        });
      }
      setWeekDays(days);

      // Sonraki vardiyayı bul (Önümüzdeki ilk çalışan gün)
      let nextData = null;
      for (let i = 7; i <= 21; i++) {
        const d = new Date(targetDate);
        d.setDate(targetDate.getDate() + i);
        const s = getShiftForDate(d);
        if (!s.isOffDay) {
          nextData = {
            dateStr: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
            dayStr: DAYS_OF_WEEK[d.getDay() === 0 ? 6 : d.getDay() - 1],
            shiftName: s.name === 'Hafta Tatili' ? 'Tatil' : s.name,
            isNight: s.isNight
          };
          break;
        }
      }
      setNextShiftDetails(nextData);
    }
  }, [isOpen, targetDate, getShiftForDate]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#0f1115',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      // Her koşulda önce resmi ekrana bas (Web ve Native fark etmeksizin)
      setGeneratedImage(dataUrl);

      if (isNative()) {
        try {
          const base64Data = dataUrl.split(',')[1];
          const fileName = `vardiya-${new Date().getTime()}.png`;

          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache
          });

          await Share.share({
            title: 'Haftalık Vardiyam',
            text: 'Bu haftaki vardiya çizelgem.',
            url: savedFile.uri,
          });
        } catch (e) {
          console.error("Native Share error:", e);
        }
      }
    } catch (error) {
      console.error('Oluşturma hatası:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = handleShare;

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = `vardiya-cizelgem-${new Date().getTime()}.png`;
    link.href = generatedImage;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isToday = (dayObj: Date) => new Date().toDateString() === dayObj.toDateString();
  const currentWorkType = settings?.work_type ? WORK_TYPES[settings.work_type] || 'Sistem' : 'Sistem';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-base-200 rounded-3xl shadow-2xl border border-base-300 flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-300/30">
          <h3 className="font-bold text-lg text-white">Vardiya Kartı Önizleme</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-base-content/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center custom-scrollbar bg-base-100">
          <p className="text-sm text-base-content/60 mb-2 text-center">Bu görseli takımınızla veya ailenizle paylaşabilirsiniz.</p>

          <div className="md:hidden w-full max-w-sm mb-4 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-[11px] leading-tight text-indigo-200/80">Küçük ekranlarda önizleme sığmayabilir ancak oluşturduğunuz görsel <span className="font-bold text-white">tam boyutta (HD) ve net</span> olarak kaydedilir.</p>
          </div>

          {generatedImage ? (
            <div className="w-full max-w-[800px] aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/20 bg-[#0f1115]">
              <img src={generatedImage} alt="Haftalık Vardiyam" className="w-full h-full object-contain" />
            </div>
          ) : (
            <>
              {/* THE CAPTURE TARGET SCALING WRAPPER */}
              <div className="w-full max-w-[800px] aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/20 bg-[#0f1115]">
                <div
                  ref={cardRef}
                  className="capture-target absolute inset-0 bg-[#0f1115] flex flex-col p-8 md:p-10 overflow-hidden"
                  style={{ width: '800px', height: '600px', transform: 'scale(var(--scale-factor, 1))', transformOrigin: 'top left' }}
                >
                  {/* Background Glows */}
                  <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                  <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                  {/* Internal scale logic for responsive preview without breaking html2canvas */}
                  <style dangerouslySetInnerHTML={{
                    __html: `
                    @media (max-width: 840px) {
                      .bg-\\[\\#0f1115\\] > div[style*="800px"] {
                        --scale-factor: calc(100vw / 840);
                      }
                    }
                    @media (max-width: 400px) {
                      .bg-\\[\\#0f1115\\] > div[style*="800px"] {
                        --scale-factor: calc(100vw / 880);
                      }
                    }
                    /* DAISYUI OKLCH OVERRIDE: Prevent html2canvas crash */
                    :where(.capture-target *),
                    :where(.capture-target *)::before,
                    :where(.capture-target *)::after {
                      border-color: rgba(255, 255, 255, 0.1);
                      color: rgb(255, 255, 255);
                      outline-color: transparent;
                      text-decoration-color: transparent;
                    }
                  `}} />

                  <div className="flex items-center justify-between mb-6 z-10">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight uppercase">HAFTALIK VARDİYAM</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-indigo-400 font-bold text-lg tracking-wide bg-indigo-900/30 px-3 py-1 rounded-lg border border-indigo-500/30">
                          {weekDays.length > 0 ? `${weekDays[0].formattedDate} - ${weekDays[6].formattedDate}` : ''}
                        </p>
                        <span className="text-white/60 text-sm font-medium border border-white/10 rounded-lg px-3 py-1 bg-white/5">
                          {currentWorkType} ile çalışıyorum
                        </span>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-4 gap-4 mb-4 z-10">
                    {weekDays.slice(0, 4).map((day, idx) => (
                      <div key={idx} className={`relative rounded-2xl p-4 flex flex-col justify-between border overflow-hidden ${day.isOffDay ? 'bg-emerald-900/20 border-emerald-500/40' : (isToday(day.dateObj) ? 'bg-indigo-900/40 border-indigo-500/60 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-[#16191d] border-white/10')}`}>
                        {day.isOffDay && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white/60">{day.dayName}</span>
                            {isToday(day.dateObj) && <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-black bg-indigo-500 text-white rounded">Bugün</span>}
                          </div>
                          <div className={`text-2xl font-black mt-1 ${isToday(day.dateObj) ? 'text-white' : 'text-white/90'}`}>{day.formattedDate}</div>
                        </div>
                        <div className={`text-xl font-bold mt-4 ${day.isOffDay ? 'text-emerald-400' : (day.isNight ? 'text-amber-400' : (isToday(day.dateObj) ? 'text-indigo-300' : 'text-white'))}`}>
                          {day.shiftName}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 grid grid-cols-4 gap-4 z-10">
                    {weekDays.slice(4, 7).map((day, idx) => (
                      <div key={idx} className={`relative rounded-2xl p-4 flex flex-col justify-between border overflow-hidden ${day.isOffDay ? 'bg-emerald-900/20 border-emerald-500/40' : (isToday(day.dateObj) ? 'bg-indigo-900/40 border-indigo-500/60 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-[#16191d] border-white/10')}`}>
                        {day.isOffDay && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white/60">{day.dayName}</span>
                            {isToday(day.dateObj) && <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-black bg-indigo-500 text-white rounded">Bugün</span>}
                          </div>
                          <div className={`text-2xl font-black mt-1 ${isToday(day.dateObj) ? 'text-white' : 'text-white/90'}`}>{day.formattedDate}</div>
                        </div>
                        <div className={`text-xl font-bold mt-4 ${day.isOffDay ? 'text-emerald-400' : (day.isNight ? 'text-amber-400' : (isToday(day.dateObj) ? 'text-indigo-300' : 'text-white'))}`}>
                          {day.shiftName}
                        </div>
                      </div>
                    ))}

                    {/* Sonraki Hafta Özeti Kutusu */}
                    <div className="rounded-2xl p-4 flex flex-col justify-center items-center border border-dashed border-white/20 bg-white/5 text-center">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Sonraki Vardiya</span>
                      <span className="text-sm font-semibold text-white/60 mb-1">{nextShiftDetails ? `${nextShiftDetails.dateStr}, ${nextShiftDetails.dayStr}` : '-'}</span>
                      <span className={`text-xl font-black ${nextShiftDetails?.isNight ? 'text-amber-400' : 'text-white/90'}`}>{nextShiftDetails?.shiftName || '-'}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between opacity-50 z-10">
                    <span className="text-sm font-semibold text-white tracking-[0.2em]">VARDİYO İLE PLANLANDI</span>
                    <span className="text-xs font-medium text-white/60">vardiyo.vercel.app & on App/Play Store</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-base-300 bg-base-300/50 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost hover:bg-white/5 text-base-content/80">
            {generatedImage ? 'Kapat' : 'İptal'}
          </button>

          {generatedImage ? (
            <button
              onClick={handleDownload}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-900/50 min-w-[160px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cihaza İndir
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/50 min-w-[160px]"
            >
              {isGenerating ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Görseli Paylaş
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
