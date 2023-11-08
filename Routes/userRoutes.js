const express = require('express');
const userRoutes = express.Router();
const { AuthValidator } = require('../Middleware/AuthValidation');
const { register, login, getMyProfile, deleteUser } = require('../Controller/userController');

userRoutes.post('/api/v1/register', register);
userRoutes.post('/api/v1/login', login);

userRoutes.get('/api/v1/user-profile', AuthValidator, getMyProfile);
userRoutes.delete('/api/v1/delete-user/:userId', AuthValidator, deleteUser);


module.exports = userRoutes;