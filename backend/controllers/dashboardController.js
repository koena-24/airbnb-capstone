const Accommodation = require("../models/Accommodation");
const Reservation = require("../models/Reservation");

const getHostDashboard = async (req, res) => {
  try {
    const listings = await Accommodation.find({ host: req.user.id }).sort({
      createdAt: -1
    });

    const reservations = await Reservation.find({ host: req.user.id })
      .populate("accommodation")
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    const totalRevenue = reservations.reduce((sum, reservation) => {
      return reservation.status !== "cancelled" ? sum + reservation.totalPrice : sum;
    }, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalListings: listings.length,
        totalReservations: reservations.length,
        totalRevenue
      },
      listings,
      reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getHostDashboard
};