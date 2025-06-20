import express from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  assignUsersToTask,
  getAllTasks,
} from "../controllers/task.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createTask);
router.get("/",protectRoute , getAllTasks);
router.get("/:id", protectRoute, getTaskById);
router.patch("/:id", protectRoute, updateTask);
router.delete("/:id", protectRoute, deleteTask);
router.patch("/:id/assign", protectRoute, assignUsersToTask);

export default router;
