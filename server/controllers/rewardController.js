const Reward = require("../models/reward");

const getUserRewards = async (req, res) => {
    try {
        const rewards = await Reward.find({ user: req.user.id })
        res.status(200).json(rewards)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}

const assignReward = async (req, res) => {
    try {
        const { userId, reward, title } = req.body
        const newReward = new Reward({
            user: userId,
            reward: reward,
            title: title,
        })
        await newReward.save()
        res.status(201).json(newReward)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}



module.exports = { getUserRewards, assignReward }