const mongoose = require("mongoose");
const rewardSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
       type:String,
         enum: ["3-Days Streak", "7-Days Streak", "First Streak"],
    },
    reward:{
       type:String,
         enum: ["Streak", "Winner", "Participation"],
    },
    date:{
        type:Date
    }
},{timestamps:true});
module.exports = mongoose.model("Reward",rewardSchema);