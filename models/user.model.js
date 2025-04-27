const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  testResults: [
    {
      testId: mongoose.Schema.Types.ObjectId,
      score: Number,
      percentage: Number,
      completedAt: { type: Date, default: Date.now },
    }
  ],
  cv: {
    filename: String,
    path: String,
    mimetype: String,
    uploadedAt: Date,
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

// Champ virtuel pour obtenir la partie de l'email avant "@"
userSchema.virtual('username').get(function() {
  return this.email.split('@')[0];
});

module.exports = mongoose.model("User", userSchema);
