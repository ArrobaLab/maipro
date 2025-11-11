const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const User = require('../models/User');

const createBooking = async (req, res) => {
  try {
    const {
      provider,
      service,
      serviceAddress,
      scheduledDate,
      description,
      images
    } = req.body;

    const booking = new Booking({
      customer: req.userId,
      provider,
      service,
      serviceAddress,
      scheduledDate,
      description,
      images,
      timeline: [{
        status: 'pending',
        note: 'Booking created'
      }]
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', '-password')
      .populate({
        path: 'provider',
        populate: { path: 'userId', select: '-password' }
      })
      .populate('service');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    const isCustomer = booking.customer._id.toString() === req.userId.toString();
    const providerProfile = await Provider.findById(booking.provider._id);
    const isProvider = providerProfile && providerProfile.userId.toString() === req.userId.toString();

    if (!isCustomer && !isProvider && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { customer: req.userId };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'provider',
        populate: { path: 'userId', select: '-password' }
      })
      .populate('service')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const providerProfile = await Provider.findOne({ userId: req.userId });
    if (!providerProfile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const query = { provider: providerProfile._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', '-password')
      .populate('service')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const providerProfile = await Provider.findById(booking.provider);
    const isProvider = providerProfile && providerProfile.userId.toString() === req.userId.toString();
    const isCustomer = booking.customer.toString() === req.userId.toString();

    if (!isProvider && !isCustomer && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update booking status
    booking.status = status;
    booking.timeline.push({
      status,
      note: note || `Status updated to ${status}`
    });

    // Update completed jobs count if completed
    if (status === 'completed' && isProvider) {
      await Provider.findByIdAndUpdate(
        booking.provider,
        { $inc: { completedJobs: 1 } }
      );
    }

    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only customer or admin can cancel
    if (booking.customer.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending or accepted bookings
    if (!['pending', 'accepted'].includes(booking.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel booking in current status' 
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.timeline.push({
      status: 'cancelled',
      note: `Booking cancelled: ${reason}`
    });

    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking
};
