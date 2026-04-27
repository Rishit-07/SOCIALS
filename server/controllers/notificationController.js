const Notification = require("../models/notification");
const Participant = require("../models/participant");
const Checkin = require("../models/checkin");
const Challenge = require("../models/challenge");

const getNotifications = async (req, res) => {
    try {
        await generateNotifications(req.user.id);
        const notifications = await Notification.find({ user: req.user.id })
            .populate("challenge", "title")
            .sort({ createdAt: -1 })
            .limit(50);
        return res.status(200).json(notifications);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        return res.status(200).json({ message: "Marked as read" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        return res.status(200).json({ message: "All marked as read" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const generateNotifications = async (userId) => {
    try {
        const participants = await Participant.find({
            user: userId,
            status: "approved"
        }).populate("challenge");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const participant of participants) {
            if (!participant.challenge) continue;

            const challenge = participant.challenge;
            const challengeStart = new Date(challenge.startDate);
            challengeStart.setHours(0, 0, 0, 0);

            if (today < challengeStart) continue;

            // Check if checked in today
            const todayCheckin = await Checkin.findOne({
                participant: participant._id,
                createdAt: { $gte: today }
            });

            // Reminder notification — if not checked in today
            if (!todayCheckin) {
                const existingReminder = await Notification.findOne({
                    user: userId,
                    challenge: challenge._id,
                    type: "reminder",
                    createdAt: { $gte: today }
                });

                if (!existingReminder) {
                    await Notification.create({
                        user: userId,
                        type: "reminder",
                        title: "⏰ Don't forget to check in!",
                        message: `You haven't checked in for "${challenge.title}" today. Keep your streak alive!`,
                        challenge: challenge._id,
                    });
                }
            }

            // Missed check-in notification — yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const yesterdayCheckin = await Checkin.findOne({
                participant: participant._id,
                createdAt: { $gte: yesterday, $lt: today }
            });

            if (!yesterdayCheckin && yesterday >= challengeStart) {
                const existingMissed = await Notification.findOne({
                    user: userId,
                    challenge: challenge._id,
                    type: "missed",
                    createdAt: { $gte: today }
                });

                if (!existingMissed) {
                    await Notification.create({
                        user: userId,
                        type: "missed",
                        title: "❌ Missed check-in yesterday",
                        message: `You missed your check-in for "${challenge.title}" yesterday. Don't let it happen again!`,
                        challenge: challenge._id,
                    });
                }
            }
        }
    } catch (err) {
        console.error("Notification generation error:", err);
    }
};

const createCheckinNotification = async (userId, challengeId, challengeTitle) => {
    try {
        await Notification.create({
            user: userId,
            type: "checkin",
            title: "✅ Check-in successful!",
            message: `You checked in for "${challengeTitle}". Keep it up!`,
            challenge: challengeId,
        });
    } catch (err) {
        console.error(err);
    }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createCheckinNotification };