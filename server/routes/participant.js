const express = require("express");
const { getParticipants, getLeaderboard } = require("../controllers/participantController");
const router = express.Router();

router.get("/:challengeId", getParticipants);
router.get("/:challengeId/leaderboard", getLeaderboard);

module.exports = router;