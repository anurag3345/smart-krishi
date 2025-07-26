const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  farmName: { type: String, default: '' },
  farmLocation: { type: String, default: '' },
  cropTypes: { type: [String], default: [] },
  farmSize: { type: String, default: '' },
  experience: { type: String, default: '' },
  isVerified: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phone: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'farmer'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  farmerProfile: {
    type: farmerProfileSchema,
    default: undefined // Only set if role === 'farmer'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
