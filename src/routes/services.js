const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getServiceCategories
} = require('../controllers/serviceController');

router.get('/categories', getServiceCategories);
router.get('/', getServices);
router.get('/:id', getService);
router.post('/', auth, authorize('admin'), createService);
router.put('/:id', auth, authorize('admin'), updateService);
router.delete('/:id', auth, authorize('admin'), deleteService);

module.exports = router;
