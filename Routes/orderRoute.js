const express = require('express');
const orderRoutes = express.Router();
const { AuthValidator } = require('../Middleware/AuthValidation');
const { placeOrder, getUserOrders } = require('../Controller/orderController');

orderRoutes.post('/api/v1/place-order', AuthValidator, placeOrder);
orderRoutes.get('/api/v1/get-my-orders', AuthValidator, getUserOrders);

module.exports = orderRoutes;
