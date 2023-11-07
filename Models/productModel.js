const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
     picture: {
          type: String,
          required: [true, 'Title is required'],
     },
     name: {
          type: String,
          required: [true, 'Name is required'],
     },
     GenericName: {
          type: String,
          required: [true, 'Generic name is required'],
     },
     rating: {
          type: Number,
     },
     isAvailable: {
          type: Boolean,
     },
     description: {
          type: String,
          required: [true, 'Description is required'],
     },
     price: {
          type: Number,
          required: [true, 'Price is required'],
     },
     qty: {
          type: Number,
          required: [true, 'Quantity is required'],
     }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

module.exports = { ProductModel };
