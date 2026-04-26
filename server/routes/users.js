const express = require("express");
const User = require("../models/user");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, role } = req.body;

        if (typeof name === "string" && name.trim()) {
            user.name = name.trim();
        }

        if (typeof role === "string" && role.trim()) {
            user.role = role.trim();
        }

        if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;
