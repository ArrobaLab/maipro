const Service = require('../models/Service');

const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getServices = async (req, res) => {
  try {
    const { 
      category, 
      type, 
      page = 1, 
      limit = 10 
    } = req.query;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = { $in: [type, 'both'] };
    }

    const services = await Service.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Service.countDocuments(query);

    res.json({
      services,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getServiceCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'plumbing', label: 'Plomería', icon: '🔧' },
      { value: 'electrical', label: 'Electricidad', icon: '⚡' },
      { value: 'carpentry', label: 'Carpintería', icon: '🪚' },
      { value: 'painting', label: 'Pintura', icon: '🎨' },
      { value: 'roofing', label: 'Techos', icon: '🏠' },
      { value: 'hvac', label: 'Climatización', icon: '❄️' },
      { value: 'construction', label: 'Construcción', icon: '🏗️' },
      { value: 'remodeling', label: 'Remodelación', icon: '🔨' },
      { value: 'landscaping', label: 'Jardinería', icon: '🌳' },
      { value: 'cleaning', label: 'Limpieza', icon: '🧹' },
      { value: 'other', label: 'Otros', icon: '🛠️' }
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getServiceCategories
};
