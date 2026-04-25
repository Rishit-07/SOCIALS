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

const approveParticipant = async (req, res) => {
    try {
        const participant = await Participant.findById(req.params.id);
        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }
        participant.status = "approved";
        await participant.save();
        return res.status(200).json({ message: "Participant approved" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const rejectParticipant = async (req, res) => {
    try {
        const participant = await Participant.findById(req.params.id);
        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }
        participant.status = "rejected";
        await participant.save();
        return res.status(200).json({ message: "Participant rejected" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getPendingParticipants = async (req, res) => {
    try {
        const participants = await Participant.find({
            challenge: req.params.challengeId,
            status: "pending"
        }).populate("user", "name email");
        return res.status(200).json(participants);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const leaveChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;

        const participant = await Participant.findOne({
            challenge: challengeId,
            user: req.user.id
        });

        if (!participant) {
            return res.status(404).json({ message: "You are not part of this challenge" });
        }

        await Participant.deleteOne({ _id: participant._id });

        return res.status(200).json({ message: "You have left the challenge" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getParticipants,
    getLeaderboard,
    approveParticipant,
    rejectParticipant,
    getPendingParticipants,
    leaveChallenge
};