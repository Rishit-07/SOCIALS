//---Import statements---//
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//---Registering a user---//
const register = async(req,res)=>{
    try{
        const {name,email,password,} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"Email already exists"
            })
        }

        //---Hashing the password---//
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //---Creating a new User---//
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({
            message:"User registered"
        })

        //---Error Handling---//
    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

//---Login initialization---//
const login = async(req,res)=>{
    try{
    const {email,password} = req.body;
    const existingUser = await User.findOne({email});

    //---Validating Existing User---//
    if(!existingUser){
        return res.status(404).json({
            message:"User not found"
        })
    }

    //---Validating Password---//
    const isMatch = await bcrypt.compare(password,existingUser.password);
    if(!isMatch){
        return res.status(401).json({
            message:"The password does not match"
        })
    }

    //---Generating Token---//
    const token = jwt.sign(
        {id:existingUser._id},
        process.env.JWT_SECRET,
        {expiresIn:"3d"}
    );

    return res.status(200).json({
        token,
        user:{
        id:existingUser._id,
        name:existingUser.name,
        email:existingUser.email,
        role:existingUser.role,
        avatar:existingUser.avatar
        }
    })
}catch(err){
    return res.status(500).json({
        message:err.message
    })
}
}
module.exports = {register,login};