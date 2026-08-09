// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import webPush from "npm:web-push"

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

webPush.setVapidDetails('mailto:m3rt7132@gmail.com', vapidPublicKey, vapidPrivateKey)

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const NATIONAL_HOLIDAYS = ["01-01", "04-23", "05-01", "05-19", "07-15", "08-30", "10-29"];
const HEALTH_TIPS = [
  "Gece vardiyasında kafein tüketimini sabah 04:00'ten sonra kesmeye çalışın. Gündüz uykunuzun (REM) kalitesini artırır.",
  "Sabah iş çıkışı eve dönerken güneş gözlüğü takmak, melatonin hormonunun parçalanmasını yavaşlatarak daha hızlı uykuya dalmanızı sağlar.",
  "Gece 02:00 - 04:00 arası vücut ısısı düşer ve uyku bastırır. Bu saatlerde karbonhidrat yerine hafif proteinli atıştırmalıklar enerji verir.",
  "Gündüz uyuduğunuz odanın zifiri karanlık olması (Karartma perde kullanımı), uyku verimini %60 oranında artırır.",
  "Vardiya dönüşümlerinde uyku düzenini sıfırlamak için geçiş günündeki gündüz uykusunu 3-4 saatle (kestirme) sınırlamayı deneyin."
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const now = new Date();
    // UTC saatini Türkiye saati (UTC+3) yapıyoruz
    const trHour = (now.getUTCHours() + 3) % 24; 
    
    // İşçi saat kaçta çalıştı?
    const isMorning = trHour >= 5 && trHour <= 12; // Sabah 08:00 civarı tetiklenmeler
    const isEvening = trHour >= 16 && trHour <= 23; // Akşam 20:00 civarı tetiklenmeler

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const tomorrowMonthDay = `${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const todayDateString = today.toISOString().split('T')[0];
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

    const { data: users, error } = await supabase
      .from('user_settings')
      .select('user_id, push_subscription, notification_preferences, employment_start_date')
      .not('push_subscription', 'is', null)

    if (error) throw error

    // Sadece yarına ait olanları değil, tamamlanmamış TÜM hatırlatmaları çekiyoruz[cite: 2]
    const { data: allReminders } = await supabase
      .from('reminders')
      .select('user_id, content, time_range, date, end_date')
      .eq('is_completed', false);

    const { data: absentLogs } = await supabase.from('work_logs').select('user_id, date').eq('status', 'absent').gte('date', firstDayOfMonth);

    const absentCounts = {};
    if (absentLogs) absentLogs.forEach(log => absentCounts[log.user_id] = (absentCounts[log.user_id] || 0) + 1);

    let sentCount = 0;
    const dbNotifications = [];

    const sendAndLog = async (user_id, sub, type, title, message, link, isInteractive = true) => {
      await webPush.sendNotification(sub, JSON.stringify({ title, message, url: link })).catch(() => {});
      dbNotifications.push({ user_id, type, title, message, link, is_interactive: isInteractive });
      sentCount++;
    };

    for (const user of users) {
      const prefs = user.notification_preferences || {};
      const sub = user.push_subscription;
      const uid = user.user_id;

      // ============================================
      // YENİ HATIRLATMA SİSTEMİ (3 AŞAMALI)
      // ============================================
      if (prefs.reminders && allReminders) {
        const userRems = allReminders.filter(r => r.user_id === uid);
        
        // 1. Bugünün Görevleri: Bitiş tarihi varsa ve bugün aralıktaysa VEYA bitiş tarihi yoksa ve tarih bugünse
        const todayRems = userRems.filter(r => r.end_date ? (todayDateString >= r.date && todayDateString <= r.end_date) : r.date === todayDateString);
        
        // 2. Yarının Görevleri
        const tomorrowRems = userRems.filter(r => r.end_date ? (tomorrowDateString >= r.date && tomorrowDateString <= r.end_date) : r.date === tomorrowDateString);
        
        // 3. Geciken Görevler: Bitiş tarihi varsa ve bugün ondan büyükse VEYA bitiş tarihi yoksa ve tarih bugünden küçükse
        const overdueRems = userRems.filter(r => r.end_date ? (r.end_date < todayDateString) : (r.date < todayDateString));

        // SABAH AKSİYONU
        if (isMorning && todayRems.length > 0) {
          const msg = todayRems.length === 1 ? `[Bugün] ${todayRems[0].time_range ? '('+todayRems[0].time_range+') ' : ''}${todayRems[0].content}` : `Bugün için planlanmış ${todayRems.length} adet göreviniz bulunuyor.`;
          await sendAndLog(uid, sub, 'reminder', "⏰ Bugünün Planı", msg, "/", true);
        }

        // AKŞAM AKSİYONU (Ön Uyarı)
        if (isEvening && tomorrowRems.length > 0) {
          const msg = tomorrowRems.length === 1 ? `[Yarın] ${tomorrowRems[0].time_range ? '('+tomorrowRems[0].time_range+') ' : ''}${tomorrowRems[0].content}` : `Yarın için planlanmış ${tomorrowRems.length} adet göreviniz bulunuyor.`;
          await sendAndLog(uid, sub, 'reminder', "📅 Yarına Dair Notunuz Var", msg, "/", true);
        }

        // AKŞAM AKSİYONU (Gecikenler - Sadece Pazar Günleri Darlar)
        if (isEvening && today.getDay() === 0 && overdueRems.length > 0) {
          const msg = overdueRems.length === 1 ? `Süresi geçen görev: ${overdueRems[0].content}` : `Tamamlanmamış ve süresi geçmiş ${overdueRems.length} adet göreviniz bulunuyor.`;
          await sendAndLog(uid, sub, 'risk', "⚠️ Geciken Görevleriniz Var!", msg, "/", true);
        }
      }

      // ============================================
      // DİĞER BİLDİRİMLER (Sadece Akşamları Çift Atmayı Önlemek İçin)
      // ============================================
      if (isEvening) {
        if (prefs.shift_changes && today.getDay() === 0) { 
          await sendAndLog(uid, sub, 'shift', "🔄 Yarın Yeni Hafta!", "Vardiyanız değişiyor olabilir. Uyku düzeninizi ayarlamayı unutmayın.", "/", true);
        }
        if (prefs.payroll && tomorrow.getDate() === 1) { 
          await sendAndLog(uid, sub, 'payroll', "💰 Aylık Bordronuz Hazır", "Bu ayı tamamladık. Toplam hakedişinizi görmek için dokunun.", "/calculations", true);
        }
        if (prefs.holidays && NATIONAL_HOLIDAYS.includes(tomorrowMonthDay)) {
          await sendAndLog(uid, sub, 'holiday', "🎉 Yarın Resmi Tatil!", "Mesaiye kalırsanız takvime işlemeyi unutmayın, çift yevmiye yazılacak.", "/worktime", true);
        }
        if (prefs.annual_leave && user.employment_start_date) {
          const empDate = user.employment_start_date; 
          const empMonthDay = empDate.substring(5, 10);
          const empYear = parseInt(empDate.substring(0, 4));
          if (empMonthDay === todayMonthDay && today.getFullYear() > empYear) {
            const workedYears = today.getFullYear() - empYear;
            await sendAndLog(uid, sub, 'annual_leave', "🌴 Yıllık İzniniz Güncellendi!", `Tebrikler! İşyerinizde ${workedYears}. yılınızı doldurdunuz. Yeni izin haklarınızı kontrol edin.`, "/calculations", true);
          }
        }
        if (prefs.risks && absentCounts[uid] >= 2) {
          await sendAndLog(uid, sub, 'risk', "⚠️ Yasal Devamsızlık Riski!", `Bu ay ${absentCounts[uid]} gün devamsızlık girdiniz. İş Kanunu sınırına yaklaşıyorsunuz.`, "/faq", true);
        }
        if (prefs.daily_log) {
          await sendAndLog(uid, sub, 'shift', "📝 Mesainizi Girdiniz mi?", "Bugün çalıştıysanız veya mesaiye kaldıysanız takvime işlemeyi unutmayın.", "/worktime", true);
        }
        if (prefs.weekly_summary && today.getDay() === 0) {
          await sendAndLog(uid, sub, 'shift', "📊 Haftalık Raporunuz", "Bu haftayı geride bıraktık. Toplam mesai sürenizi ve istatistiklerinizi takvimden inceleyebilirsiniz.", "/worktime", true);
        }
        if (prefs.night_shift_health && (today.getDay() === 2 || today.getDay() === 5)) {
          const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
          await sendAndLog(uid, sub, 'shift', "🌙 Gece Vardiyası Asistanı", randomTip, "/faq", true);
        }
      }
    }

    if (dbNotifications.length > 0) {
      await supabase.from('notifications').insert(dbNotifications);
    }

    return new Response(JSON.stringify({ success: true, processedUsers: users.length, notificationsSent: sentCount }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})