const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      return req.body[field] === undefined || req.body[field] === null || req.body[field] === "";
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(", ")}`
      });
    }

    next();
  };
};

module.exports = {
  validateRequiredFields
};