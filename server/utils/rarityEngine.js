const User = require("../models/user");
const Reward = require("../models/reward");
const Participant = require("../models/participant");
const Challenge = require("../models/challenge");

const RARITY_PATTERNS = {
    common: "stars",
    rare: "lightning",
    epic: "flames",
    legendary: "crowns",
    mythic: "runes",
};

const calculateRarity = (stats) => {
    const { winnerCount, rewardCount, completedChallenges, streak } = stats;

    if (winnerCount >= 5 && streak >= 10) return "mythic";
    if (winnerCount >= 3) return "legendary";
    if (rewardCount >= 7) return "epic";
    if (completedChallenges >= 3) return "rare";
    return "common";
};

const updateUserRarity = async (userId) => {
    try {
        const rewards = await Reward.find({ user: userId });
        const rewardCount = rewards.length;
        const winnerCount = rewards.filter(r => r.reward === "Winner").length;
        const streakRewards = rewards.filter(r => r.reward === "Streak").length;

        const participants = await Participant.find({ user: userId, status: "approved" });
        const completedChallenges = participants.filter(p => p.totalCheckIn >= 1).length;
        const maxStreak = participants.reduce((max, p) => Math.max(max, p.streakCount || 0), 0);

        const stats = { winnerCount, rewardCount, completedChallenges, streak: maxStreak };
        const rarity = calculateRarity(stats);
        const iconPattern = RARITY_PATTERNS[rarity];

        await User.findByIdAndUpdate(userId, { cardRarity: rarity, iconPattern });

        return { rarity, iconPattern };
    } catch (err) {
        console.error("Rarity engine error:", err);
    }
};

module.exports = { updateUserRarity, calculateRarity, RARITY_PATTERNS };