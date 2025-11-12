(function () {
  'use strict';

  // Helper: convertir VAPID public key (base64url) a Uint8Array
  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Config por defecto — ajusta rutas si hace falta
  var DEFAULTS = {
    serviceWorkerPath: '/pwa/sw.js', // ruta pública del SW en tu servidor
    scope: '/pwa/',
    subscribeEndpoint: '/api/push/subscribe',
    unsubscribeEndpoint: '/api/push/unsubscribe',
    vapidPublicKey: 'BHB1xHLc7TinEFzRmV1YJEShBc8Tw9Idjerr7DDNxici3GIm-2OmxdpULg5xCc7kleg93Jcr2dLvd0rEXTBf6a0' // reemplazar en runtime o build
  };

  function registerServiceWorker(path, scope) {
    if (!('serviceWorker' in navigator)) {
      return Promise.reject(new Error('Service Worker no soportado'));
    }
    return navigator.serviceWorker.register(path, { scope: scope || '/' });
  }

  function sendSubscriptionToServer(subscription, authToken, endpointUrl) {
    return fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? ('Bearer ' + authToken) : ''
      },
      body: JSON.stringify({ subscription: subscription })
    }).then(function (res) {
      if (!res.ok) throw new Error('Error subiendo la subscripción');
      return res.json();
    });
  }

  // API pública: llamarlo tras login exitoso
  // authToken: string (p. ej. JWT) o null si usas cookie-based sessions
  // options: override de DEFAULTS (por ejemplo vapidPublicKey)
  window.enablePushForLoggedUser = function (authToken, options) {
    options = options || {};
    var cfg = Object.assign({}, DEFAULTS, options);

    if (!('Notification' in window)) {
      return Promise.reject(new Error('Notificaciones no soportadas'));
    }

    return registerServiceWorker(cfg.serviceWorkerPath, cfg.scope)
      .then(function (reg) {
        if (Notification.permission === 'denied') {
          return Promise.reject(new Error('Permiso de notificaciones denegado'));
        }

        var permissionPromise = (Notification.permission === 'default')
          ? Notification.requestPermission()
          : Promise.resolve(Notification.permission);

        return permissionPromise.then(function (permission) {
          if (permission !== 'granted') {
            throw new Error('Permiso no concedido: ' + permission);
          }

          return reg.pushManager.getSubscription().then(function (existingSub) {
            if (existingSub) {
              // Asociar/actualizar en backend
              return sendSubscriptionToServer(existingSub, authToken, cfg.subscribeEndpoint)
                .then(function () { return existingSub; });
            }

            var applicationServerKey = cfg.vapidPublicKey && cfg.vapidPublicKey.indexOf('<VAPID') === -1
              ? urlBase64ToUint8Array(cfg.vapidPublicKey)
              : undefined;

            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: applicationServerKey
            }).then(function (newSub) {
              return sendSubscriptionToServer(newSub, authToken, cfg.subscribeEndpoint).then(function () {
                return newSub;
              });
            });
          });
        });
      });
  };

  // Escuchar mensajes del SW (p. ej. para refresh de subscripción)
  if (navigator.serviceWorker && navigator.serviceWorker.addEventListener) {
    navigator.serviceWorker.addEventListener('message', function (evt) {
      try {
        if (evt && evt.data && evt.data.type === 'refresh-subscription') {
          console.log('SW solicita refrescar subscripción. Llamar a enablePushForLoggedUser con el token del usuario.');
          // Aquí debes invocar enablePushForLoggedUser(authToken) desde tu app si mantienes authToken en memoria.
        }
      } catch (e) { console.warn(e); }
    });
  }
})();
