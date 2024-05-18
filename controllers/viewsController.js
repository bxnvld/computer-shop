const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getOverview = catchAsync(async (req, res) => {
  // get product data from collection
  const products = await Product.find();

  // build template
  // render with data
  res.status(200).render("overview", {
    title: "All products",
    products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  //get the data from the requested tour
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!product) {
    return next(new AppError("There is no product with this name", 404));
  }

  //build template
  //render using data
  res.status(200).render("product", {
    title: product.name,
    product,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.getSignForm = catchAsync(async (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up your account",
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
