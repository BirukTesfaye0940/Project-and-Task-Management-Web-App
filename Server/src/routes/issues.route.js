import express from "express";
import {
  createIssue,
  getIssueById,
  getAllIssues,
  updateIssue,
  deleteIssue,
} from "../controllers/issue.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth protected routes
router.post("/", protectRoute, createIssue);
router.get("/", protectRoute, getAllIssues);
router.get("/:id", protectRoute, getIssueById);
router.patch("/:id", protectRoute, updateIssue);
router.delete("/:id", protectRoute, deleteIssue);

export default router;
