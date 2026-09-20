-- 1. contact_messages tablosunu güncelle
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'open',
ADD COLUMN IF NOT EXISTS is_read_by_user boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_read_by_admin boolean DEFAULT false;

-- 2. ticket_replies tablosunu oluştur
CREATE TABLE IF NOT EXISTS ticket_replies (
  id bigint generated always as identity primary key,
  ticket_id bigint not null references contact_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 3. ticket_replies tablosu için RLS ayarları
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ticket replies" 
ON ticket_replies FOR SELECT 
USING (auth.uid() = user_id OR (select auth.jwt()->>'email') = 'm3rt7132@gmail.com');

CREATE POLICY "Users can insert their own ticket replies" 
ON ticket_replies FOR INSERT 
WITH CHECK (auth.uid() = sender_id OR (select auth.jwt()->>'email') = 'm3rt7132@gmail.com');

CREATE POLICY "Users can update their own ticket replies (for is_read)" 
ON ticket_replies FOR UPDATE
USING (auth.uid() = user_id OR (select auth.jwt()->>'email') = 'm3rt7132@gmail.com');

CREATE POLICY "Admin can delete ticket replies" 
ON ticket_replies FOR DELETE 
USING (auth.uid() = user_id OR (select auth.jwt()->>'email') = 'm3rt7132@gmail.com');

-- 4. contact_messages tablosu için RLS güncellemeleri (Admin olmayanlar kendi verilerini güncelleyebilsin diye)
CREATE POLICY "Users can update their own contact messages" 
ON contact_messages FOR UPDATE
USING (auth.uid() = user_id OR (select auth.jwt()->>'email') = 'm3rt7132@gmail.com');

