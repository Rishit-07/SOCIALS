const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const User = require("../models/user");
const { updateUserRarity } = require("../utils/rarityEngine");
const multer = require("multer");
const path = require("path");

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

module.exports = router;