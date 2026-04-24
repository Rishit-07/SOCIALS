const express = require("express");
const { getUserRewards, assignReward } = require("../controllers/rewardController");
const router = express.Router();
const protect = require("../middleware/auth")

router.get("/", protect, getUserRewards);
router.post("/assign", protect, assignReward);

module.exports = router