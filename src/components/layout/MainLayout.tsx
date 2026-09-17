import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useShiftCalculator } from '../../hooks/useShiftCalculator';
import { supabase } from '../../lib/supabaseClient';
import { useAppStore } from '../../store/useAppStore';
import { fetchUserSettings } from '../../services/dbService';
import { processSyncQueue } from '../../services/syncService';

import Navbar from './Navbar';
import Sidebar from './SidebarMobile';
import Footer from './Footer';
import CookieBanner from '../shared/CookieBanner';
import PWAInstallPrompt from '../shared/PWAInstallPrompt';
import InAppReviewPrompt from '../shared/InAppReviewPrompt';
import { useMobileBackHandler } from '../../hooks/useMobileBackHandler';

export default function MainLayout() {
  useMobileBackHandler();

  const shiftContext = useShiftCalculator();
  const { user, setUser, setSession, setSettings } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    return () => window.removeEventListener('focusin', handleFocusIn);
  }, []);

  useEffect(() => {
    const loadSettings = async (userId: string) => {
      const settingsData = await fetchUserSettings(userId);
      if (settingsData) {
        setSettings(settingsData);
      }
      processSyncQueue(userId);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadSettings(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) loadSettings(session.user.id);
      else setSettings(null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setSettings]);

  const closeDrawer = () => {
    const drawer = document.getElementById('mobile-drawer') as HTMLInputElement;
    if (drawer) drawer.checked = false;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeDrawer();
    navigate('/login');
  };

  const isFounder = user?.email === 'm3rt7132@gmail.com';

  return (
    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen bg-base-300 items-center pt-safe pb-safe">
        <Navbar user={user} isFounder={isFounder} onLogout={handleLogout} />

        <div className="w-full max-w-5xl px-4 pb-12 flex flex-col items-center flex-grow">
          <Outlet context={shiftContext} />
        </div>

        <Footer />
      </div>

      <Sidebar user={user} isFounder={isFounder} onLogout={handleLogout} onClose={closeDrawer} />

      <CookieBanner />
      <PWAInstallPrompt />
      <InAppReviewPrompt />
    </div>
  );
}