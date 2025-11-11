const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const {
  createReview,
  getProviderReviews,
  respondToReview
} = require('../controllers/reviewController');

router.post('/', createLimiter, auth, createReview);
router.get('/provider/:providerId', apiLimiter, getProviderReviews);
router.post('/:id/respond', apiLimiter, auth, authorize('provider', 'admin'), respondToReview);

module.exports = router;
