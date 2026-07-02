const express = require("express");
const { auth } = require("../middleware/auth");
const { validateRequiredFields } = require("../middleware/validate");

const {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation
} = require("../controllers/reservationController");

const router = express.Router();

router.post(
  "/",
  auth,
  validateRequiredFields(["accommodationId", "checkIn", "checkOut", "guests"]),
  createReservation
);

router.get("/user", auth, getUserReservations);
router.get("/host", auth, getHostReservations);
router.delete("/:id", auth, deleteReservation);

module.exports = router;