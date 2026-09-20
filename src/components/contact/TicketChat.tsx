import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAppStore } from '../../store/useAppStore';
import type { ContactMessage, TicketReply } from '../../types';

interface TicketChatProps {
  ticket: ContactMessage;
  onCloseTicket: () => void;
}

export default function TicketChat({ ticket, onCloseTicket }: TicketChatProps) {
  const { user } = useAppStore();
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isClosed = ticket.status === 'closed';

  const fetchReplies = async () => {
    const { data } = await supabase
      .from('ticket_replies')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true });

    if (data) {
      setReplies(data);
    }
  };

  useEffect(() => {
    fetchReplies();

    const channel = supabase
      .channel(`ticket_${ticket.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ticket_replies',
        filter: `ticket_id=eq.${ticket.id}`
      }, (payload) => {
        setReplies(prev => [...prev, payload.new as TicketReply]);

        // Eğer gelen mesaj admin dense, ve şu an ekrana bakıyorsak
        // Görüldü yapmak için tabloyu update edebiliriz
        if (payload.new.sender_id !== user?.id) {
          supabase.from('ticket_replies').update({ is_read: true }).eq('id', payload.new.id).then();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ticket_replies',
        filter: `ticket_id=eq.${ticket.id}`
      }, (payload) => {
        // Update read status of messages
        setReplies(prev => prev.map(r => r.id === payload.new.id ? payload.new as TicketReply : r));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticket.id, user?.id]);

  useEffect(() => {
    // Scroll to bottom when replies change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [replies]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isClosed) return;

    setIsSending(true);

    // 1. Send the message
    await supabase.from('ticket_replies').insert({
      ticket_id: ticket.id,
      user_id: ticket.user_id, // Always the ticket owner's ID
      sender_id: user.id, // Whoever is sending (User or Admin)
      message: newMessage.trim(),
      is_read: false
    });

    // 2. Update the parent ticket status (active_chat) & unread state
    const isAdmin = user.email === 'm3rt7132@gmail.com'; // or checking role
    await supabase.from('contact_messages').update({
      status: 'active_chat',
      is_read_by_admin: isAdmin ? true : false,
      is_read_by_user: isAdmin ? false : true
    }).eq('id', ticket.id);

    setNewMessage('');
    setIsSending(false);

    // Kendi gönderdiğimiz mesajı anında görebilmek için (Realtime pingini beklemeden)
    fetchReplies();
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('Bu talebi kapatmak istediğinize emin misiniz? Tüm sohbet geçmişi silinecektir.')) return;

    // 1. Talebi kapat
    await supabase.from('contact_messages').update({
      status: 'closed'
    }).eq('id', ticket.id);

    // 2. Mesajları tamamen temizle
    await supabase.from('ticket_replies').delete().eq('ticket_id', ticket.id);

    onCloseTicket();
  };

  return (
    <div className="bg-[#16191d] rounded-2xl shadow-2xl border border-base-300 flex flex-col h-[600px] overflow-hidden relative">

      {/* Header */}
      <div className="bg-base-200/50 border-b border-base-300 p-4 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-white font-bold text-lg">{ticket.topic}</h3>
          <p className="text-xs text-base-content/60">Tarih: {new Date(ticket.created_at).toLocaleDateString('tr-TR')} • {ticket.status === 'closed' ? 'Kapatıldı' : 'Açık'}</p>
        </div>
        {!isClosed && (
          <button onClick={handleCloseTicket} className="btn btn-sm btn-outline text-red-400 hover:bg-red-900/20 hover:text-red-400 border-red-500/30">
            Talebi Kapat
          </button>
        )}
      </div>

      {/* Original Message Box */}
      <div className="p-4 bg-[#1e2329] border-b border-base-300 shrink-0">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Sizin İlk Mesajınız</span>
        <p className="text-sm text-base-content/80">{ticket.message}</p>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {isClosed ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-center">Bu talep kapatıldı ve mesaj geçmişi silindi.</p>
          </div>
        ) : replies.length === 0 ? (
          <div className="flex items-center justify-center h-full text-base-content/50">
            <p className="text-sm text-center">Henüz bu talebe bir yanıt verilmedi. <br /> Yöneticinin yanıtı burada görünecektir.</p>
          </div>
        ) : (
          replies.map((reply) => {
            const isMe = reply.sender_id === user?.id;
            return (
              <div key={reply.id} className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-header text-xs opacity-50 mb-1">
                  {isMe ? 'Siz' : 'Yönetici (Vardiyo Destek)'}
                </div>
                <div className={`chat-bubble text-sm ${isMe ? 'chat-bubble-primary bg-indigo-600 text-white' : 'bg-base-200 text-base-content'}`}>
                  {reply.message}
                </div>
                <div className="chat-footer opacity-50 text-[10px] mt-1 flex gap-1 items-center">
                  {new Date(reply.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  {isMe && (
                    <span className="text-info ml-1">
                      {reply.is_read ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-sky-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-base-content/40" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      {!isClosed && (
        <form onSubmit={handleSendMessage} className="p-3 bg-base-200/50 border-t border-base-300 shrink-0 flex gap-2">
          <input
            type="text"
            placeholder="Mesajınızı yazın..."
            className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-indigo-500"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button type="submit" disabled={isSending || !newMessage.trim()} className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg px-6">
            {isSending ? <span className="loading loading-spinner loading-sm"></span> : 'Gönder'}
          </button>
        </form>
      )}
    </div>
  );
}
