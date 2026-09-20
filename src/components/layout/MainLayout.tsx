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
import PwaUpdatePrompt from '../shared/PwaUpdatePrompt';
import ToastContainer from '../shared/ToastContainer';
import { useMobileBackHandler } from '../../hooks/useMobileBackHandler';
import { useToastStore } from '../../store/useToastStore';

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
    let unreadSub: any;

    const loadSettings = async (userId: string) => {
      const settingsData = await fetchUserSettings(userId);
      if (settingsData) {
        setSettings(settingsData);
      }
      processSyncQueue(userId);

      // Fetch initial unread count
      const fetchInitial = async () => {
        const { count } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_read_by_user', false);

        if (count !== null) {
          useAppStore.getState().setUnreadTicketCount(count);
        }
      };
      fetchInitial();

      // Realtime subscription for unread count
      if (unreadSub) {
        supabase.removeChannel(unreadSub);
      }

      unreadSub = supabase
        .channel(`main_layout_unread_${userId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'ticket_replies', filter: `user_id=eq.${userId}` },
          (payload) => {
            if (payload.new.sender_id !== userId) {
              const fetchCount = async () => {
                const { count } = await supabase
                  .from('contact_messages')
                  .select('*', { count: 'exact', head: true })
                  .eq('user_id', userId)
                  .eq('is_read_by_user', false);

                if (count !== null) {
                  const current = useAppStore.getState().unreadTicketCount;
                  useAppStore.getState().setUnreadTicketCount(count);
                  if (count > current) {
                    const { addToast } = useToastStore.getState();
                    addToast('Destek talebinize yanıt geldi!', 'info');
                  }
                }
              };
              fetchCount();
            }
          }
        )
        .subscribe();
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadSettings(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        loadSettings(session.user.id);
      } else {
        setSettings(null);
        if (unreadSub) {
          supabase.removeChannel(unreadSub);
          unreadSub = null;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      if (unreadSub) supabase.removeChannel(unreadSub);
    };
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
      <PwaUpdatePrompt />
      <ToastContainer />
    </div>
  );
}
