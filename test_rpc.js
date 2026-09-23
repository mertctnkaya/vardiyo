import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://uzauormclzdinmnrvpzb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6YXVvcm1jbHpkaW5tbnJ2cHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MjM2MTcsImV4cCI6MjA5OTE5OTYxN30.rB5hsn5IRrWKnap_LVs7YupbCqQfYdC5j6aX1RplAsE'
);

async function check() {
  const { data, error } = await supabase.rpc('get_admin_user_list');
  console.log('Error:', error);
  console.log('Data:', data?.length ? `${data.length} users found` : data);
}

check();
