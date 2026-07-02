const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

const createReservation = async (req, res) => {
  try {
    const { accommodationId, checkIn, checkOut, guests } = req.body;

    if (!accommodationId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Accommodation, check-in, check-out and guests are required."
      });
    }

    const accommodation = await Accommodation.findById(accommodationId);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found."
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const timeDiff = endDate - startDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date."
      });
    }

    const subtotal = accommodation.price * nights;
    const discount = nights >= 7 ? (subtotal * accommodation.weeklyDiscount) / 100 : 0;

    const totalPrice =
      subtotal -
      discount +
      accommodation.cleaningFee +
      accommodation.serviceFee +
      accommodation.occupancyTaxes;

    const reservation = await Reservation.create({
      accommodation: accommodation._id,
      user: req.user.id,
      host: accommodation.host,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight: accommodation.price,
      totalPrice
    });

    res.status(201).json({
      success: true,
      message: "Reservation created successfully.",
      reservation
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("accommodation")
      .populate("host", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHostReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host: req.user.id })
      .populate("accommodation")
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found."
      });
    }

    if (
      reservation.user.toString() !== req.user.id &&
      reservation.host.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this reservation."
      });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully."
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid reservation ID."
    });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation
};