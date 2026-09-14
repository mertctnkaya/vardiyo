// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import webPush from "npm:web-push"
import { corsHeaders } from 'npm:@supabase/supabase-js@2.39.3/cors'

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

webPush.setVapidDetails(
  'mailto:m3rt7132@gmail.com',
  vapidPublicKey,
  vapidPrivateKey
)

const supabaseUrl = Deno.env.get('SUPABASE_URL')

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. GÜVENLİK ZIRHI: İstek atan kişinin token'ını alıyoruz
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Yetkisiz işlem: Oturum token\'ı bulunamadı.')
    }
    
    // Sadece token'ın geçerli olup olmadığına bakıyoruz, Service Role'e gerek yok
    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } }
    })
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Yetkisiz işlem: Lütfen önce sisteme giriş yapın.')
    }

    // 2. ASIL İŞLEM
    const { subscription, payload } = await req.json()

    if (!subscription) {
      throw new Error('Abonelik (Subscription) verisi bulunamadı.')
    }

    await webPush.sendNotification(subscription, JSON.stringify(payload))

    return new Response(
      JSON.stringify({ success: true, message: 'Bildirim başarıyla gönderildi.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Bildirim gönderme hatası:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})