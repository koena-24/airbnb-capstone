const Accommodation = require("../models/Accommodation");

const createAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.create({
      ...req.body,
      host: req.user.id,
      hostName: req.user.username
    });

    res.status(201).json({
      success: true,
      message: "Accommodation created successfully.",
      accommodation
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAccommodations = async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = { $regex: type, $options: "i" };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const accommodations = await Accommodation.find(filter)
      .populate("host", "username email role")
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    const total = await Accommodation.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: accommodations.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      accommodations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate(
      "host",
      "username email role"
    );

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found."
      });
    }

    res.status(200).json({ success: true, accommodation });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid accommodation ID."
    });
  }
};

const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found."
      });
    }

    if (accommodation.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this accommodation."
      });
    }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("host", "username email role");

    res.status(200).json({
      success: true,
      message: "Accommodation updated successfully.",
      accommodation: updatedAccommodation
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found."
      });
    }

    if (accommodation.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this accommodation."
      });
    }

    await Accommodation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Accommodation deleted successfully."
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid accommodation ID."
    });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation
};