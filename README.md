```markdown
# Push notifications (setup) — MAIPRO PWA

Resumen
- El cliente pide permiso y crea la PushSubscription solo después del login exitoso.
- Service Worker: /pwa/sw.js (scope /pwa/).
- Backend: endpoints para guardar/crear la subscription por usuario.

Archivos añadidos (sugeridos)
- src/push/subscribeAfterLogin.js  -> util cliente (llamar tras login)
- public/sw.js                    -> service worker (actualizado)
- server/routes/push.js           -> ejemplo Express (subscribe/unsubscribe)
- README-push.md                  -> este documento

1) Generar VAPID keys (en tu máquina de desarrollo)
- Usando web-push (Node):
  npx web-push generate-vapid-keys
  -> copia la public key a VAPID_PUBLIC_KEY (client) y la private key al servidor para enviar notificaciones.

2) Configurar la clave pública en el cliente
- Reemplaza el placeholder en src/push/subscribeAfterLogin.js o pasa la clave al llamar:
  enablePushForLoggedUser(authToken, { vapidPublicKey: '<TU_PUBLIC_KEY>' });

3) Llamar tras login
- Dentro del handler de login exitoso, llama al util:
```javascript
// Ejemplo (cliente)
enablePushForLoggedUser('<JWT_O_TOKEN>', { vapidPublicKey: '<TU_PUBLIC_KEY>' })
  .then(function (sub) { console.log('Push enabled', sub); })
  .catch(function (err) { console.warn('Push no activado:', err.message); });
```
- Si usas cookie-based sessions, pasa null como primer parámetro; el backend debe identificar al usuario a partir de la cookie.

4) Backend: guardar la subscription
- Ejemplo: POST /api/push/subscribe recibe { subscription } y asocia subscription.endpoint al usuario autenticado.
- Para enviar push desde Node usa la librería web-push y tu VAPID_PRIVATE_KEY:
```javascript
const webpush = require('web-push');
webpush.setVapidDetails('mailto:tu@correo', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
webpush.sendNotification(subscription, payloadJson);
```

5) Consideraciones UX y seguridad
- No pedir permiso antes del login/antes de contexto explícito; ofrece un botón "Activar notificaciones" en el área personal.
- Si Notification.permission === 'denied', muestra instrucciones para habilitar manualmente en el navegador.
- Mantén mapping 1:N usuario -> subscriptions (varios dispositivos).
- Nunca subas VAPID_PRIVATE_KEY ni otros secretos al repo. Añádelos a variables de entorno en el servidor.

6) Pruebas locales
- Sirve la app bajo HTTPS (Chrome exige HTTPS para Push).
- Asegúrate que /pwa/sw.js se sirva desde la misma origen y scope correcto.
- Tras login, activa y verifica que la suscripción llega al endpoint /api/push/subscribe.

7) Q&A rápidos
- ¿Renovar en cada login? Sí, puedes verificar y re-asociar la subscripción en cada login (regenerar o reusar si existe).
- ¿FCM o VAPID? Si ya usas Firebase por otras razones, puedes adaptar la lógica para getToken() de FCM. El flujo UX (pedir permiso tras login) es el mismo.

Si prefieres, puedo:
- Generarte un patch/zip con estos archivos listos para subir.
- Adaptar el ejemplo backend a tu stack (p. ej. PHP/Laravel) si me dices cuál usas.
```
