const Challenge = require("../models/challenge");
const Participant = require("../models/participant");
const User = require("../models/user");
const crypto = require("crypto");
const { createJoinNotification } = require("./notificationController");

const normalizeDate = (value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
};

const getChallengeLifecycleStatus = (challenge) => {
    if (!challenge?.startDate) {
        return "upcoming";
    }

    const start = normalizeDate(challenge.startDate);
    const durationDays = Math.max(Number(challenge.duration) || 0, 1);
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays - 1);

    const today = normalizeDate(new Date());

    if (today < start) {
        return "upcoming";
    }

    if (today > end) {
        return "inactive";
    }

    return "active";
};

const withComputedStatus = (challengeDoc) => {
    const challenge = challengeDoc.toObject ? challengeDoc.toObject() : challengeDoc;
    return {
        ...challenge,
        status: getChallengeLifecycleStatus(challenge),
    };
};

const createChallenge = async (req, res) => {
    try {
        const { title, description, duration, category, startDate, isPublic } = req.body;
        // Ensure duration is a positive integer (days)
        const durationDays = Math.max(1, parseInt(duration, 10) || 1);
        const crypto = require("crypto");
        const inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();

        const newChallenge = new Challenge({
            title,
            description,
            duration: durationDays,
            category,
            startDate,
            isPublic,
            createdBy: req.user.id,
            inviteCode
        });

        await newChallenge.save();

        // Auto-add creator as approved participant
        const creatorParticipant = new Participant({
            challenge: newChallenge._id,
            user: req.user.id,
            status: "approved",
            lastCheckIn: null,
        });
        await creatorParticipant.save();

        return res.status(201).json(newChallenge);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const joinChallenge = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const challenge = await Challenge.findOne({ inviteCode });
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        if (getChallengeLifecycleStatus(challenge) === "inactive") {
            return res.status(400).json({ message: "This challenge has been completed and can no longer be joined." });
        }

        const existingParticipant = await Participant.findOne({
            challenge: challenge._id,
            user: req.user.id,
        });
        if (existingParticipant) {
            return res.status(400).json({ message: "Already a participant" });
        }

        const newParticipant = new Participant({
            challenge: challenge._id,
            user: req.user.id,
            status: challenge.isPublic ? "approved" : "pending",
        });
        await newParticipant.save();

        if (newParticipant.status === "approved") {
            const joiningUser = await User.findById(req.user.id).select("name");
            const joinedUserName = joiningUser?.name || "A new user";

            const challengeParticipants = await Participant.find({
                challenge: challenge._id,
                status: "approved",
            })
                .populate("user", "name");

            const recipientIds = new Set();

            if (challenge.createdBy) {
                recipientIds.add(String(challenge.createdBy));
            }

            for (const participant of challengeParticipants) {
                const participantUserId = String(participant.user?._id || participant.user || "");
                if (participantUserId) {
                    recipientIds.add(participantUserId);
                }
            }

            recipientIds.delete(String(req.user.id));

            const recipientPromises = Array.from(recipientIds).map((userId) =>
                createJoinNotification({
                    userId,
                    challengeId: challenge._id,
                    challengeTitle: challenge.title,
                    joinedUserName,
                })
            );

            await Promise.all(recipientPromises);

            const io = req.app.locals.io;
            if (io) {
                io.to(String(challenge._id)).emit("new-member-joined", {
                    challengeId: String(challenge._id),
                    challengeTitle: challenge.title,
                    joinedUserName,
                    userId: String(req.user.id),
                });
            }
        }

        return res.status(200).json({
            message: challenge.isPublic
                ? "Joined successfully!"
                : "Join request sent! Waiting for approval.",
            status: newParticipant.status,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getAllChallenge = async (req, res) => {
    try {
        const allChallenges = await Challenge.find();
        return res.status(200).json(allChallenges.map(withComputedStatus));
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

const getSingleChallenge = async (req, res) => {
    try {
        const challengeId = req.params.id;
        const findChallenge = await Challenge.findById(challengeId);
        if (!findChallenge) {
            return res.status(404).json({
                message: "Challenge not Found",
            });
        }
        return res.status(200).json(withComputedStatus(findChallenge));
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

const updateChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }
        if (String(challenge.createdBy) !== String(req.user.id)) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { title, description, duration, category, startDate, isPublic } = req.body;

        // Update fields if provided
        if (title !== undefined) challenge.title = title;
        if (description !== undefined) challenge.description = description;
        if (duration !== undefined) challenge.duration = Math.max(1, parseInt(duration, 10) || 1);
        if (category !== undefined) challenge.category = category;
        if (startDate !== undefined) challenge.startDate = startDate;
        if (isPublic !== undefined) challenge.isPublic = isPublic;

        await challenge.save();
        return res.status(200).json(withComputedStatus(challenge));
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }
        if (String(challenge.createdBy) !== String(req.user.id)) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await Challenge.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Challenge deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { createChallenge, joinChallenge, getAllChallenge, getSingleChallenge, updateChallenge, deleteChallenge };
