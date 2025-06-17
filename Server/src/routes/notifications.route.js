import express from "express";
import { getUserNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

// GET /api/notifications/:userId
router.get("/:userId", getUserNotifications);

export default router;
