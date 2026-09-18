import Alert from '../shared/Alert';
import type { YevmiyeSectionProps } from '../../types';

export default function YevmiyeSection({
  dailyYevmiye, setDailyYevmiye, yevmiyeBaseHours, setYevmiyeBaseHours, paymentFrequency, setPaymentFrequency, paymentDayOfWeek, setPaymentDayOfWeek
}: YevmiyeSectionProps) {
  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-bold text-indigo-400 mb-4 border-b border-base-300 pb-2">3. Yevmiye Ayarları</h3>

      <Alert color="indigo" borderStyle="colored" bgStyle="colored" className="mb-6" title="Yevmiye Sistemi Aktif" icon="info">
        Pazar günleri otomatik tatil sayılır; takvime giriş yapmadıkça hesaba katılmaz. Cumartesi günleri normal çalışma günü kabul edilir.
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="form-control w-full">
          <label className="label pb-1"><span className="label-text font-bold text-base-content/80">Günlük Yevmiye (₺)</span></label>
          <label className="input input-bordered flex items-center gap-2 bg-base-200 border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="text-indigo-400 font-bold">₺</span>
            <input type="number" className="grow font-bold text-white" placeholder="Örn: 1300" value={dailyYevmiye} onChange={(e) => setDailyYevmiye(e.target.value)} onClick={(e) => (e.target as HTMLInputElement).select()} />
          </label>
          <div className="p-1 mt-1">
            <span className="text-xs text-base-content/50 whitespace-normal block leading-snug">
              Günlük standart yevmiyeniz. Takvimde "Çalıştım" dediğiniz her gün için bu tutar birikir.
            </span>
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label"><span className="label-text font-bold text-base-content/80">Ödeme Sıklığı</span></label>
          <select className="select select-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500" value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)}>
            <option value="weekly">Her Hafta</option>
            <option value="biweekly">15 Günde Bir</option>
            <option value="daily">Her Gün (Günlük)</option>
          </select>
        </div>

        {paymentFrequency === 'weekly' && (
          <div className="form-control w-full animate-fade-in">
            <label className="label"><span className="label-text font-bold text-base-content/80">Ödeme Günü (Haftanın Hangi Günü)</span></label>
            <select className="select select-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500" value={paymentDayOfWeek} onChange={(e) => setPaymentDayOfWeek(e.target.value)}>
              <option value="1">Pazartesi</option>
              <option value="2">Salı</option>
              <option value="3">Çarşamba</option>
              <option value="4">Perşembe</option>
              <option value="5">Cuma</option>
              <option value="6">Cumartesi</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

