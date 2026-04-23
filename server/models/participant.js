const mongoose = require("mongoose");
const participantSchema = new mongoose.Schema({
    challenge:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Challenge"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    streakCount:{
        type:Number,
        default:0
    },
    lastCheckIn:{
        type:Date,
        default:null
    },
    totalCheckIn:{
        type:Number,
        default:0
    },
    status:{
        type:String,
         enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    }
},
{timestamps:true});
module.exports = mongoose.model("Participant",participantSchema);
