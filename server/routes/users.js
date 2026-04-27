const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const User = require("../models/user");
const { updateUserRarity } = require("../utils/rarityEngine");
const multer = require("multer");
const path = require("path");
const Reward = require("../models/reward");
const Participant = require("../models/participant");
const Challenge = require("../models/challenge");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get("/profile", protect, async (req, res) => {
    try {
        await updateUserRarity(req.user.id);
        const user = await User.findById(req.user.id).select("-password");
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
    try {
        const { name, role } = req.body;
        const updateData = { name, role };
        if (req.file) {
            updateData.avatar = `/uploads/${req.file.filename}`;
        }
        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");
        await updateUserRarity(req.user.id);
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get("/stats", protect, async (req, res) => {
    try {
        const rewards = await Reward.find({ user: req.user.id });
        const participants = await Participant.find({ user: req.user.id, status: "approved" });
        const createdChallenges = await Challenge.find({ createdBy: req.user.id });

        const winnerCount = rewards.filter(r => r.reward === "Winner").length;
        const totalCheckins = participants.reduce((sum, p) => sum + (p.totalCheckIn || 0), 0);
        const maxStreak = participants.reduce((max, p) => Math.max(max, p.streakCount || 0), 0);

        return res.status(200).json({
            totalCheckins,
            maxStreak,
            winnerCount,
            totalChallenges: participants.length,
            createdChallenges: createdChallenges.length,
            rewardCount: rewards.length,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post("/claim-badge", protect, async (req, res) => {
    try {
        const { badgeId, rewardType, rewardTitle } = req.body;

        // Check if already claimed
        const existing = await Reward.findOne({
            user: req.user.id,
            title: rewardTitle,
        });

        if (existing) {
            return res.status(400).json({ message: "Badge already claimed!" });
        }

        const newReward = new Reward({
            user: req.user.id,
            reward: rewardType,
            title: rewardTitle,
        });
        await newReward.save();

        return res.status(201).json({ message: "Badge claimed!", reward: newReward });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;