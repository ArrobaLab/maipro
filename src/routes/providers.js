const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createProvider,
  getProvider,
  updateProvider,
  searchProviders,
  getMyProviderProfile
} = require('../controllers/providerController');

router.post('/', auth, createProvider);
router.get('/search', searchProviders);
router.get('/me', auth, authorize('provider', 'admin'), getMyProviderProfile);
router.get('/:id', getProvider);
router.put('/', auth, authorize('provider', 'admin'), updateProvider);

module.exports = router;
