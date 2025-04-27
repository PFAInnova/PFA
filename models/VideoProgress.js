const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optionnel
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  seconds: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
