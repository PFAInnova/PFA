const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      coursId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      titre: String,
      prix: Number,
      niveau: String,
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
