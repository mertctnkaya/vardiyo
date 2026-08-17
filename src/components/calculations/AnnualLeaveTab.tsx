import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { updateUserSettings } from '../../services/dbService';
import { supabase } from '../../lib/supabaseClient';
import Alert from '../shared/Alert';
import PremiumPaywallModal from '../shared/PremiumPaywallModal';
import { IS_PAYWALL_ACTIVE } from '../../config/features';

export default function AnnualLeaveTab() {
  const { settings, user, setSettings } = useAppStore();
  
  const [knownLeaveBalance, setKnownLeaveBalance] = useState('');
  const [isSavingLeave, setIsSavingLeave] = useState(false);
  const [leaveFeedback, setLeaveFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [calendarUsedLeave, setCalendarUsedLeave] = useState(0);

  // Premium Kontrolleri
  const [showPaywall, setShowPaywall] = useState(false);
  const isPremiumOrAdmin = settings?.role === 'admin' || (settings?.premium_until && new Date(settings.premium_until) > new Date());
  const hasAccess = !IS_PAYWALL_ACTIVE || isPremiumOrAdmin;

  useEffect(() => {
    const fetchCalendarLeaves = async () => {
      if (!user) return;
      const { count, error } = await supabase.from('work_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'annual_leave');
      if (!error && count !== null) setCalendarUsedLeave(count);
    };
    fetchCalendarLeaves();
  }, [user]);

  if (!settings?.employment_start_date) {
    return (
      <Alert color="amber" title="Eksik Bilgi" icon="warning">
        Yıllık izin hesaplayabilmek için Ayarlar sayfasından "İşe Başlama Tarihi" bilginizi doldurmanız gerekmektedir.
      </Alert>
    );
  }

  const start = new Date(settings.employment_start_date);
  const today = new Date();
  const yearsWorked = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  let earnedLeave = 0;
  for (let i = 1; i <= yearsWorked; i++) {
    if (i <= 5) earnedLeave += 14;
    else if (i < 15) earnedLeave += 20;
    else earnedLeave += 26;
  }

  const nextLeaveDate = new Date(start);
  nextLeaveDate.setFullYear(start.getFullYear() + yearsWorked + 1);
  const nextLeaveDays = (yearsWorked + 1) <= 5 ? 14 : ((yearsWorked + 1) < 15 ? 20 : 26);

  const pastUsed = settings.past_used_leave || 0;
  const totalUsedLeave = pastUsed + calendarUsedLeave; 
  const remainingLeave = earnedLeave - totalUsedLeave;

  const saveLeaveBalance = async () => {
    if (!hasAccess) return setShowPaywall(true);
    if (!user || knownLeaveBalance === '') return;
    setIsSavingLeave(true);

    const targetBalance = Number(knownLeaveBalance);
    const requiredTotalUse = Math.max(0, earnedLeave - targetBalance);
    const pastUsedCalculated = Math.max(0, requiredTotalUse - calendarUsedLeave);

    const { error, data } = await updateUserSettings(user.id, { past_used_leave: pastUsedCalculated });

    if (!error && data) {
      setSettings(data);
      setLeaveFeedback({ type: 'success', message: 'İzin bakiyeniz kusursuzca eşitlendi!' });
      setTimeout(() => { setLeaveFeedback(null); setKnownLeaveBalance(''); }, 3000);
    } else {
      setLeaveFeedback({ type: 'error', message: 'Hata oluştu: ' + (error?.message || '') });
      setTimeout(() => setLeaveFeedback(null), 3000);
    }
    setIsSavingLeave(false);
  };

  const resetLeaveBalance = async () => {
    if (!hasAccess) return setShowPaywall(true);
    if (!user) return;
    setIsSavingLeave(true);
    const { error, data } = await updateUserSettings(user.id, { past_used_leave: 0 });

    if (!error && data) {
      setSettings(data);
      setLeaveFeedback({ type: 'success', message: 'Geçmiş izin kullanımları sıfırlandı!' });
      setTimeout(() => setLeaveFeedback(null), 3000);
    }
    setIsSavingLeave(false);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in px-2 sm:px-0">
      {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && (
        <Alert color="amber" title="Premium Özellik" icon="warning" bgStyle="colored">
          Gelişmiş Bakiye Eşitleme Aracı Premium kullanıcılara özeldir.
        </Alert>
      )}

      <div className="bg-[#1e2329] rounded-xl border border-base-300 p-6 sm:p-8 shadow-lg">
        {/* ... (Yıllık İzin Kartları eskisi gibi aynı kalacak) ... */}
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-2xl font-bold text-pink-400">Yıllık İzin Durumu</h3>
          <div className="text-right">
            <p className="text-xs text-base-content/50">Sonraki Hakediş Tarihi</p>
            <p className="font-bold text-base-content/80">{nextLeaveDate.toLocaleDateString('tr-TR')} <span className="text-emerald-400">(+{nextLeaveDays} Gün)</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#16191d] p-5 rounded-xl border border-base-300 shadow-md">
            <p className="text-xs text-base-content/60 font-bold mb-1">Mevcut Kıdem</p>
            <p className="text-3xl font-bold text-base-content">{yearsWorked} <span className="text-lg">Yıl</span></p>
          </div>
          <div className="bg-[#16191d] p-5 rounded-xl border border-base-300 shadow-md">
            <p className="text-xs text-base-content/60 font-bold mb-1">Yasal Toplam Hakediş</p>
            <p className="text-3xl font-bold text-emerald-400">{earnedLeave} <span className="text-lg">Gün</span></p>
          </div>
          <div className="bg-[#16191d] p-5 rounded-xl border border-base-300 shadow-md flex flex-col justify-center">
            <p className="text-[10px] text-base-content/60 font-bold mb-1">TOPLAM KULLANILAN İZİN</p>
            <p className="text-2xl font-bold text-amber-500">{totalUsedLeave} <span className="text-lg">Gün</span></p>
            <p className="text-[9px] text-base-content/40 mt-1">Takvim: {calendarUsedLeave} | Geçmiş: {pastUsed}</p>
          </div>
          <div className="bg-pink-900/10 p-5 rounded-xl border border-pink-500/30 ring-2 ring-pink-500/20 shadow-inner">
            <p className="text-xs text-pink-400/80 font-bold mb-1">Kalan Net İzin Bakiyesi</p>
            <p className="text-3xl font-black text-pink-400">{remainingLeave} <span className="text-lg">Gün</span></p>
          </div>
        </div>
      </div>

      <div className="bg-[#16191d] rounded-xl border border-base-300 p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-base-content mb-1">Bakiye Eşitleme Aracı</h4>
          <p className="text-sm text-base-content/60">Eğer sistemdeki kalan izniniz gerçekle uyuşmuyorsa <strong>güncel kalan bakiyenizi</strong> girin. Sistem takvimdeki kullanımlarınızı hesaba katarak veritabanını eşitleyecektir.</p>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <input type="number" min="0" className="input p-2 input-bordered bg-base-200 flex-1 focus:ring-2 focus:ring-pink-500" placeholder="Gerçek bakiyem (Gün)" value={knownLeaveBalance} onChange={(e) => setKnownLeaveBalance(e.target.value)} />
            
            <button className="btn p-4 bg-pink-600 hover:bg-pink-700 text-white border-none shadow-lg shadow-pink-900/40" onClick={saveLeaveBalance} disabled={isSavingLeave || knownLeaveBalance === ''}>
              {isSavingLeave ? <span className="loading loading-spinner"></span> : 'Eşitle'}
              {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="ml-1 text-[10px] bg-pink-900/40 px-1 rounded text-pink-200">PRO</span>}
            </button>

            <button className="btn p-4 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-900/40" title="Sıfırla" onClick={resetLeaveBalance} disabled={isSavingLeave}>
              Sıfırla
              {IS_PAYWALL_ACTIVE && !isPremiumOrAdmin && <span className="ml-1 text-[10px] bg-red-900/40 px-1 rounded text-red-200">PRO</span>}
            </button>
          </div>
          {leaveFeedback && <div className={`p-2 rounded-lg text-xs font-bold text-center animate-fade-in ${leaveFeedback.type === 'success' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>{leaveFeedback.message}</div>}
        </div>
      </div>
      
      <PremiumPaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} featureName="İzin Bakiyesi Eşitleme" />
    </div>
  );
}