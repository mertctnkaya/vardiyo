import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAppStore } from '../store/useAppStore';
import type { ContactMessage, AdminUser } from '../types';

import AdminHeader from '../components/admin/AdminHeader';
import PremiumTab from '../components/admin/PremiumTab';
import MessagesTab from '../components/admin/MessagesTab';
import StatsTab from '../components/admin/StatsTab';
import BroadcastTab from '../components/admin/BroadcastTab';
import TicketChat from '../components/contact/TicketChat';
import { usePageTitle } from '../hooks/usePageTitle';
import { useToastStore } from '../store/useToastStore';

export default function AdminPanel() {
  usePageTitle('Yönetici Paneli');
  const { user, settings } = useAppStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'premium' | 'messages' | 'stats' | 'broadcast'>('premium');
  const [activeChatTicket, setActiveChatTicket] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFeedback, _setActionFeedback] = useState('');

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({ usersCount: 0, logsCount: 0, remindersCount: 0 });

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const [isTriggeringCron, setIsTriggeringCron] = useState(false);

  const handleSendBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      addToast("Lütfen başlık ve mesaj girin.", 'warning');
      return;
    }

    setIsBroadcasting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-broadcast', {
        body: { title: broadcastTitle, message: broadcastMessage }
      });

      if (error) throw error;

      addToast(`Duyuru başarıyla gönderildi! (${data.sentCount} kişiye ulaştı)`, 'success');
      setBroadcastTitle('');
      setBroadcastMessage('');
    } catch (err: any) {
      console.error(err);
      addToast("Gönderim sırasında bir hata oluştu.", 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleForceCronRun = async () => {
    setIsTriggeringCron(true);
    try {
      const { data, error } = await supabase.functions.invoke('daily-worker');
      if (error) throw error;
      addToast(`Günlük işçi başarıyla çalıştırıldı! İşlenen kullanıcı: ${data.processedUsers}, Atılan Bildirim: ${data.notificationsSent}`, 'success');
    } catch (err) {
      console.error(err);
      addToast("Tetikleme başarısız oldu.", 'error');
    } finally {
      setIsTriggeringCron(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const { data: userData } = await supabase.rpc('get_admin_user_list');
    if (userData) setUsers(userData);

    const { data: msgData } = await supabase.rpc('get_admin_messages');
    if (msgData) setMessages(msgData);

    const { data: statData } = await supabase.rpc('get_admin_stats');
    if (statData) setStats(statData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Subscribe to any new tickets
    const channel1 = supabase
      .channel('admin_contact_messages_listener')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        const fetchMessagesOnly = async () => {
          const { data: msgData } = await supabase.rpc('get_admin_messages');
          if (msgData) setMessages(msgData);
        };
        fetchMessagesOnly();
      })
      .subscribe();

    // Subscribe to any new replies
    const channel2 = supabase
      .channel('admin_ticket_replies_listener')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_replies' }, () => {
        const fetchMessagesOnly = async () => {
          const { data: msgData } = await supabase.rpc('get_admin_messages');
          if (msgData) setMessages(msgData);
        };
        fetchMessagesOnly();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  const handleGrantPremium = async (userId: string, monthsToAdd: number) => {
    const targetUser = users.find(u => u.id === userId);
    let baseDate = new Date();

    if (monthsToAdd === 999) {
      baseDate = new Date('2099-12-31');
    } else if (monthsToAdd === 0) {
      baseDate = new Date(0);
    } else {
      const hasPremium = targetUser?.premium_until && new Date(targetUser.premium_until) > new Date();
      const isLifetime = targetUser?.premium_until?.includes('2099');

      if (hasPremium && !isLifetime) {
        baseDate = new Date(targetUser.premium_until!);
      }

      if (monthsToAdd === 0.25) {
        baseDate.setDate(baseDate.getDate() + 7);
      } else {
        baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
      }
    }

    const premiumUntilStr = monthsToAdd === 0 ? null : baseDate.toISOString();

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, premium_until: premiumUntilStr } : u));

    const { error } = await supabase
      .from('user_settings')
      .update({ premium_until: premiumUntilStr })
      .eq('user_id', userId);

    if (error) {
      addToast('Hata: ' + error.message, 'error');
      fetchData();
    } else {
      addToast('Premium güncellendi', 'success');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

    setMessages(prev => prev.filter(m => m.id !== id));

    const { error } = await supabase.rpc('delete_admin_message', { msg_id: id });
    if (error) {
      addToast('Hata: ' + error.message, 'error');
      fetchData();
    } else {
      addToast('Mesaj silindi', 'success');
    }
  };

  const handleDeleteAccount = async (id: string, email: string) => {
    if (!window.confirm(`${email} e-posta adresli kullanıcının hesabını (ve tüm verilerini) KALICI OLARAK silmek istediğinize emin misiniz?`)) return;

    setUsers(prev => prev.filter(u => u.id !== id));

    const { error } = await supabase.rpc('delete_user_account', { target_user_id: id });
    if (error) {
      addToast('Hata: ' + error.message, 'error');
      fetchData();
    }
  };

  const handleSendNotification = async (userId: string, message: string) => {
    try {
      // Create notification in DB using RPC to bypass RLS
      const { error: dbError } = await supabase.rpc('send_admin_notification', {
        target_user_id: userId,
        notif_title: 'Yönetici Mesajı',
        notif_message: message,
        notif_link: '/'
      });

      if (dbError) throw dbError;

      // Try to send push if user has subscription
      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('push_subscription')
        .eq('user_id', userId)
        .single();

      if (userSettings?.push_subscription) {
        await supabase.functions.invoke('send-push', {
          body: {
            subscription: userSettings.push_subscription,
            payload: { title: 'Yönetici Mesajı', message: message, url: '/' }
          }
        });
      }

      addToast('Bildirim başarıyla gönderildi.', 'success');
    } catch (error: any) {
      addToast(`Bildirim hatası: ${error.message || 'Bilinmeyen hata'}`, 'error');
      console.error(error);
    }
  };

  const handleOpenChat = async (msg: ContactMessage) => {
    setActiveChatTicket(msg);
    if (!msg.is_read_by_admin) {
      await supabase.from('contact_messages').update({ is_read_by_admin: true }).eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read_by_admin: true } : m));
    }
  };

  if (!user || (user.email !== 'm3rt7132@gmail.com' && settings?.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10">

      <AdminHeader email={user.email || ''} />

      <div className="w-full max-w-5xl px-2 mb-6">
        <div className="tabs tabs-boxed bg-[#16191d] p-1 border border-base-300 flex-wrap justify-center sm:justify-start gap-1">
          <a
            className={`tab tab-lg rounded-lg transition-all ${activeTab === 'premium' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-base-content/60 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('premium')}
          >
            Premium Yönetimi
          </a>
          <a
            className={`tab tab-lg rounded-lg transition-all ${activeTab === 'messages' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-base-content/60 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('messages')}
          >
            Gelen Mesajlar ({messages.length})
          </a>
          <a
            className={`tab tab-lg rounded-lg transition-all ${activeTab === 'stats' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-base-content/60 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('stats')}
          >
            İstatistikler
          </a>
          <a
            className={`tab tab-lg rounded-lg transition-all ${activeTab === 'broadcast' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-base-content/60 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('broadcast')}
          >
            Duyuru Yayınla
          </a>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        {isLoading ? (
          <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-emerald-500"></span></div>
        ) : (
          <>
            {activeTab === 'premium' && (
              <PremiumTab
                users={users}
                actionFeedback={actionFeedback}
                onGrantPremium={handleGrantPremium}
                onDeleteAccount={handleDeleteAccount}
                onSendNotification={handleSendNotification}
              />
            )}

            {activeTab === 'messages' && (
              <MessagesTab
                messages={messages}
                onDeleteMessage={handleDeleteMessage}
                onOpenChat={handleOpenChat}
              />
            )}

            {activeTab === 'stats' && <StatsTab stats={stats} users={users} messages={messages} />}

            {activeTab === 'broadcast' && (
              <div className="flex justify-center mt-4 mb-8">
                <button
                  onClick={handleForceCronRun}
                  disabled={isTriggeringCron}
                  className="btn btn-md w-full font-bold p-3 bg-purple-900/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30"
                >
                  {isTriggeringCron ? <span className="loading loading-spinner"></span> : '⚙️ 07:00-19:00 Otomasyonunu Şimdi Tetikle'}
                </button>
              </div>
            )}

            {activeTab === 'broadcast' && (
              <BroadcastTab
                title={broadcastTitle}
                message={broadcastMessage}
                isBroadcasting={isBroadcasting}
                onTitleChange={setBroadcastTitle}
                onMessageChange={setBroadcastMessage}
                onSend={handleSendBroadcast}
              />
            )}
          </>
        )}
      </div>

      {activeChatTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl relative rounded-3xl shadow-2xl">
            <button
              onClick={() => {
                setActiveChatTicket(null);
                fetchData(); // Refresh list to get updated statuses
              }}
              className="absolute -top-4 -right-2 sm:-right-4 btn btn-circle btn-sm bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white border-none z-10 shadow-lg shadow-red-900/50"
            >
              ✕
            </button>
            <div className="rounded-3xl overflow-hidden">
              <TicketChat
                ticket={activeChatTicket}
                onCloseTicket={() => {
                  setActiveChatTicket(null);
                  fetchData();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
