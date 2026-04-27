const Checkin = require("../models/checkin");
const Participant = require("../models/participant");
const Challenge = require("../models/challenge");
const { createCheckinNotification } = require("./notificationController");

const checkIn = async (req, res) => {
    try {
        const { challengeId, note } = req.body;

        const participant = await Participant.findOne({
            challenge: challengeId,
            user: req.user.id
        });
        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        const today = new Date().toDateString();
        const alreadyCheckedIn = await Checkin.findOne({
            participant: participant._id,
            createdAt: { $gte: new Date(today) }
        });
        if (alreadyCheckedIn) {
            return res.status(400).json({ message: "Already checked in today" });
        }

        const now = new Date();
        const normalizeDate = (value) => {
            const normalized = new Date(value);
            normalized.setHours(0, 0, 0, 0);
            return normalized;
        };

        const todayDate = normalizeDate(now);
        const lastCheckInDate = participant.lastCheckIn ? normalizeDate(participant.lastCheckIn) : null;

        if (!lastCheckInDate) {
            participant.streakCount = 1;
        } else {
            const diffInMs = todayDate.getTime() - lastCheckInDate.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInDays === 1) {
                participant.streakCount = (participant.streakCount || 0) + 1;
            } else if (diffInDays > 1) {
                participant.streakCount = 1;
            }
        }

        participant.totalCheckIn = (participant.totalCheckIn || 0) + 1;
        participant.lastCheckIn = now;
        await participant.save();

        // Create checkin
        const checkin = new Checkin({
            participant: participant._id,
            challenge: challengeId,
            note
        });
        await checkin.save();

        // Get challenge title for notification
        const challenge = await Challenge.findById(challengeId);

        // Create check-in notification
        await createCheckinNotification(
            req.user.id,
            challengeId,
            challenge?.title || "your challenge"
        );

        return res.status(200).json({ message: "Check-in successful" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
const getCheckIns = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const checkIns = await Checkin.find({ challenge: challengeId }).populate("participant", "user");
        if (checkIns.length === 0) {
            return res.status(404).json({
                message: "No check-ins found for this challenge"
            });
        }
        return res.status(200).json(checkIns);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}
module.exports = { checkIn, getCheckIns };