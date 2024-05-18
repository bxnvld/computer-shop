const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const Product = require("./../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/product/${product.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.productId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.summary,
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    session,
  });
});
