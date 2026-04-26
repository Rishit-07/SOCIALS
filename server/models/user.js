const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
    role: { type: String, default: "Productivity Warrior" },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
    totalChallengesJoined: { type: Number, default: 0 },
    totalChallengesWon: { type: Number, default: 0 },
    cardRarity: { type: String, default: "common", enum: ["common", "rare", "epic", "legendary", "mythic"] },
    iconPattern: { type: String, default: "stars" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);