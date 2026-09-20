import { Link } from 'react-router-dom';
import NotificationDropdown from '../shared/NotificationDropdown';
import OfflineSyncIndicator from '../shared/OfflineSyncIndicator';
import type { NavbarProps } from '../../types';
import { useAppStore } from '../../store/useAppStore';

export default function Navbar({ user, isFounder, onLogout }: NavbarProps) {
  const { unreadTicketCount } = useAppStore();

  return (
    <div className="navbar bg-base-100 shadow-xl mb-6 sm:mb-8 w-full z-10 px-2 sm:px-4 print:hidden justify-between">
      <div className="navbar-start w-auto flex items-center shrink-0">
        <label htmlFor="mobile-drawer" className="btn btn-ghost btn-circle lg:hidden cursor-pointer" aria-label="Menüyü Aç">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <Link to="/" className="btn btn-ghost text-xl text-indigo-500 font-black tracking-wide ml-1 lg:ml-0">
          Vardiyo
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex flex-1 justify-center px-2">
        <ul className="menu menu-horizontal px-1 font-medium text-base-content text-xs xl:text-sm gap-0.5 xl:gap-1 items-center flex-nowrap whitespace-nowrap">
          <li><Link to="/" className="hover:text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-400 rounded-lg px-2 xl:px-2.5 py-1.5">Güncel Vardiya</Link></li>
          <li><Link to="/worktime" className="hover:text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-400 rounded-lg px-2 xl:px-2.5 py-1.5">Mesai Takvimim</Link></li>
          <li><Link to="/next-weeks" className="hover:text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-400 rounded-lg px-2 xl:px-2.5 py-1.5">Gelecek Haftalar</Link></li>
          <li><Link to="/calculations" className="hover:text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-400 rounded-lg px-2 xl:px-2.5 py-1.5">Hesaplamalar&İşlemler</Link></li>
          <li><Link to="/faq" className="hover:text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-400 rounded-lg px-2 xl:px-2.5 py-1.5">S.S.S & Haklar</Link></li>
          <li>
            <Link to="/contact" className="hover:text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-400 rounded-lg px-2 xl:px-2.5 py-1.5 relative">
              İletişim
              {unreadTicketCount > 0 && (
                <span className="absolute -top-1 -right-2 badge badge-error badge-xs w-4 h-4 text-[10px] animate-bounce shadow-lg shadow-red-900/50">
                  {unreadTicketCount}
                </span>
              )}
            </Link>
          </li>
          <li><Link to="/settings" className="hover:text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-400 rounded-lg px-2 xl:px-2.5 py-1.5">Ayarlar</Link></li>

          {isFounder && (
            <li className="ml-1">
              <Link to="/admin" className="hover:text-emerald-300 focus:bg-emerald-500/20 text-emerald-400 font-bold bg-emerald-900/10 border border-emerald-500/20 rounded-lg shadow-inner px-2 xl:px-2.5 py-1.5">
                👑 Yönetici
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end w-auto flex justify-end items-center gap-1.5 sm:gap-3 pr-1 sm:pr-2 shrink-0">
        <OfflineSyncIndicator />
        {user ? (
          <div className="flex items-center gap-1.5 sm:gap-3">
            <NotificationDropdown />

            {/* Masaüstü Kullanıcı Adı ve Çıkış (lg ve üzeri) */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-xs font-semibold text-base-content/80 border border-base-300 bg-base-200 px-3 py-1.5 rounded-full max-w-[140px] truncate" title={user.user_metadata?.name}>
                {user.user_metadata?.name || 'Kullanıcı'}
              </span>
              <button onClick={onLogout} className="btn btn-sm btn-outline hover:bg-red-600 hover:text-white border-red-500/30 text-red-400 transition-colors">
                Çıkış
              </button>
            </div>

            {/* Tablet ve Mobilde Hızlı Çıkış Butonu (< lg) */}
            <button
              onClick={onLogout}
              title="Çıkış Yap"
              className="btn btn-sm btn-ghost btn-circle text-red-400 hover:bg-red-900/20 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm text-xs sm:text-sm text-base-content hover:bg-base-200">Giriş Yap</Link>
            <Link to="/register" className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none transition-colors shadow-lg shadow-indigo-900/50 text-xs sm:text-sm">
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
