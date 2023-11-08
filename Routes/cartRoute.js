const express = require('express');
const cartRoutes = express.Router();
const { AuthValidator } = require('../Middleware/AuthValidation');
const { addToCart } = require('../Controller/cartController');

cartRoutes.post('/api/v1/add-to-cart/:productId', addToCart);

module.exports = cartRoutes;
