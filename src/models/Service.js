const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'plumbing',
      'electrical',
      'carpentry',
      'painting',
      'roofing',
      'hvac',
      'construction',
      'remodeling',
      'landscaping',
      'cleaning',
      'other'
    ]
  },
  type: {
    type: String,
    enum: ['residential', 'commercial', 'both'],
    default: 'both'
  },
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'hourly', 'quote'],
      default: 'quote'
    },
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  estimatedDuration: {
    value: Number,
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks']
    }
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);
