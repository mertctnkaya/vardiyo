import React from 'react';

export interface ContactMessage {
  id: number;
  user_id?: string;
  name: string;
  email: string;
  message: string;
  topic?: string;
  contact_info?: string;
  status?: 'open' | 'active_chat' | 'closed';
  is_read_by_user?: boolean;
  is_read_by_admin?: boolean;
  created_at: string;
}

export interface TicketReply {
  id: number;
  ticket_id: number;
  user_id: string;
  sender_id: string;
  message: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface FAQ {
  q: string;
  a: React.ReactNode;
  isImportant?: boolean;
}

export interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  faqs: FAQ[];
}
