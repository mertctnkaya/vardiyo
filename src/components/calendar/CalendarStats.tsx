import type { CalendarStatsProps } from "../../types";
import { useState } from "react";

export default function CalendarStats({ monthlyStats, baseDate }: CalendarStatsProps) {
  const [activeModal, setActiveModal] = useState<'overtime' | 'late' | null>(null);

  const formatItemType = (item: any) => {
    if (item.isHoliday) return 'Resmi Tatil';
    if (item.isWeekend) return 'Hafta Sonu';
    return 'Hafta İçi';
  };

  const hasOvertimeDetails = monthlyStats.overtimeDetails && monthlyStats.overtimeDetails.length > 0;
  const hasLateDetails = monthlyStats.lateDetails && monthlyStats.lateDetails.length > 0;

  return (
    <>
      {monthlyStats.isDangerAbsent && (
        <div className="w-full max-w-4xl mt-6 bg-red-900/10 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm animate-fade-in flex gap-4 items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-bold text-red-500 text-lg">Yasal Uyarı: Devamsızlık Tehlike Sınırı!</h4>
            <p className="text-sm text-base-content/80 mt-1">
              Bu ay içerisinde <strong>{monthlyStats.maxConsecutiveAbsent >= 2 ? 'ardı ardına 2 gün' : 'toplam 3 gün'}</strong> devamsızlık yaptığınız tespit edildi. İş Kanunu Madde 25/II gereğince; mazeretsiz devamsızlıklar işverene <strong className="text-red-400">Tazminatsız Haklı Fesih (İşten Çıkarma)</strong> hakkı tanır. Lütfen durumunuzu yöneticinizle görüşün.
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mt-6 bg-[#16191d] rounded-xl border border-base-300 p-6 shadow-lg animate-fade-in">
        <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          {new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(baseDate)} Ayı Özet Raporu
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center">
            <p className="text-xs text-base-content/60 font-bold mb-1">Normal Mesai</p>
            <p className="text-xl font-bold text-emerald-400">{monthlyStats.normal} Gün</p>
          </div>
          <div className="bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center">
            <p className="text-xs text-base-content/60 font-bold mb-1">Hafta Tatili</p>
            <p className="text-xl font-bold text-base-content">{monthlyStats.weekendPaid} Gün</p>
          </div>
          
          <div 
            onClick={() => hasOvertimeDetails ? setActiveModal('overtime') : null}
            className={`bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center ${hasOvertimeDetails ? 'cursor-pointer hover:border-green-500/50 hover:bg-green-900/10 transition-colors relative group' : ''}`}
          >
            <p className="text-xs text-base-content/60 font-bold mb-1">Fazla Mesai</p>
            <p className="text-xl font-bold text-green-400">{monthlyStats.overtimeHours} Saat</p>
            {hasOvertimeDetails && (
              <div className="absolute top-2 right-2 text-green-500/50 group-hover:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            )}
          </div>

          <div className="bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center">
            <p className="text-xs text-base-content/60 font-bold mb-1">Resmi Tatil</p>
            <p className="text-xl font-bold text-yellow-300">{monthlyStats.holidayWork} Gün</p>
          </div>
          <div className="bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center">
            <p className="text-xs text-base-content/60 font-bold mb-1">Yıllık İzin</p>
            <p className="text-xl font-bold text-pink-400">{monthlyStats.annualLeave} Gün</p>
          </div>
          <div className="bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center">
            <p className="text-xs text-base-content/60 font-bold mb-1">Ücretli/Rapor</p>
            <p className="text-xl font-bold text-purple-400">{monthlyStats.leave} Gün</p>
          </div>
          
          <div 
            onClick={() => hasLateDetails ? setActiveModal('late') : null}
            className={`bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center ${hasLateDetails ? 'cursor-pointer hover:border-orange-500/50 hover:bg-orange-900/10 transition-colors relative group' : ''}`}
          >
            <p className="text-xs text-base-content/60 font-bold mb-1">Geç/Eksik</p>
            <p className="text-xl font-bold text-orange-400">{monthlyStats.lateHours} Saat</p>
            {hasLateDetails && (
              <div className="absolute top-2 right-2 text-orange-500/50 group-hover:text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            )}
          </div>

          <div className="bg-[#1e2329] p-4 rounded-lg border border-base-300 text-center">
            <p className="text-xs text-base-content/60 font-bold mb-1">Devamsızlık</p>
            <p className="text-xl font-bold text-red-400">{monthlyStats.absent} Gün</p>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="bg-[#16191d] border border-base-300 rounded-2xl p-6 relative z-10 shadow-2xl w-full max-w-sm animate-fade-in max-h-[80vh] flex flex-col">
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${activeModal === 'overtime' ? 'text-green-400' : 'text-orange-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {activeModal === 'overtime' ? 'Fazla Mesai Detayları' : 'Geç/Eksik Mesai Detayları'}
            </h3>
            
            <div className="overflow-y-auto pr-1 flex-1 space-y-3 mb-4 custom-scrollbar">
              {(activeModal === 'overtime' ? monthlyStats.overtimeDetails : monthlyStats.lateDetails)?.map((item: any, idx: number) => (
                <div key={idx} className="bg-[#1e2329] border border-base-300 p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-sm">
                      {new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }).format(item.date)}
                    </p>
                    {activeModal === 'overtime' && (
                      <p className="text-xs text-base-content/60 mt-0.5">{formatItemType(item)}</p>
                    )}
                  </div>
                  <div className={`font-black text-lg ${activeModal === 'overtime' ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.hours} Saat
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-base-300 flex justify-between items-center shrink-0">
              <span className="text-base-content/60 font-medium">Toplam</span>
              <span className={`text-2xl font-black ${activeModal === 'overtime' ? 'text-green-500' : 'text-orange-500'}`}>
                {activeModal === 'overtime' ? monthlyStats.overtimeHours : monthlyStats.lateHours} Saat
              </span>
            </div>
            
            <button 
              onClick={() => setActiveModal(null)}
              className="btn btn-block bg-base-200 hover:bg-base-300 text-base-content border-none mt-4"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
