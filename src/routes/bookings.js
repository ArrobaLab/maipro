const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const {
  createBooking,
  getBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

router.post('/', createLimiter, auth, createBooking);
router.get('/my-bookings', apiLimiter, auth, getMyBookings);
router.get('/provider-bookings', apiLimiter, auth, authorize('provider', 'admin'), getProviderBookings);
router.get('/:id', apiLimiter, auth, getBooking);
router.put('/:id/status', apiLimiter, auth, updateBookingStatus);
router.put('/:id/cancel', apiLimiter, auth, cancelBooking);

module.exports = router;
