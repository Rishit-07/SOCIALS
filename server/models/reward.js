const mongoose = require("mongoose");
const rewardSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    reward:{
        type: String,
        enum: ["Streak", "Winner", "Participation"],
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
},{timestamps:true});
module.exports = mongoose.model("Reward",rewardSchema);