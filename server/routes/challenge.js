const express = require("express");
const {createChallenge,joinChallenge,getAllChallenge,getSingleChallenge} = require("../controllers/challengeController");
const protect = require("../middleware/auth");
const router = express.Router();

router.post("/",protect,createChallenge);
router.post("/join",protect,joinChallenge);
router.get("/",getAllChallenge);
router.get("/:id",getSingleChallenge);

module.exports = router
