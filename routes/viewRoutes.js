const express = require("express");
const viewsController = require("./../controllers/viewsController"), getAccount = require("../controllers/getAccount");
const authController = require("./../controllers/authController");
const purchasingController = require("./../controllers/purchasingController");

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get("/", 
  purchasingController.createPurchaseCheckout,
  authController.isLoggedIn, 
  viewsController.getOverview
);
router.get(
  "/product/:slug",
  authController.isLoggedIn,
  viewsController.getProduct,
);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewsController.getSignForm);
router.get("/me", authController.protect, getAccount.getAccount);
router.get("/my-products", authController.protect, viewsController.getMyProducts);
router.get("/my-reviews", authController.protect, viewsController.getMyReviews);

router.get("/manage-products", authController.protect, authController.restrictTo('admin','seller'),viewsController.manageProducts);
router.get("/manage-users", authController.protect, authController.restrictTo('admin','seller'),viewsController.manageUsers);
router.get("/manage-purchases", authController.protect, authController.restrictTo('admin','seller'),viewsController.managePurchases);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData,
);

module.exports = router;
