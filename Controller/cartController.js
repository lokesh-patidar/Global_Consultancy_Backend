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
               quantity,
          });
     }
     const newCart = await cart.save();
     res.status(200).json({ success: true, message: 'Product added to the cart', cart: newCart });
});
