const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  thumbnailUrl: String,
  description: String,
  category: String, // React, Angular, etc.
});

module.exports = mongoose.model('Course', courseSchema);
