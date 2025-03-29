import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Pusher from "pusher";

import { PORT } from "../Backend/config/env.js";
import ngoRouter from "./routes/ngo.routes.js";
import hotelRouter from "./routes/hotels.routes.js";
import volunteerRouter from "./routes/volunteer.route.js";
import Nauthorize from "./middleware/ngo.auth.middleware.js";
import Hauthorize from "./middleware/hotel.auth.middleWare.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
dotenv.config();

const app = express();
app.use(express.json());
// app.use(arcjetMiddleware);

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

app.use("/api/v1/ngo", ngoRouter);
app.use("/api/v1/hotel", hotelRouter);
app.use("/api/v1/volunteer", volunteerRouter);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("API Running..."));

app.post("/restregister", (req, res) => {});

app.post("/restlogin", (req, res) => {});
app.get("/", (req, res) => res.send("Welcome to backend of foodbride"));
app.get("/notification", (req, res) => {
  res.sendFile(Path.join(__dirname, "notification.html"));
});

app.post("/sent-notification", (req, res) => {
  const { message, recipient } = req.body;
  pusher.trigger("notifications", "new-notification", {
    message: message,
    recipient: recipient,
  });
  res.status(200).json({
    success: true,
    message: "Notification sent successfully",
  });
});

//const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log("MongoDB Connected");
  console.log(`Server running on port ${PORT}`);
});

// Testing
