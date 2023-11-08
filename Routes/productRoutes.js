const express = require('express');
const productRoutes = express.Router();
const { AuthValidator } = require('../Middleware/AuthValidation');
const { deleteProduct, updateProduct, getProducts, createProduct, getProductById, createMultiProduct, deleteAllProducts } = require('../Controller/productController');


// productRoutes.use(AuthValidator);

productRoutes.put('/api/v1/update-product/:productId', AuthValidator, updateProduct);
productRoutes.post('/api/v1/create-product', AuthValidator, createProduct);
productRoutes.post('/api/v1/add-multi-product', AuthValidator, createMultiProduct);

productRoutes.get('/api/v1/get-all-products', getProducts);
productRoutes.get('/api/v1/get-product-by-id/:productId', getProductById);
productRoutes.delete('/api/v1/delete-product/:productId', AuthValidator, deleteProduct);
productRoutes.delete('/api/v1/delete-all-product', AuthValidator, deleteAllProducts);


module.exports = productRoutes;
