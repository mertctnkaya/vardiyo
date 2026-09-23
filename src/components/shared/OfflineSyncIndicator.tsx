import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { subscribeToSyncState, processSyncQueue } from '../../services/syncService';
import { getSyncQueueCount, getSyncQueue, clearSyncQueue } from '../../services/offlineStorage';

export default function OfflineSyncIndicator() {
  const { user, settings, isOnline, setIsOnline, pendingSyncCount, setPendingSyncCount } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncedSuccess, setShowSyncedSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Initial count
    if (user?.id) {
      const initialCount = getSyncQueueCount(user.id);
      setPendingSyncCount(initialCount);
    }

    const handleOnline = () => {
      setIsOnline(true);
      if (user?.id) {
        processSyncQueue(user.id);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueUpdated = (e: any) => {
      const count = e?.detail?.count ?? (user?.id ? getSyncQueueCount(user.id) : 0);
      setPendingSyncCount(count);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('vardiyo-sync-queue-updated', handleQueueUpdated);

    const unsubscribe = subscribeToSyncState(({ isSyncing: syncing, pendingCount }) => {
      setIsSyncing(syncing);
      setPendingSyncCount(pendingCount);

      if (!syncing && pendingCount === 0 && !showSyncedSuccess) {
        setShowSyncedSuccess(true);
        const timer = setTimeout(() => setShowSyncedSuccess(false), 2500);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('vardiyo-sync-queue-updated', handleQueueUpdated);
      unsubscribe();
    };
  }, [user?.id, setIsOnline, setPendingSyncCount, showSyncedSuccess]);

  // Durum 1: İnternet var ve bekleyen hiçbir işlem yok
  if (isOnline && pendingSyncCount === 0 && !isSyncing && !showSyncedSuccess) {
    return null;
  }

  // Durum 2: Yeni eşitlendi, geçici başarı rozeti
  if (showSyncedSuccess && isOnline && pendingSyncCount === 0) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/30 text-emerald-300 border border-emerald-500/40 shadow-sm animate-fade-in"
        title="Tüm yerel işlemler başarıyla buluta eşitlendi."
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Eşitlendi</span>
      </div>
    );
  }

  // Durum 3: Eşitleniyor
  if (isSyncing) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-900/40 text-indigo-300 border border-indigo-500/40 shadow-sm animate-pulse"
        title="Kuyruktaki veriler buluta aktarılıyor..."
      >
        <span className="loading loading-spinner loading-xs text-indigo-400"></span>
        <span>Eşitleniyor ({pendingSyncCount})</span>
      </div>
    );
  }

  // Durum 4: Çevrimdışı (Offline) veya Hata Durumunda Bekleyen
  const queue = user?.id ? getSyncQueue(user.id) : [];

  return (
    <>
      <button
        onClick={() => {
          if (isOnline && user?.id) {
            processSyncQueue(user.id);
          }
          setShowModal(true);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-900/30 text-amber-300 border border-amber-500/40 shadow-sm hover:bg-amber-900/50 transition-all cursor-pointer"
        title="Bekleyen işlemler var. Tıklayarak detay görebilirsiniz."
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span>{pendingSyncCount} İşlem Çevrimiçi Bekliyor</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#16191d] rounded-2xl border border-base-300 p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
              <span className="text-amber-400">⚠️</span> Bekleyen İşlemler
            </h3>
            <p className="text-sm text-base-content/70 mb-4">
              Aşağıdaki işlemler cihazınızda kaydedildi ancak henüz buluta aktarılamadı. İnternetiniz açık olduğu halde bu liste boşalmıyorsa, bir veritabanı kısıtlamasına (hataya) takılmış olabilir.
            </p>

            <ul className="text-xs space-y-2 mb-6 max-h-40 overflow-y-auto">
              {queue.map((item, i) => (
                <li key={i} className="bg-base-200 p-2 rounded border border-base-300 font-mono text-base-content/80 flex flex-col gap-1">
                  <span className="font-bold text-amber-500">{item.type}</span>
                  <span className="text-[10px] text-base-content/50 truncate">
                    {JSON.stringify(item.payload)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2">
              <button
                className="btn btn-warning w-full shadow-lg shadow-warning/20"
                onClick={() => {
                  if (user?.id) processSyncQueue(user.id);
                }}
              >
                Tekrar Senkronize Etmeyi Dene
              </button>
              {(settings?.role === 'admin' || user?.email === 'm3rt7132@gmail.com') && (
                <button
                  className="btn btn-error w-full shadow-lg shadow-error/20"
                  onClick={() => {
                    if (window.confirm('DİKKAT: Kuyruktaki tüm işlemleri silmek üzeresiniz. Bu işlem geri alınamaz. Emin misiniz?')) {
                      if (user?.id) {
                        clearSyncQueue(user.id);
                        setShowModal(false);
                      }
                    }
                  }}
                >
                  Kuyruğu Zorla Temizle (Yönetici)
                </button>
              )}
              <button
                className="btn btn-outline border-base-300 text-base-content/70 w-full"
                onClick={() => setShowModal(false)}
              >
                Kapat
              </button>
              <div className="divider my-1"></div>
              <p className="text-xs text-base-content/50 text-center px-2">
                Hala hata alıyorsanız, lütfen bize bildirin:
              </p>
              <a href="/contact" className="btn btn-sm btn-ghost text-primary w-full">
                Destek & Geri Bildirim'e Git
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

