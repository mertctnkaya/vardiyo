import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAppStore } from '../../store/useAppStore';

// (Dakika, Saat, Gün ve Tam Tarih)
const formatTimeData = (dateString: string) => {
  const date = new Date(dateString);
  const diff = new Date().getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  let relative = '';
  if (minutes < 1) relative = 'Az önce';
  else if (minutes < 60) relative = `${minutes} dakika önce`;
  else if (hours < 24) relative = `${hours} saat önce`;
  else relative = `${days} gün önce`;

  // Tam tarih ve saat (Örn: 09.08.2026 19:30)
  const exact = date.toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return { relative, exact };
};

const getIconData = (type: string) => {
  switch (type) {
    case 'shift': return { icon: '🔄', color: 'text-indigo-400', bg: 'bg-indigo-900/20' };
    case 'holiday': return { icon: '🎉', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    case 'payroll': return { icon: '💰', color: 'text-emerald-400', bg: 'bg-emerald-900/20' };
    case 'broadcast': return { icon: '🚀', color: 'text-blue-400', bg: 'bg-blue-900/20' };
    case 'reminder': return { icon: '⏰', color: 'text-orange-400', bg: 'bg-orange-900/20' };
    case 'risk': return { icon: '⚠️', color: 'text-red-400', bg: 'bg-red-900/20' };
    case 'annual_leave': return { icon: '🌴', color: 'text-pink-400', bg: 'bg-pink-900/20' };
    default: return { icon: '🔔', color: 'text-base-content', bg: 'bg-base-200' };
  }
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAppStore();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (data && !error) setNotifications(data);
    };

    fetchNotifications();

    const channel = supabase.channel('realtime-notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllAsRead = async () => {
    if (!user) return;
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
  };

  const clearAll = async () => {
    if (!user) return;
    setNotifications([]);
    await supabase.from('notifications').delete().eq('user_id', user.id);
  };

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) return;
    
    setNotifications(notifications.filter(n => n.id !== id));
    await supabase.from('notifications').delete().eq('id', id);
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      setNotifications(notifications.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      await supabase.from('notifications').update({ is_read: true }).eq('id', notif.id);
    }
    
    if (notif.is_interactive && notif.link) {
      navigate(notif.link);
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  return (
    <div className="dropdown dropdown-end z-50">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/80 hover:text-base-content transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-base-100"></span>
          </span>
        )}
      </div>

      <div tabIndex={0} className="dropdown-content mt-4 z-[9999] w-[85vw] max-w-sm sm:w-96 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#1e2329] border border-base-300 overflow-hidden animate-fade-in origin-top-right backdrop-blur-xl">
        
        <div className="bg-base-200 border-b border-base-300 p-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="font-bold text-base-content text-lg">Bildirimler</h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} onMouseDown={(e) => e.preventDefault()} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Okundu İşaretle
                </button>
              )}
            </div>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <span className="text-4xl mb-3 opacity-50">📭</span>
              <p className="text-base-content/60 font-medium">Yeni bildiriminiz yok.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => {
                const ui = getIconData(notif.type);
                const timeInfo = formatTimeData(notif.created_at);
                
                return (
                  <div 
                    key={notif.id}
                    onClick={() => notif.is_interactive ? handleNotificationClick(notif) : null}
                    className={`group relative p-4 border-b border-base-300/50 transition-all duration-200 flex gap-4 
                      ${notif.is_interactive ? 'cursor-pointer hover:bg-base-200 active:scale-[0.99]' : 'cursor-default hover:bg-base-200/30'} 
                      ${!notif.is_read ? 'bg-base-300/20' : 'opacity-70 hover:opacity-100'}
                    `}
                  >
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${ui.bg} ${ui.color}`}>
                      {ui.icon}
                    </div>
                    
                    <div className="flex-1 cursor-inherit pr-6">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-base-content' : 'font-medium text-base-content/80'}`}>
                          {notif.title}
                        </h4>
                        {!notif.is_read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>}
                      </div>
                      <p className="text-xs text-base-content/60 leading-relaxed line-clamp-2">{notif.message}</p>
                      
                      <p className="text-[10px] text-base-content/40 mt-2 font-medium flex gap-1.5">
                        <span className="text-base-content/60">{timeInfo.relative}</span> 
                        <span>•</span> 
                        <span>{timeInfo.exact}</span>
                      </p>
                    </div>

                    <button 
                      onClick={(e) => deleteNotification(e, notif.id)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-base-content/30 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors md:opacity-0 md:group-hover:opacity-100"
                      title="Bildirimi Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 bg-base-200 border-t border-base-300">
            <button onClick={clearAll} className="btn btn-sm btn-ghost w-full text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
              Tümünü Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}