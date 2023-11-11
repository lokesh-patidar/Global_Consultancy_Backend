const { catchError } = require("../Middleware/CatchError");
const { CartModel } = require("../Models/cartModel");
const { OrderModel } = require("../Models/orderModel");
const nodemailer = require("nodemailer");
const ErrorHandler = require("../Utils/ErrorHandler");
const { config } = require("dotenv");
config();




// Place a new order
exports.placeOrder = catchError(async (req, res, next) => {
     const userId = req.user._id;
     const cart = await CartModel.findOne({ user: userId }).populate('items.product');

     if (!cart) {
          return next(new ErrorHandler('Cart not found for the user', 404));
     }

     // Check if the cart is empty
     if (cart.items.length === 0) {
          return next(new ErrorHandler('Cart is empty. Cannot place an order with an empty cart.', 400));
     }

     // Check if all products in the cart are available
     const unavailableProducts = cart.items.filter(item => !item.product);
     if (unavailableProducts.length > 0) {
          const productNames = unavailableProducts.map(item => item.product.name).join(', ');
          return next(new ErrorHandler(`Product(s) not found: ${productNames}`, 404));
     }

     const totalAmount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

     // Create a new order
     const order = new OrderModel({
          user: userId,
          items: cart.items.map((item) => ({
               product: item.product._id,
               quantity: item.quantity,
          })),
          totalAmount,
     });

     const savedOrder = await order.save();
     await CartModel.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
     const userEmail = req.user.email; // Replace with the user's email
     const orderItemNames = savedOrder.items.map((item) => item.product.name).join(', ');


     const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
               user: 'dominique.torphy@ethereal.email',
               pass: '3E2jcMBRxm2gqCceab'
          }
     });

     
     try {
          const info = await transporter.sendMail({
               from: `<lokeshbansiya29988@gmail.com>`,
               to: `<${userEmail}>`,
               subject: 'Order Placed Successfully',
               text: `Thank you for your order! Your order with items ${orderItemNames} has been placed successfully.`,
          });
          console.log({ 'msg sent': info.messageId });
     }
     catch (error) {
          console.log({ error });
     }
     res.status(201).json({ success: true, message: 'Order placed successfully', order: savedOrder });
});



// Get user's orders
exports.getUserOrders = catchError(async (req, res, next) => {
     const userId = req.user._id;
     const orders = await OrderModel.find({ user: userId }).sort({ createdAt: 'desc' });
     res.status(200).json({ success: true, orders });
});