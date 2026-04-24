const Participant = require("../models/participant");

const getParticipants = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const participants = await Participant.find({ challenge: challengeId }).populate("user", "name email avatar");
        if (participants.length === 0) {
            return res.status(404).json({
                message: "No participants found"
            });
        }
        return res.status(200).json(participants);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const leaderboard = await Participant.find({ challenge: challengeId })
            .populate("user", "name avatar")
            .sort({ streakCount: -1 });
        if (leaderboard.length === 0) {
            return res.status(404).json({
                message: "No participants found"
            });
        }
        return res.status(200).json(leaderboard);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { getParticipants, getLeaderboard };