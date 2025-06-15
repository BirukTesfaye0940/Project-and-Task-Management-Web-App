import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  removeTeamMember
} from "../controllers/project.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isOwnerOrAdmin } from "../middleware/projectAccess.middleware.js";

const router = express.Router();

// Authenticated Routes
router.post("/", protectRoute, createProject);
router.get("/", protectRoute, getAllProjects);
router.get("/:id", protectRoute, getProjectById);

// Only owner/admin can update or delete
router.patch("/:id", protectRoute, isOwnerOrAdmin, updateProject);
router.delete("/:id", protectRoute, isOwnerOrAdmin, deleteProject);
router.patch("/:id/remove-member", protectRoute, isOwnerOrAdmin, removeTeamMember);

export default router;
