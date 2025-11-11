const Provider = require('../models/Provider');
const User = require('../models/User');

const createProvider = async (req, res) => {
  try {
    const {
      businessName,
      description,
      specialties,
      serviceArea,
      availability,
      pricing
    } = req.body;

    // Check if user is already a provider
    const existingProvider = await Provider.findOne({ userId: req.userId });
    if (existingProvider) {
      return res.status(400).json({ message: 'Provider profile already exists' });
    }

    // Update user role to provider
    await User.findByIdAndUpdate(req.userId, { role: 'provider' });

    const provider = new Provider({
      userId: req.userId,
      businessName,
      description,
      specialties,
      serviceArea,
      availability,
      pricing
    });

    await provider.save();

    res.status(201).json({
      message: 'Provider profile created successfully',
      provider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('userId', '-password')
      .populate('services');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({
      message: 'Provider profile updated successfully',
      provider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchProviders = async (req, res) => {
  try {
    const { 
      specialty, 
      city, 
      verified, 
      minRating,
      page = 1,
      limit = 10 
    } = req.query;

    const query = {};

    if (specialty) {
      query.specialties = specialty;
    }

    if (city) {
      query['serviceArea.cities'] = city;
    }

    if (verified === 'true') {
      query.verified = true;
    }

    const providers = await Provider.find(query)
      .populate('userId', '-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'userId.rating.average': -1 });

    // Filter by rating if specified
    let filteredProviders = providers;
    if (minRating) {
      filteredProviders = providers.filter(p => 
        p.userId.rating.average >= parseFloat(minRating)
      );
    }

    const count = await Provider.countDocuments(query);

    res.json({
      providers: filteredProviders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId })
      .populate('userId', '-password')
      .populate('services');

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProvider,
  getProvider,
  updateProvider,
  searchProviders,
  getMyProviderProfile
};
