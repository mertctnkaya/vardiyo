import type { ShiftDisplayCardProps } from '../../types/currentShift';

// Types dosyasını bozmamak için & ile isDatePaused ekliyoruz
export default function ShiftDisplayCard({ 
  currentShift, 
  shiftHours, 
  isDatePaused 
}: ShiftDisplayCardProps & { isDatePaused?: boolean }) {
  
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body items-center justify-center text-center">
        <h2 className="card-title text-base-content/80 mb-2">
          Güncel Vardiya
        </h2>

        {isDatePaused ? (
          /* YENİ: DURAKLATILMIŞ UX */
          <div className="flex flex-col items-center justify-center py-4 opacity-60 grayscale animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-warning mb-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            <h4 className="text-xl font-bold text-base-content mb-1">Takvim Askıya Alındı</h4>
            <p className="text-sm text-base-content/60">Bu tarih için mesai sayımı durduruldu.</p>
          </div>
        ) : (
          /* NORMAL VARDİYA ARAYÜZÜ */
          <>
            <div className="text-4xl font-black text-primary mt-4 mb-1">
              {currentShift.name}
            </div>

            {currentShift.id !== -1 && shiftHours && (
              <div className="text-lg font-bold text-base-content/60 mb-2 bg-base-200 px-3 py-1 rounded-md border border-base-300">
                {shiftHours}
              </div>
            )}

            {currentShift.note && (
              <div className="mt-3 font-bold px-4 py-2 rounded-lg bg-error/20 text-error border border-error/50">
                {currentShift.note}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}