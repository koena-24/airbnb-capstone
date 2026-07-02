const Review = require("../models/Review");
const Accommodation = require("../models/Accommodation");

const createReview = async (req, res) => {
  try {
    const { accommodationId, rating, comment } = req.body;

    const accommodation = await Accommodation.findById(accommodationId);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found."
      });
    }

    const review = await Review.create({
      accommodation: accommodationId,
      user: req.user.id,
      rating,
      comment
    });

    const reviews = await Review.find({ accommodation: accommodationId });

    accommodation.reviews = reviews.length;
    accommodation.rating =
      reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;

    await accommodation.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully.",
      review
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAccommodationReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      accommodation: req.params.accommodationId
    })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getAccommodationReviews
};