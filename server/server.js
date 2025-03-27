require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update if frontend runs on a different port
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const users = {}; // Store connected users
const events = {}; // Store event rooms

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins an event
  socket.on("joinEvent", ({ eventId, userName }) => {
    socket.join(eventId);
    users[socket.id] = { userName, eventId };

    if (!events[eventId]) events[eventId] = [];
    events[eventId].push(userName);

    console.log(`${userName} joined event ${eventId}`);
    io.to(eventId).emit("updateUsers", events[eventId]);
  });

  // Handling messages
  socket.on("sendMessage", ({ eventId, userName, message }) => {
    const msgData = { userName, message, timestamp: new Date() };
    io.to(eventId).emit("newMessage", msgData);
  });

  // User disconnects
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const { eventId, userName } = user;
      events[eventId] = events[eventId].filter((name) => name !== userName);

      io.to(eventId).emit("updateUsers", events[eventId]);
      console.log(`${userName} left event ${eventId}`);

      delete users[socket.id];
    }
  });
});

// Test API Endpoint
app.get("/", (req, res) => {
  res.send("Live Event Streaming Backend is Running!");
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
