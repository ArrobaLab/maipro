// Ejemplo Express router para /api/push/subscribe y /api/push/unsubscribe
// Ajusta authMiddleware y persistencia a tu stack/DB.

const express = require('express');
const router = express.Router();

// Placeholder de autenticación: reemplaza por tu middleware real.
// Debe establecer req.user = { id: 'user-id', ... }
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  // TODO: decodificar JWT o validar sesión real
  // Ejemplo simple:
  // const user = decodeToken(auth);
  req.user = { id: 'demo-user' }; // REEMPLAZAR
  next();
}

// Mock DB simple (reemplaza por tu BD)
const mockDb = {
  subscriptions: [],
  upsert: function (obj) {
    var found = this.subscriptions.find(function (s) { return s.endpoint === obj.endpoint && s.userId === obj.userId; });
    if (found) Object.assign(found, obj);
    else this.subscriptions.push(obj);
    return Promise.resolve();
  },
  remove: function (endpoint, userId) {
    this.subscriptions = this.subscriptions.filter(function (s) { return !(s.endpoint === endpoint && s.userId === userId); });
    return Promise.resolve();
  }
};

router.post('/subscribe', authMiddleware, express.json(), async function (req, res) {
  try {
    const subscription = req.body.subscription;
    if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'subscription missing' });

    const userId = req.user.id;
    await mockDb.upsert({
      userId: userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys || null,
      raw: subscription
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

router.post('/unsubscribe', authMiddleware, express.json(), async function (req, res) {
  try {
    const endpoint = req.body.endpoint;
    if (!endpoint) return res.status(400).json({ error: 'endpoint missing' });
    await mockDb.remove(endpoint, req.user.id);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
