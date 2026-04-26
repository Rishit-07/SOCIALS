const Reward = require("../models/reward");
const { updateUserRarity } = require("../utils/rarityEngine");

const getUserRewards = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const rewards = await Reward.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignReward = async (req, res) => {
    try {
        const { userId, reward, title } = req.body;

        const newReward = new Reward({
            user: userId,
            reward,
            title,
        });

        await newReward.save();

        if (userId) {
            await updateUserRarity(userId);
        }

        res.status(201).json(newReward);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserRewards,
    assignReward,
};