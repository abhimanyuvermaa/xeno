const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  criteria: {
    spendingThreshold: Number,
    visitCount: Number,
    lastVisitDays: Number,
    // Add more criteria as needed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Segment', segmentSchema);