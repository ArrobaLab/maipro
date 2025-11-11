/* MAIPRO PWA SW (scope: /pwa/) — ES5 seguro + Push Notifications Universal
   --- versión actualizada: añade pushsubscriptionchange que notifica al cliente para re-suscribir --- */

var SW_VERSION = 'maipro-pwa-2';

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

/* --- Notificaciones Push --- */

// Helper para mostrar la notificación
function showNotif(n) {
  var title = n && n.title ? n.title : 'Notificación';
  var opts = {
    body: (n && n.body) ? n.body : '',
    icon: (n && n.icon) ? n.icon : '/icons/icon-192.png',
    badge: (n && n.badge) ? n.badge : undefined,
    image: (n && n.image) ? n.image : undefined,
    data: { url: (n && n.url) ? n.url : (n && n.click_action) ? n.click_action : 'https://maipro.work/pwa/' }
  };
  return self.registration.showNotification(title, opts);
}

// Evento PUSH universal (iOS+Android)
self.addEventListener('push', function(event) {
  if(!event || !event.data) return;
  try{
    var p = event.data.json ? event.data.json() : {};
    var d = p && (p.notification || p.data) ? (p.notification || p.data) : {};
    var n = {
      title: d.title || 'Notificación',
      body:  d.body  || '',
      icon:  d.icon  || '/icons/icon-192.png',
      url:   (p && p.fcmOptions && p.fcmOptions.link) || d.url || d.click_action || 'https://maipro.work/pwa/'
    };
    event.waitUntil(showNotif(n));
  }catch(e){
    event.waitUntil(showNotif({ title:'Ping Maipro', body:'(push-fallback)', icon:'/icons/icon-192.png' }));
  }
});

// Evento de click en notificación
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type:'window', includeUncontrolled:true }).then(function(list){
      for (var i=0;i<list.length;i++){
        var c=list[i]; if (c.url && c.url.indexOf(url)!==-1 && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Cuando la subscripción cambia (ej. caduca), notificamos a los clients para que re-suscriban
self.addEventListener('pushsubscriptionchange', function (event) {
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        try {
          clientList[i].postMessage({ type: 'refresh-subscription' });
        } catch (e) {}
      }
    })
  );
});

/* --- (Opcional) fetch cache logic --- */
self.addEventListener('fetch', function (event) {
  try {
    var req = event.request;
    var method = req.method || 'GET';
    if (method !== 'GET') { return; }
    // Si quieres cachear assets, agrega tu lógica aquí
  } catch (e) {}
});