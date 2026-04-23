const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async(req,res,next)=>{
const token = req.headers.authorization?.split(" ")[1];
if(!token){
    return res.status(401).json({
        message:"Token is not present"
    });
}
try{
const decoded = jwt.verify(token,process.env.JWT_SECRET);
req.user = decoded;
next();
    }catch(err){
        return res.status(401).json({
            message:err.message
        })
    }
}
module.exports = protect;