const Product = require("./../models/productModel");
const Purchases = require("./../models/purchasingModel");
const User = require("./../models/userModel");
const Reviews = require('./../models/reviewModel');
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const purchasingController = require('./../controllers/purchasingController');

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

exports.getAccount = async(req, res) => {
  const timestamp = Date.now();
  const dateObj = new Date(timestamp);
  const month   = dateObj.getUTCMonth() + 1; // months from 1-12
  const day     = dateObj.getUTCDate();
  const year    = dateObj.getUTCFullYear();

  // Using padded values, so that 2023/1/7 becomes 2023/01/07
  const pMonth        = month.toString().padStart(2,"0");
  const pDay          = day.toString().padStart(2,"0");
  const newPaddedDate = `${year}/${pMonth}/${pDay}`;
  
  const purchasesYear = await Purchases.aggregate([
    {
        $match: {
            purchaseDate: {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`), // Start of the year
                $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`) // Start of the next year
            }
        }
    }
  ]);

  const purchasesMonth = await Purchases.aggregate([
    {
        $match: {
            purchaseDate: {
                $gte: new Date(`${year}-${pMonth}-01T00:00:00.000Z`), // Start of the year
                $lt: new Date(`${year + 1}-${pMonth+1}-01T00:00:00.000Z`) // Start of the next year
            }
        }
    }
  ]);

  const purchasesDay = await Purchases.aggregate([
    {
        $match: {
            purchaseDate: {
                $gte: new Date(`${year}-${pMonth}-${pDay}T00:00:00.000Z`), // Start of the year
                $lt: new Date(`${year + 1}-${pMonth+1}-${pDay+1}T00:00:00.000Z`) // Start of the next year
            }
        }
    }
  ]);

  //year
  const productIDs = purchasesYear.map(el => el.product);
  const products = await Product.find({ _id: {$in: productIDs}});
  const prices = products.map(el => el.price);
  const purchasesYearPrice = prices.reduce((acc, curr) => acc + curr, 0);
  const purchasesYearNum = prices.length;
  //month
  const productIDsM = purchasesMonth.map(el => el.product);
  const productsM = await Product.find({ _id: {$in: productIDsM}});
  const pricesM= productsM.map(el => el.price);
  const purchasesMonthPrice = pricesM.reduce((acc, curr) => acc + curr, 0);
  const purchasesMonthNum = prices.length;
  //day
  const productIDsD = purchasesDay.map(el => el.product);
  const productsD = await Product.find({ _id: {$in: productIDsD}});
  const pricesD= productsD.map(el => el.price);
  const purchasesDayPrice = pricesD.reduce((acc, curr) => acc + curr, 0);
  const purchasesDayNum = prices.length;
  //

  res.status(200).render("account", {
    title: "Your account",
    purchasesYearPrice,
    purchasesYearNum,
    purchasesMonthPrice,
    purchasesMonthNum,
    purchasesDayPrice,
    purchasesDayNum
  });
};

exports.getMyProducts = catchAsync(async (req,res) => {
  const purchases = await Purchases.find({ user:req.user.id});
  //find products with ids from purchases
  const productIDs = purchases.map(el => el.product);
  // select all the products that are in the productsIDs
  const products = await Product.find({ _id: {$in: productIDs}});
  const prices = products.map(el => el.price);
  const totalPrice = prices.reduce((acc, curr) => acc + curr, 0);

  res.status(200).render('overview', {
    title: 'My products',
    products,
    totalPrice
  })
});

exports.getMyReviews = catchAsync(async (req,res) => {
  const reviews = await Reviews.find({ user:req.user.id}).populate({
    path: "product",
    fields: "photo name",
  });

  res.status(200).render('reviews', {
    title: 'My products',
    reviews
  })
  // res.status(200).json({
  //   status:'success',
  //   data: {
  //     reviews
  //   }
  // })
  
});

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

exports.manageProducts = catchAsync(async (req, res) => {
  res.status(200).render('manageProducts', {
    title: 'Managing Products'
  })
});

exports.manageUsers = catchAsync(async (req, res) => {
  res.status(200).render('manageUsers', {
    title: 'Managing User'
  })
});

exports.managePurchases = catchAsync(async (req, res) => {
  res.status(200).render('managePurchases', {
    title: 'Managing Purchases'
  })
});