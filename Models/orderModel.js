const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
     product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
     },
     quantity: {
          type: Number,
          required: true,
     },
});

const orderSchema = new mongoose.Schema({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
     },
     items: [orderItemSchema],
     totalAmount: {
          type: Number,
          required: true,
     },
     status: {
          type: String,
          enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
          default: 'Pending',
     },
     createdAt: {
          type: Date,
          default: Date.now,
     },
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = { OrderModel };
