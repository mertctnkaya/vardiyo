import { supabase } from './supabaseClient';
import { useToastStore } from '../store/useToastStore';

const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerAndSubscribeToPush(userId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    useToastStore.getState().addToast('Tarayıcınız anlık bildirimleri desteklemiyor.', 'warning');
    return null;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let reg of registrations) {
      await reg.unregister();
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return permission;
    }

    if (!publicVapidKey) {
      useToastStore.getState().addToast('HATA: VAPID Key bulunamadı!', 'error');
      return permission;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    const { error } = await supabase
      .from('user_settings')
      .update({ push_subscription: JSON.parse(JSON.stringify(subscription)) })
      .eq('user_id', userId);

    if (error) {
      useToastStore.getState().addToast('DB HATA: ' + error.message, 'error');
    } else {
      useToastStore.getState().addToast('BAŞARILI: Cihaz sisteme bağlandı!', 'success');
    }

    return permission;

  } catch (error: any) {
    useToastStore.getState().addToast(`SİSTEM HATASI [${error.name}]: ${error.message}`, 'error');
    return null;
  }
}

export async function sendTestNotification(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('push_subscription')
      .eq('user_id', userId)
      .single();

    if (error || !data?.push_subscription) {
      useToastStore.getState().addToast("Cihaz aboneliği bulunamadı. Lütfen önce bildirim izni verin.", 'warning');
      return;
    }

    const { error: funcError } = await supabase.functions.invoke('send-push', {
      body: {
        subscription: data.push_subscription,
        payload: {
          title: "🚀 Test Başarılı!",
          message: "Vardiyo bildirim sistemi cihazınızda kusursuz çalışıyor.",
          url: "/settings"
        }
      }
    });

    if (funcError) {
      console.error("Postacı (Edge Function) hatası:", funcError);
      useToastStore.getState().addToast("Bildirim gönderilemedi. Konsolu kontrol edin.", 'error');
    } else {
      console.log("Mektup postacıya teslim edildi!");
    }
  } catch (err) {
    console.error("Test sırasında beklenmeyen hata:", err);
  }
}
