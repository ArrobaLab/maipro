const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createReview,
  getProviderReviews,
  respondToReview
} = require('../controllers/reviewController');

router.post('/', auth, createReview);
router.get('/provider/:providerId', getProviderReviews);
router.post('/:id/respond', auth, authorize('provider', 'admin'), respondToReview);

module.exports = router;
