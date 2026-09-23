import { useState } from 'react';
import type { AdminUser } from '../../types';

interface UserManageModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onGrantPremium: (userId: string, monthsToAdd: number) => void;
  onDeleteAccount: (id: string, email: string) => void;
  onSendNotification?: (userId: string, message: string) => void;
}

export default function UserManageModal({ user, isOpen, onClose, onGrantPremium, onDeleteAccount, onSendNotification }: UserManageModalProps) {
  const [notifMessage, setNotifMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const isPremium = user.premium_until && new Date(user.premium_until) > new Date();
  const isLifetime = user.premium_until?.includes('2099');
  const isActive = (user.has_settings && (user.logs_count ?? 0) > 0);
  const displayName = user.name || user.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Bilinmiyor';

  const getPlanLabel = (): string => {
    if (!isPremium) return 'Ücretsiz';
    if (isLifetime) return '✨ Sınırsız';
    const endDate = new Date(user.premium_until!);
    const now = new Date();
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 31) return `1 Aylık (${diffDays} gün kaldı)`;
    if (diffDays <= 93) return `3 Aylık (${diffDays} gün kaldı)`;
    if (diffDays <= 186) return `6 Aylık (${diffDays} gün kaldı)`;
    return `Yıllık (${diffDays} gün kaldı)`;
  };

  const handleSendNotif = async () => {
    if (!notifMessage.trim() || !onSendNotification) return;
    setIsSending(true);
    await onSendNotification(user.id, notifMessage.trim());
    setNotifMessage('');
    setIsSending(false);
  };



  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-[#16191d] border border-white/5 rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-300/50 text-base-content/60 hover:bg-red-500/20 hover:text-red-400 border-none z-20"
        >
          ✕
        </button>

        {/* Top: Header — User Info */}
        <div className="p-6 border-b border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold text-base-content truncate">{displayName}</p>
              <p className="text-sm text-base-content/60 truncate">{user.email}</p>
              <p className="text-xs text-base-content/40 mt-1">Üyelik: {memberSince}</p>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 sm:justify-end">
              <span className={`badge gap-1 ${isActive ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-red-900/30 text-red-400 border-red-500/30'}`}>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {isActive ? 'Aktif' : 'Pasif'}
              </span>
              {(user.logs_count ?? 0) > 0 && (
                <span className="badge bg-blue-900/30 text-blue-400 border-blue-500/30">
                  {user.logs_count} mesai
                </span>
              )}
              {(user.cvs_count ?? 0) > 0 && (
                <span className="badge bg-violet-900/30 text-violet-400 border-violet-500/30">
                  {user.cvs_count} CV
                </span>
              )}
              {user.role === 'admin' && (
                <span className="badge bg-purple-900/30 text-purple-400 border-purple-500/30">Kurucu</span>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Premium & Notification Side by Side */}
        <div className="flex flex-col md:flex-row border-b border-white/5">
          {/* Left: Premium Management */}
          <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/5">
            <h3 className="text-sm font-bold text-base-content/70 uppercase tracking-wider mb-4">Premium Yönetimi</h3>

            <div className={`text-sm font-medium mb-5 px-4 py-3 rounded-xl ${isPremium ? 'bg-amber-900/10 text-amber-400 border border-amber-500/30' : 'bg-base-300/20 text-base-content/50 border border-white/5'}`}>
              Mevcut Plan: {getPlanLabel()}
              {isPremium && !isLifetime && user.premium_until && (
                <span className="block text-xs text-base-content/40 mt-1">
                  Bitiş: {new Date(user.premium_until).toLocaleDateString('tr-TR')}
                </span>
              )}
            </div>

            {user.role !== 'admin' && (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button onClick={() => onGrantPremium(user.id, 1)} className="btn btn-sm p-3 bg-sky-900/20 text-sky-400 hover:bg-sky-600 hover:text-white border border-sky-500/30">1 Ay</button>
                  <button onClick={() => onGrantPremium(user.id, 3)} className="btn btn-sm p-3 bg-indigo-900/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30">3 Ay</button>
                  <button onClick={() => onGrantPremium(user.id, 6)} className="btn btn-sm p-3 bg-fuchsia-900/20 text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white border border-fuchsia-500/30">6 Ay</button>
                  <button onClick={() => onGrantPremium(user.id, 12)} className="btn btn-sm p-3 bg-purple-900/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30">1 Yıl</button>
                  <button onClick={() => onGrantPremium(user.id, 999)} className="btn btn-sm p-3 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30">Sınırsız</button>
                </div>

                {isPremium && (
                  <button
                    onClick={() => onGrantPremium(user.id, 0)}
                    className="btn btn-sm p-3 bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30"
                  >
                    🚫 Premium'u İptal Et
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right: Notification */}
          <div className="flex-1 p-6 flex flex-col">
            <h3 className="text-md font-bold text-base-content/70 uppercase tracking-wider mb-2">📩 Bildirim Gönder</h3>
            <p className="text-sm text-base-content/50 mb-4 leading-relaxed">
              Kullanıcıya özel sistem içi bildirim gönderir. İzin verdiyse anlık push (pop-up) olarak da iletilir.
            </p>
            {onSendNotification && user.role !== 'admin' ? (
              <div className="flex-1 flex flex-col">
                <textarea
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Kullanıcıya iletilecek mesajı yazın..."
                  className="textarea textarea-bordered p-2 w-full flex-1 bg-[#0f1115] border-white/5 focus:border-purple-500/50 text-white text-sm resize-none"
                  maxLength={300}
                />
                <button
                  onClick={handleSendNotif}
                  disabled={!notifMessage.trim() || isSending}
                  className="btn mt-3 bg-purple-900/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 disabled:opacity-40 shadow-lg shadow-purple-900/20"
                >
                  {isSending ? <span className="loading loading-spinner" /> : 'Gönder'}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-sm text-base-content/40 bg-[#0f1115] rounded-xl border border-white/5">
                Kurucu hesaplara veya<br />işlev kapalıysa bildirim gönderilemez.
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Danger Zone Centered */}
        {user.role !== 'admin' && (
          <div className="p-6 flex flex-col items-center text-center bg-red-950/10">
            <p className="text-sm text-red-400 mb-3 max-w-md">
              <strong className="font-bold">Tehlike Bölgesi:</strong> Bu işlem geri alınamaz. Kullanıcının tüm mesai kayıtları, CV'leri ve ayarları kalıcı olarak silinir.
            </p>
            <button
              onClick={() => onDeleteAccount(user.id, user.email)}
              className="btn bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 px-8"
            >
              🗑️ Hesabı Kalıcı Olarak Sil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

