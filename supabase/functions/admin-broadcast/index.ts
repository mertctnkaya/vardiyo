// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import webPush from "npm:web-push"

// 1. Supabase'in resmi ve güncel CORS başlıkları paketi
import { corsHeaders } from 'npm:@supabase/supabase-js@2.39.3/cors'

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

webPush.setVapidDetails(
  'mailto:m3rt7132@gmail.com',
  vapidPublicKey,
  vapidPrivateKey
)

const supabaseUrl = Deno.env.get('SUPABASE_URL')
// Tüm veritabanını tarayıp bildirim atmak için Service Role kullanmaya devam ediyoruz
const supabaseAdmin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))

serve(async (req: Request) => {
  // 2. CORS Preflight İsteklerini Otomatik Karşılama
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 3. GÜVENLİK ZIRHI: İsteği yapan kişinin oturum (JWT) kontrolü
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Yetkisiz işlem: Oturum bilgisi bulunamadı. Dışarıdan tetiklenemez.')
    }

    // İsteği yapanın kim olduğunu anlamak için Anon Key ve Auth Header ile client oluşturuyoruz
    const supabaseUserClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } }
    })
    
    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Yetkisiz işlem: Geçersiz veya süresi dolmuş oturum.')
    }

    // 4. YETKİ KONTROLÜ: Sadece Kurucu/Admin bu duyuruyu ateşleyebilir
    if (user.email !== 'm3rt7132@gmail.com') {
      throw new Error('Erişim engellendi: Duyuru gönderme yetkiniz yok.')
    }

    // --- ASIL İŞLEM ---
    const { title, message } = await req.json()

    if (!title || !message) {
      throw new Error('Başlık ve mesaj zorunludur.')
    }

    const { data: users, error } = await supabaseAdmin
      .from('user_settings')
      .select('user_id, push_subscription, notification_preferences')
      .not('push_subscription', 'is', null)

    if (error) throw error

    let sentCount = 0;
    const dbNotifications = [];

    for (const targetUser of users) {
      const prefs = targetUser.notification_preferences || {};
      
      if (prefs.app_updates) {
        await webPush.sendNotification(targetUser.push_subscription, JSON.stringify({
          title: title,
          message: message,
          url: "/" 
        })).catch(e => console.log('Gönderim hatası:', e));
        
        dbNotifications.push({
          user_id: targetUser.user_id,
          type: 'broadcast',
          title: title,
          message: message,
          link: '/',
          is_interactive: true
        });

        sentCount++;
      }
    }

    if (dbNotifications.length > 0) {
      const { error: dbError } = await supabaseAdmin.from('notifications').insert(dbNotifications);
      if (dbError) console.error("Veritabanı kayıt hatası:", dbError);
    }

    return new Response(JSON.stringify({ success: true, sentCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})