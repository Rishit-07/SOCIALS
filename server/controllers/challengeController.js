const Challenge = require("../models/challenge");
const Participant = require("../models/participant");
const crypto = require("crypto");

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
        const { title, description, duration, category, startDate } = req.body;
        const inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();
        const newChallenge = new Challenge({
            title,
            description,
            duration,
            category,
            startDate,
            createdBy: req.user.id,
            inviteCode,
        });

        newChallenge.status = getChallengeLifecycleStatus(newChallenge);

        await newChallenge.save();
        return res.status(201).json(withComputedStatus(newChallenge));
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

const joinChallenge = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const challenge = await Challenge.findOne({ inviteCode });
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
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

module.exports = { createChallenge, joinChallenge, getAllChallenge, getSingleChallenge, deleteChallenge };
