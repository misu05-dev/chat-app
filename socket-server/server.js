const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});


app.get("/", (req, res) => {
  res.send("Socket server is running! 🎉");
});


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join("user_" + userId);
        console.log(`User ${userId} joined room user_${userId}`);
    });
});

// Laravel will call this
app.post("/send_message", (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    console.log("Received message event:", req.body);
    io.to("user_" + receiver_id).emit("receive_message", {
        sender_id,
        message
    });

    res.json({ status: "sent" });
});

server.listen(5000, () => {
    console.log("Socket server running on port 5000");
});