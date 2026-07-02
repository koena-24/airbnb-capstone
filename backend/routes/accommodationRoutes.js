const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const { validateRequiredFields } = require("../middleware/validate");

const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation
} = require("../controllers/accommodationController");

const router = express.Router();

router.post(
  "/",
  auth,
  authorize("host", "admin"),
  validateRequiredFields(["title", "location", "description", "type", "price"]),
  createAccommodation
);

router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);

router.put(
  "/:id",
  auth,
  authorize("host", "admin"),
  updateAccommodation
);

router.delete(
  "/:id",
  auth,
  authorize("host", "admin"),
  deleteAccommodation
);

module.exports = router;