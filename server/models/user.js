const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:10
    },
    avatar:{
        type:String,
        default:""
    },
    reward:[
        {
            type: mongoose.Schema.Types.ObjectId,
             ref: "Reward",

        }
    ],
    totalChallengesJoined:{
        type:Number,
        default:0
    },
    totalChallengesWon:{
        type:Number,
        default:0
    }
},
{timestamps:true}
);
module.exports = mongoose.model("User",UserSchema);