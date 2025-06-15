import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import projectRoutes from './routes/projects.route.js'
import taskRoutes from  './routes/tasks.route.js'

// Load environment variables
dotenv.config();

const app = express();

// Define port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
app.use(cookieParser()); //token
app.use(express.json()); // Parse JSON request bodies

// Basic route
app.get('/', (req, res) => {
  res.send('Task Management API is running!');
});
app.use("/api/auth", authRoutes)
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});