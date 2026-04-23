const mongoose = require("mongoose");
const checkInSchema = new mongoose.Schema({
    participant:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Participant"
    },
    challenge:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Challenge"
    },
    checkIn:{
        type:Date,
    },
    note:{
        type:String
    }
},{timestamps:true});
module.exports = mongoose.model("checkIn",checkInSchema);