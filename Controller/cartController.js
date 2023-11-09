const { catchError } = require("../Middleware/CatchError");
const { CartModel } = require("../Models/cartModel");
const { ProductModel } = require("../Models/productModel");
const ErrorHandler = require("../Utils/ErrorHandler");

// Create a new product
exports.addToCart = catchError(async (req, res, next) => {

     const { productId } = req.params;
     const userId = req.user._id;
     console.log({ userId });
     const product = await ProductModel.findById(productId);
     if (!product) {
          return next(new ErrorHandler('Product not found!', 404));
     }
     let cart = await CartModel.findOne({ user: userId });
     if (!cart) {
          cart = new CartModel({
               user: userId,
               items: [],
          });
     }
     // Check if the product already exists in the cart
     const existingCartItem = cart.items.find((item) =>
          item.product.equals(product._id)
     );

     if (existingCartItem) {
          return next(new ErrorHandler('Item is already added to cart!', 400));
     }
     else {
          cart.items.push({
               product: product._id,
               quantity: 1,
          });
     }
     const newCart = await cart.save();
     res.status(200).json({ success: true, message: 'Product added to the cart', cart: newCart });
});


exports.getCartItems = catchError(async (req, res, next) => {
     const userId = req.user._id;
     const cart = await CartModel.findOne({ user: userId }).populate('items.product');
     // if (!cart) {
     //      return next(new ErrorHandler('Cart not found for the user', 404));
     // }
     res.status(200).json({ success: true, message: 'Cart items', cart: cart.items || [] });
});


exports.removeCartItem = catchError(async (req, res, next) => {
     const { productId } = req.params;
     const userId = req.user._id;
     // Find the user's cart
     const cart = await CartModel.findOne({ user: userId });

     if (!cart) {
          return next(new ErrorHandler('Cart not found for the user', 404));
     }
     // Find the index of the cart item with the given product ID
     const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));

     if (itemIndex === -1) {
          return next(new ErrorHandler('Item not found in the cart', 404));
     }
     cart.items.splice(itemIndex, 1);
     const updatedCart = await cart.save();
     res.status(200).json({ success: true, message: 'Product removed from the cart', cart: updatedCart });
});


exports.increaseCartItemQuantity = catchError(async (req, res, next) => {
     const { productId } = req.params;
     const userId = req.user._id;
     const cart = await CartModel.findOne({ user: userId });
     if (!cart) {
          return next(new ErrorHandler('Cart not found for the user', 404));
     }
     const cartItem = cart.items.find((item) => item.product.equals(productId));
     if (!cartItem) {
          return next(new ErrorHandler('Item not found in the cart', 404));
     }
     const newQuantity = cartItem.quantity + 1;
     if (newQuantity > 10) {
          return next(new ErrorHandler('Quantity limit exceeded (max 10)', 400));
     }
     cartItem.quantity += 1;
     const updatedCart = await cart.save();
     res.status(200).json({ success: true, message: 'Product quantity increased in the cart', cart: updatedCart });
});


exports.decreaseCartItemQuantity = catchError(async (req, res, next) => {
     const { productId } = req.params;
     const userId = req.user._id;
     const cart = await CartModel.findOne({ user: userId });
     if (!cart) {
          return next(new ErrorHandler('Cart not found for the user', 404));
     }
     const cartItem = cart.items.find((item) => item.product.equals(productId));
     if (!cartItem) {
          return next(new ErrorHandler('Item not found in the cart', 404));
     }
     const newQuantity = cartItem.quantity - 1;
     if (newQuantity < 1) {
          return next(new ErrorHandler('Quantity cannot be less than 1', 400));
     }
     cartItem.quantity -= 1;
     const updatedCart = await cart.save();
     res.status(200).json({ success: true, message: 'Product quantity decreased in the cart', cart: updatedCart });
});
