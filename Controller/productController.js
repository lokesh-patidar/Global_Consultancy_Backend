const { catchError } = require("../Middleware/CatchError");
const { ProductModel } = require("../Models/productModel");
const ErrorHandler = require("../Utils/ErrorHandler");

// Create a new product
exports.createProduct = catchError(async (req, res, next) => {
     const {
          picture,
          name,
          GenericName,
          rating,
          description,
          price,
     } = req.body;

     const product = new ProductModel({
          picture,
          name,
          GenericName,
          rating,
          description,
          price,
          isAvailable: true,
     });
     const savedProduct = await product.save();
     res.status(201).json({ success: true, message: 'Product Created successfully', product: savedProduct });
});


exports.createMultiProduct = catchError(async (req, res, next) => {
     const products = req.body;
     console.log({ products });
     const insertedProducts = await ProductModel.insertMany(products);
     res.status(201).json({ message: 'Products added successfully', data: insertedProducts });
});


exports.getProducts = catchError(async (req, res, next) => {
     const { category, subCategory, title, tags, minPrice, maxPrice } = req.query;
     const filter = {};

     if (category) {
          filter.category = category;
     }
     if (subCategory) {
          filter.subCategory = subCategory;
     }
     if (title) {
          filter.title = new RegExp(title, 'i'); // Case-insensitive search
     }
     if (tags) {
          filter.tags = { $in: tags.split(',') };
     }
     if (minPrice && maxPrice) {
          filter.price = { $gte: minPrice, $lte: maxPrice };
     }
     else if (minPrice) {
          filter.price = { $gte: minPrice };
     }
     else if (maxPrice) {
          filter.price = { $lte: maxPrice };
     }
     const products = await ProductModel.find(filter);
     res.status(200).json({ success: true, message: 'Products get successfully!', products });
});


exports.getProductById = catchError(async (req, res, next) => {
     const productId = req.params.productId;
     const product = await ProductModel.findById(productId);
     if (!product) {
          return next(new ErrorHandler('Product not found!', 404));
     }
     res.status(200).json({ success: true, message: 'Product retrieved successfully', product });
});


exports.updateProduct = catchError(async (req, res, next) => {
     const productId = req.params.productId;
     const updateData = req.body;
     const updatedProduct = await ProductModel.findByIdAndUpdate(
          productId,
          updateData,
          { new: true }
     );
     if (!updatedProduct) {
          return next(new ErrorHandler('Product not found!', 404));
     }
     res.status(200).json({ success: true, message: 'Product updated successfully!', product: updatedProduct });
});


exports.deleteProduct = catchError(async (req, res, next) => {
     const productId = req.params.productId;
     const deletedProduct = await ProductModel.findByIdAndRemove(productId);
     if (!deletedProduct) {
          return next(new ErrorHandler('Product not found!', 404));
     }
     res.status(200).json({ success: true, message: 'Product deleted successfully!', product: deletedProduct });
});



exports.deleteAllProducts = catchError(async (req, res, next) => {
     await ProductModel.deleteMany({});
     res.status(200).json({ message: 'All products deleted successfully' });
});

