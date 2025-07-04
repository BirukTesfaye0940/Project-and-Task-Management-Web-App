import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

// Import DB and Routes
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/projects.route.js";
import taskRoutes from "./routes/tasks.route.js";
import notificationRoutes from "./routes/notifications.route.js";
import issuesRoutes from './routes/issues.route.js';
import inviteRoute from './routes/invite.route.js';

// Load environment variables
dotenv.config();

// Initialize express and server
const app = express();
const server = http.createServer(app);

// ⚠️ Open CORS Policy (Allow all origins)
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || []; // still loaded for future use

// 🧠 Secure version to reuse later (keep this as reference)
/*
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
*/

// 🚀 Open version for flexible deployments (e.g., Vercel preview URLs)
app.use(cors({ origin: true, credentials: true }));

// Socket.IO setup — also allow all origins
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach io to app so controllers can access it
app.set("io", io);

// Handle socket connections
io.on("connection", (socket) => {
  console.log("⚡️ User connected:", socket.id);

  // Join room based on user ID
  socket.on("join", (userId) => {
    console.log(`User ${userId} joined their personal room.`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("⚡️ User disconnected:", socket.id);
  });
});

app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("Task Management API is running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/invite", inviteRoute);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
