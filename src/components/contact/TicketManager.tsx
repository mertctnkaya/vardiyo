import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAppStore } from '../../store/useAppStore';
import ContactForm from './ContactForm';
import TicketChat from './TicketChat';
import type { ContactMessage } from '../../types';

export default function TicketManager() {
  const { user } = useAppStore();
  const [view, setView] = useState<'list' | 'new' | 'chat'>('list');
  const [tickets, setTickets] = useState<ContactMessage[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTickets();
    if (!user) return;

    const channel = supabase
      .channel('ticket_manager_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages', filter: `user_id=eq.${user.id}` }, () => {
        fetchTickets();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_replies', filter: `user_id=eq.${user.id}` }, () => {
        fetchTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleTicketClick = async (ticket: ContactMessage) => {
    setSelectedTicket(ticket);
    setView('chat');

    // Eğer okunmamışsa, okundu olarak işaretle
    if (!ticket.is_read_by_user) {
      await supabase
        .from('contact_messages')
        .update({ is_read_by_user: true })
        .eq('id', ticket.id);

      // Update local state
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, is_read_by_user: true } : t));

      // Update badge via store
      const currentUnread = useAppStore.getState().unreadTicketCount;
      if (currentUnread > 0) {
        useAppStore.getState().setUnreadTicketCount(currentUnread - 1);
      }
    }
  };

  if (view === 'new') {
    return (
      <div className="md:col-span-2">
        <button
          onClick={() => setView('list')}
          className="btn btn-sm btn-ghost mb-4 text-base-content/70"
        >
          &larr; Geri Dön
        </button>
        <ContactForm onFinish={() => {
          setView('list');
          fetchTickets();
        }} />
      </div>
    );
  }

  if (view === 'chat' && selectedTicket) {
    return (
      <div className="md:col-span-2">
        <button
          onClick={() => {
            setView('list');
            fetchTickets();
          }}
          className="btn btn-sm btn-ghost mb-4 text-base-content/70"
        >
          &larr; Geri Dön
        </button>
        <TicketChat
          ticket={selectedTicket}
          onCloseTicket={() => {
            setView('list');
            fetchTickets();
          }}
        />
      </div>
    );
  }

  return (
    <div className="md:col-span-2 bg-[#16191d] rounded-2xl shadow-2xl border border-base-300 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-base-300 pb-4">
        <h2 className="text-xl font-bold text-white">Taleplerim & Önerilerim</h2>
        <button
          onClick={() => setView('new')}
          className="btn btn-sm p-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/40"
        >
          + Yeni Oluştur
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner text-indigo-500"></span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center p-8 text-base-content/60">
          <p>Henüz bir destek talebi veya öneri göndermediniz.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => handleTicketClick(ticket)}
              className="bg-[#1e2329] border border-base-300 p-4 rounded-xl cursor-pointer hover:border-indigo-500/30 transition-colors flex flex-col gap-2 relative"
            >
              {!ticket.is_read_by_user && (
                <span className="absolute top-4 right-4 h-3 w-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
              )}

              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold text-sm">{ticket.topic}</span>
                <span className="text-base-content/40 text-xs">
                  {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>

              <p className="text-base-content/80 text-sm line-clamp-2">{ticket.message}</p>

              <div className="mt-1">
                {ticket.status === 'closed' ? (
                  <span className="badge badge-success badge-sm badge-outline gap-1 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Kapatıldı
                  </span>
                ) : ticket.status === 'active_chat' ? (
                  <span className="badge badge-info badge-sm badge-outline gap-1 text-xs text-sky-400 border-sky-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Sohbet Aktif
                  </span>
                ) : (
                  <span className="badge badge-ghost badge-sm gap-1 text-xs text-base-content/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    İnceleniyor
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

