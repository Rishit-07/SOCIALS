//----Import statements----//
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const socket = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");

//----Initialization----//
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
const server = http.createServer(app);
const io = socket(server);

app.get("/",(req,res)=>{
    res.send("API is running...");
});

//----Connecting MongoDB----//
mongoose.connect(process.env.MONGO_URI).then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log(err);
})

//---Registering the routes---//
const authRoutes = require("./routes/auth");
app.use("/api/auth",authRoutes);