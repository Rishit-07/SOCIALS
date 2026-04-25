const express = require("express");
const {
	getParticipants,
	getLeaderboard,
	approveParticipant,
	rejectParticipant,
	getPendingParticipants,
	leaveChallenge
} = require("../controllers/participantController");
const protect = require("../middleware/auth");
const router = express.Router();

router.get("/:challengeId", getParticipants);
router.get("/:challengeId/leaderboard", getLeaderboard);
router.get("/:challengeId/pending", protect, getPendingParticipants);
router.delete("/:challengeId/leave", protect, leaveChallenge);
router.put("/:id/approve", protect, approveParticipant);
router.put("/:id/reject", protect, rejectParticipant);

module.exports = router;