const express = require("express");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/checkout-session/:productId")
  .post(authController.protect, bookingController.getCheckoutSession);

module.exports = router;
