//----Import statements----//
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const socket = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");

//----Initialization----//
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const server = http.createServer(app);
const io = socket(server);

app.get("/", (req, res) => {
    res.send("API is running...");
});

//---Registering the routes---//
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const challengeRoutes = require("./routes/challenge");
app.use("/api/challenges", challengeRoutes);

const checkinRoutes = require("./routes/checkin");
app.use("/api/checkins", checkinRoutes);

const rewardRoutes = require("./routes/reward");
app.use("/api/rewards", rewardRoutes);

const participantRoutes = require("./routes/participant");
app.use("/api/participants", participantRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//----Connecting MongoDB----//
mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log(err);
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('send-message', ({ roomId, message }) => {
        socket.to(roomId).emit('receive-message', message);
    });

    socket.on('join-request', ({ roomId, requester }) => {
        socket.to(roomId).emit('new-join-request', requester);
    });
});
