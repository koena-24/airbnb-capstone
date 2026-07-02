const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const { getHostDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/host", auth, authorize("host", "admin"), getHostDashboard);

module.exports = router;