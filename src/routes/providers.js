const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const {
  createProvider,
  getProvider,
  updateProvider,
  searchProviders,
  getMyProviderProfile
} = require('../controllers/providerController');

router.post('/', createLimiter, auth, createProvider);
router.get('/search', apiLimiter, searchProviders);
router.get('/me', apiLimiter, auth, authorize('provider', 'admin'), getMyProviderProfile);
router.get('/:id', apiLimiter, getProvider);
router.put('/', apiLimiter, auth, authorize('provider', 'admin'), updateProvider);

module.exports = router;
