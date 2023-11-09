const { catchError } = require("../Middleware/CatchError");
const { CartModel } = require("../Models/cartModel");
const { OrderModel } = require("../Models/orderModel");
const nodemailer = require("nodemailer");
const { config } = require("dotenv");
config();


const transporter = nodemailer.createTransport({
     host: "smtp.forwardemail.net",
     port: 465,
     secure: true,
     auth: {
          user: 'lokeshbansiya29988@gmail.com', // Your Gmail email address
          pass: 'lokeshbansiya8822#', // Your Gmail password or an app-specific password
     },
});

console.log({ auth: transporter.auth });


// Place a new order
exports.placeOrder = catchError(async (req, res, next) => {
     const userId = req.user._id;
     const cart = await CartModel.findOne({ user: userId }).populate('items.product');
     if (!cart) {
          return next(new ErrorHandler('Cart not found for the user', 404));
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

     const mailOptions = {
          from: 'lokeshbansiya29988@gmail.com', // Your Gmail email address
          to: userEmail,
          subject: 'Order Placed Successfully',
          text: `Thank you for your order! Your order with items ${orderItemNames} has been placed successfully.`,
     };

     transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
               console.error('Error sending email:', error);
          }
          else {
               console.log('Email sent:', info.response);
          }
     });
     res.status(201).json({ success: true, message: 'Order placed successfully', order: savedOrder });
});

// Get user's orders
exports.getUserOrders = catchError(async (req, res, next) => {
     const userId = req.user._id;
     const orders = await OrderModel.find({ user: userId }).sort({ createdAt: 'desc' });
     res.status(200).json({ success: true, orders });
});