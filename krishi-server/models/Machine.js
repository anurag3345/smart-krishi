const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const machineSchema = new Schema({
  toolName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tractor', 'Tiller', 'Harvester']
  },
  rentalPrice: {
    type: Number,
    required: true
  },
  availabilityStatus: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    data: Buffer, // Store binary data
    contentType: String // Store MIME type
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
machineSchema.index({ toolName: 'text', category: 1 });

module.exports = mongoose.model('Machine', machineSchema);