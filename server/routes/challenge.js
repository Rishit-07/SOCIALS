const express = require("express");
const { createChallenge, joinChallenge, getAllChallenge, getSingleChallenge, updateChallenge, deleteChallenge } = require("../controllers/challengeController");
const protect = require("../middleware/auth");
const router = express.Router();

router.post("/",protect,createChallenge);
router.post("/join",protect,joinChallenge);
router.get("/",getAllChallenge);
router.get("/:id",getSingleChallenge);
router.put("/:id", protect, updateChallenge);
router.delete("/:id", protect, deleteChallenge);


module.exports = router
