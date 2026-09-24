// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Admin yetkisiyle (Service Role) Supabase'e bağlanıyoruz
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { event } = body;

    // RevenueCat event yapısı
    // app_user_id: Bizim sistemdeki auth.uid() değeridir (Purchases.logIn ile gönderdiğimiz)
    const userId = event?.app_user_id;
    const eventType = event?.type; // INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION vb.
    const expirationAtMs = event?.expiration_at_ms;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'No user ID provided' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Kullanıcının aboneliği iptal mi oldu / bitti mi?
    // EXPIRATION veya CANCELLATION durumlarında premium_until tarihini geçmişe çekeriz veya null yaparız.
    // INITIAL_PURCHASE veya RENEWAL durumlarında yeni tarihi yazarız.
    
    let premiumUntil = null;
    let role = 'free';

    if (eventType === 'INITIAL_PURCHASE' || eventType === 'RENEWAL') {
      if (expirationAtMs) {
        premiumUntil = new Date(Number(expirationAtMs)).toISOString();
        role = 'premium';
      }
    } else if (eventType === 'CANCELLATION' || eventType === 'EXPIRATION') {
      // Abonelik iptal edildiyse veya bittiyse "free"ye düşür.
      premiumUntil = null;
      role = 'free';
    }

    if (role === 'premium' || eventType === 'CANCELLATION' || eventType === 'EXPIRATION') {
      // Veritabanını admin yetkisiyle güncelle
      const { error } = await supabase
        .from('user_settings')
        .update({ 
          premium_until: premiumUntil, 
          role: role 
        })
        .eq('user_id', userId);

      if (error) throw error;
      console.log(`[RevenueCat Webhook] User ${userId} updated to ${role} (Until: ${premiumUntil})`);
    }

    return new Response(JSON.stringify({ message: 'Success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('[RevenueCat Webhook Error]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
