const Challenge = require("../models/challenge");
const Participant = require("../models/participant");
const crypto = require("crypto");
const user = require("../models/user");

const createChallenge = async(req,res)=>{
    try{
        const {title,description,duration,category,startDate} = req.body;
        const inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();
        const newChallenge = new Challenge({
            title,
            description,
            duration,
            category,
            startDate,
            createdBy:req.user.id,
            inviteCode
        })
        await newChallenge.save();
        return res.status(201).json({
            message:"Challenge created.!"
        })
    }catch(err){
         return res.status(500).json({
            message:err.message
        })
    }
}

const joinChallenge = async(req,res)=>{
    try{
        const {inviteCode} = req.body;
        const challenge = await Challenge.findOne({inviteCode});
        if(!challenge){
            return res.status(404).json({
                message:"Challenge not found"
            })
        }
        const user = await Participant.findOne({challenge:challenge._id,user:req.user.id})
        if(user){
            return res.status(400).json({
                message:"Participant already exists"
            })
        }

        const newParticipant = new Participant({
            challenge: challenge._id,
            user: req.user.id
        })
        await newParticipant.save();
        return res.status(200).json({
            message:"New Participant added.!"
        })
    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

const getAllChallenge = async(req,res)=>{
    try{
        const AllChallenges = await Challenge.find();
        return res.status(200).json(AllChallenges)
    }catch(err){
         return res.status(500).json({
            message:err.message
        })
    }
}

const getSingleChallenge = async(req,res)=>{
    try{
        const challengeId = req.params.id;
        const findChallenge = await Challenge.findById(challengeId);
        if(!findChallenge){
            return res.status(404).json({
                message:"Challenge not Found"
            })
        }
        return res.status(200).json(findChallenge);
    }catch(err){
         return res.status(500).json({
            message:err.message
        })
    }
}

module.exports = {createChallenge,joinChallenge,getAllChallenge,getSingleChallenge};