self.addEventListener('push', function(event) {
  if (!event.data) return;

  event.waitUntil(
    (async () => {
      try {
        const data = event.data.json();
        
        const options = {
          body: data.message,
          icon: '/icon-192x192.png',
          badge: '/badge-icon.png',
          vibrate: [100, 50, 100],
          data: {
            url: data.url || '/'
          },
          requireInteraction: false
        };

        return self.registration.showNotification(data.title, options);
      } catch (error) {
        console.error('Bildirim verisi okunamadı:', error);
        return self.registration.showNotification('Vardiyo', { 
          body: 'Yeni bir sistem bildirimi aldınız.' 
        });
      }
    })()
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});