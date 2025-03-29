import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Notification from "./models/Notification.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Send all notifications to the client
  socket.on("get_notifications", async () => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    socket.emit("notifications", notifications);
  });

  // Add a new notification
  socket.on("add_notification", async (message) => {
    const notification = new Notification({ message });
    await notification.save();
    io.emit("new_notification", notification); // Broadcast to all clients
  });

  // Mark all notifications as read
  socket.on("mark_all_read", async () => {
    await Notification.updateMany({}, { read: true });
    io.emit("notifications_updated");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});