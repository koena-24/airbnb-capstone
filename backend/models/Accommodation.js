const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: 1
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 1
    },
    guests: {
      type: Number,
      default: 1,
      min: 1
    },
    type: {
      type: String,
      required: [true, "Accommodation type is required"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 1
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    weeklyDiscount: {
      type: Number,
      default: 0
    },
    cleaningFee: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    occupancyTaxes: {
      type: Number,
      default: 0
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hostName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);