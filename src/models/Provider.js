const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  specialties: [{
    type: String,
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
  }],
  serviceArea: {
    radius: {
      type: Number,
      default: 50 // km
    },
    cities: [String]
  },
  availability: {
    monday: { available: Boolean, hours: String },
    tuesday: { available: Boolean, hours: String },
    wednesday: { available: Boolean, hours: String },
    thursday: { available: Boolean, hours: String },
    friday: { available: Boolean, hours: String },
    saturday: { available: Boolean, hours: String },
    sunday: { available: Boolean, hours: String }
  },
  verified: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['license', 'insurance', 'certification']
    },
    url: String,
    verified: Boolean
  }],
  pricing: {
    hourlyRate: Number,
    minimumCharge: Number
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Provider', providerSchema);
