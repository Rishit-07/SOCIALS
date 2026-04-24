const express = require("express");
const { checkIn, getCheckIns } = require("../controllers/checkinController");
const router = express.Router();
const protect = require("../middleware/auth")

router.post("/", protect, checkIn);
router.get("/:challengeId", getCheckIns);

module.exports = router