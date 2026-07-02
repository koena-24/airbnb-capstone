const express = require("express");
const { auth } = require("../middleware/auth");
const { validateRequiredFields } = require("../middleware/validate");

const {
  createReview,
  getAccommodationReviews
} = require("../controllers/reviewController");

const router = express.Router();

router.post(
  "/",
  auth,
  validateRequiredFields(["accommodationId", "rating", "comment"]),
  createReview
);

router.get("/accommodation/:accommodationId", getAccommodationReviews);

module.exports = router;