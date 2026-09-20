import { Link } from 'react-router-dom';
import type { SidebarProps } from '../../types';
import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function Sidebar({ user, isFounder, onLogout, onClose }: SidebarProps) {
  const { unreadTicketCount } = useAppStore();

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (touchStartX < 120 && deltaX > 40 && Math.abs(deltaY) < 90) {
        const drawerCheckbox = document.getElementById('mobile-drawer') as HTMLInputElement | null;
        if (drawerCheckbox && !drawerCheckbox.checked) {
          drawerCheckbox.checked = true;
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  return (
    <div className="drawer-side z-50">
      <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay backdrop-blur-sm bg-black/40"></label>
      <ul className="menu p-6 pt-safe pb-safe w-[82vw] max-w-sm min-h-full bg-base-100 text-base-content gap-2 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-base-300 pt-2">
          <span className="text-2xl font-black text-indigo-500 tracking-wide">Vardiyo</span>
          <label htmlFor="mobile-drawer" className="btn btn-square btn-ghost btn-sm text-base-content/60 hover:text-base-content">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </label>
        </div>

        <li><Link to="/" onClick={onClose} className="text-lg py-3 font-medium rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400">Güncel Vardiya</Link></li>
        <li><Link to="/worktime" onClick={onClose} className="text-lg py-3 font-medium rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400">Mesai Takvimim</Link></li>
        <li><Link to="/next-weeks" onClick={onClose} className="text-lg py-3 font-medium rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400">Gelecek Haftalar</Link></li>
        <li><Link to="/calculations" onClick={onClose} className="text-lg py-3 font-medium rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400">Hesaplamalar&İşlemler</Link></li>
        <li><Link to="/faq" onClick={onClose} className="text-lg py-3 font-medium rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400">S.S.S & Haklar</Link></li>
        <li>
          <Link to="/contact" onClick={onClose} className="text-lg py-3 font-medium rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 flex justify-between items-center">
            İletişim
            {unreadTicketCount > 0 && (
              <span className="badge badge-error text-white font-bold">{unreadTicketCount}</span>
            )}
          </Link>
        </li>
        <li><Link to="/settings" onClick={onClose} className="text-lg py-3 font-medium rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400">Ayarlar</Link></li>

        {isFounder && (
          <div className="mt-2">
            <li>
              <Link to="/admin" onClick={onClose} className="text-lg py-3 font-bold text-emerald-400 bg-emerald-900/10 border border-emerald-500/20 hover:bg-emerald-900/30 rounded-xl shadow-inner flex items-center justify-between">
                👑 Yönetici Paneli
                <span className="badge badge-sm badge-success border-none">Gizli</span>
              </Link>
            </li>
          </div>
        )}

        <div className="divider my-2"></div>

        {user ? (
          <div className="mt-auto flex flex-col gap-3 pb-2">
            <div className="bg-[#1e2329] p-4 rounded-2xl text-center border border-base-300">
              <p className="text-xs text-base-content/50 uppercase font-bold tracking-widest mb-1">KULLANICI</p>
              <p className="font-bold text-indigo-400 text-lg truncate">{user.user_metadata?.name || user.email}</p>
            </div>
            <button onClick={onLogout} className="btn bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white border-none w-full shadow-sm rounded-xl text-base h-11">Çıkış Yap</button>
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-2.5 pb-2">
            <div className="bg-[#1e2329] p-4 rounded-2xl text-center border border-base-300/60 mb-1">
              <p className="text-xs text-base-content/50 uppercase font-bold tracking-widest mb-1">MİSAFİR ERİŞİMİ</p>
              <p className="text-xs text-base-content/70">Verilerinizi buluta eşitlemek ve kaydetmek için giriş yapın.</p>
            </div>
            <Link to="/login" onClick={onClose} className="btn btn-outline border-indigo-500/40 hover:bg-indigo-500/10 text-indigo-400 w-full rounded-xl text-base h-11">Giriş Yap</Link>
            <Link to="/register" onClick={onClose} className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none w-full shadow-lg shadow-indigo-900/40 rounded-xl text-base h-11">Kayıt Ol</Link>
          </div>
        )}
      </ul>
    </div>
  );
}
