import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { subscribeToSyncState, processSyncQueue } from '../../services/syncService';
import { getSyncQueueCount } from '../../services/offlineStorage';

export default function OfflineSyncIndicator() {
  const { user, isOnline, setIsOnline, pendingSyncCount, setPendingSyncCount } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncedSuccess, setShowSyncedSuccess] = useState(false);

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

  // Durum 4: Çevrimdışı (Offline)
  return (
    <button
      onClick={() => {
        if (isOnline && user?.id) {
          processSyncQueue(user.id);
        } else {
          alert('İnternet bağlantısı yok. Yaptığınız tüm işlemler cihazınızda güvenle saklanıyor; internete bağlanıldığında otomatik olarak veritabanına aktarılacaktır.');
        }
      }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-900/30 text-amber-300 border border-amber-500/40 shadow-sm hover:bg-amber-900/50 transition-all cursor-pointer"
      title="Çevrimdışı Mod. Tıklayarak detay görebilir veya bağlantı varsa eşitlemeyi deneyebilirsiniz."
    >
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
      <span>
        {!isOnline
          ? (pendingSyncCount > 0 ? `Çevrimdışı (${pendingSyncCount} kuyrukta)` : 'Çevrimdışı Mod')
          : `${pendingSyncCount} Kayıt Bekliyor`
        }
      </span>
    </button>
  );
}

