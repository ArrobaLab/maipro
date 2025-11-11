const Review = require('../models/Review');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

const createReview = async (req, res) => {
  try {
    const { booking, provider, rating, comment, images } = req.body;

    // Verify booking exists and is completed
    const bookingDoc = await Booking.findById(booking);
    if (!bookingDoc) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (bookingDoc.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Can only review completed bookings' 
      });
    }

    if (bookingDoc.customer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      booking,
      customer: req.userId,
      provider,
      rating,
      comment,
      images
    });

    await review.save();

    // Update provider's rating
    await updateProviderRating(provider);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProviderRating = async (providerId) => {
  try {
    const reviews = await Review.find({ provider: providerId });
    
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const providerDoc = await Provider.findById(providerId);
    if (providerDoc) {
      await User.findByIdAndUpdate(providerDoc.userId, {
        'rating.average': averageRating,
        'rating.count': reviews.length
      });
    }
  } catch (error) {
    console.error('Error updating provider rating:', error);
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ provider: req.params.providerId })
      .populate('customer', 'name profileImage')
      .populate('booking', 'service')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Review.countDocuments({ provider: req.params.providerId });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const respondToReview = async (req, res) => {
  try {
    const { text } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the provider
    const providerProfile = await Provider.findById(review.provider);
    if (!providerProfile || providerProfile.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    review.response = {
      text,
      respondedAt: new Date()
    };

    await review.save();

    res.json({
      message: 'Response added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReview,
  getProviderReviews,
  respondToReview
};
