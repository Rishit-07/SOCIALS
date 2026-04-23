const mongoose = require("mongoose");
const challengeSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    duration:{
        type:Number,
        default:0
    },
    createdBy:{
       type: mongoose.Schema.Types.ObjectId,
       ref:"User",
        required:true,
    },
    inviteCode:{
        type:String,
        maxlength:5,
    },
    startdate:{
        type:Date,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    status:{
        type:String,
         enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    }
},
{timestamps:true}
);
module.exports = mongoose.model("Challenge",challengeSchema)