const express = require('express');
const cartRoutes = express.Router();
const { AuthValidator } = require('../Middleware/AuthValidation');
const { addToCart, getCartItems, increaseCartItemQuantity, removeCartItem, decreaseCartItemQuantity } = require('../Controller/cartController');

cartRoutes.post('/api/v1/add-to-cart/:productId', AuthValidator, addToCart);
cartRoutes.get('/api/v1/get-cart-items', AuthValidator, getCartItems);
cartRoutes.put('/api/v1/increase-quantity/:productId', AuthValidator, increaseCartItemQuantity);
cartRoutes.put('/api/v1/decrease-quantity/:productId', AuthValidator, decreaseCartItemQuantity);
cartRoutes.delete('/api/v1/remove-cart-item/:productId', AuthValidator, removeCartItem);

module.exports = cartRoutes;
