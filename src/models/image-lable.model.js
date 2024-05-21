const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  }
});

const imageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  },
  labels: [labelSchema],
  status: {
    type: String,
    enum: ['review', 'approved', 'rejected'],
    default: 'review'
  }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
