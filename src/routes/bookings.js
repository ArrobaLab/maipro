const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createBooking,
  getBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getMyBookings);
router.get('/provider-bookings', auth, authorize('provider', 'admin'), getProviderBookings);
router.get('/:id', auth, getBooking);
router.put('/:id/status', auth, updateBookingStatus);
router.put('/:id/cancel', auth, cancelBooking);

module.exports = router;
