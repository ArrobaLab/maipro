const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getServiceCategories
} = require('../controllers/serviceController');

router.get('/categories', apiLimiter, getServiceCategories);
router.get('/', apiLimiter, getServices);
router.get('/:id', apiLimiter, getService);
router.post('/', createLimiter, auth, authorize('admin'), createService);
router.put('/:id', apiLimiter, auth, authorize('admin'), updateService);
router.delete('/:id', apiLimiter, auth, authorize('admin'), deleteService);

module.exports = router;
