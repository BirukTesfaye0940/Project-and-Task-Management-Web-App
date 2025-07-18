import Task from "../models/Task.model.js";
import Project from "../models/Project.model.js";
import { createNotification } from "./notification.controller.js";

// CREATE
export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, deadline } = req.body;

    const projectDoc = await Project.findById(project);
    //if (!projectDoc) return res.status(404).json({ message: "Project not found" });

    // Check assigned users are in the project team
    if (assignedTo && assignedTo.length > 0) {
      const teamIds = projectDoc.team.map((member) => member.user.toString());
      const invalidUsers = assignedTo.filter((userId) => !teamIds.includes(userId));
      if (invalidUsers.length > 0) {
        return res.status(400).json({ message: "Some assigned users are not in the project team" });
      }
    }

    const newTask = await Task.create({ title, description, project, assignedTo, status, priority, deadline, createdBy: req.user._id });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Create Task Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL TASKS ASSIGNED TO USER, NOT LINKED TO A PROJECT
// GET ALL TASKS CREATED BY USER, WITHOUT A PROJECT
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user._id,
      $or: [
        { project: null },
        { project: { $exists: false } }
      ]
    }).populate("assignedTo", "fullName email");

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get All Tasks Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// READ
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "fullName email").populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Get Task Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Update Task Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ASSIGN USERS
export const assignUsersToTask = async (req, res) => {
  try {
    const { assignedTo } = req.body; // array of userIds
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    const teamIds = project.team.map((m) => m.user.toString());

    const invalidUsers = assignedTo.filter((id) => !teamIds.includes(id));
    if (invalidUsers.length > 0) {
      return res.status(400).json({ message: "Some users are not in the project team" });
    }

    // Avoid duplicates
    const updatedAssignments = [...new Set([...task.assignedTo.map(id => id.toString()), ...assignedTo])];
    const newAssignments = assignedTo.filter((id) => !task.assignedTo.includes(id));
    task.assignedTo = updatedAssignments;
    await task.save();

    // 🎯 Send notification for new assignees only
    if (newAssignments.length > 0) {
      const io = req.app.get("io"); // get socket instance
      await createNotification({
        recipients: newAssignments,
        message: `You have been assigned to a new task: ${task.title}`,
        taskId: task._id,
        io,
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Assign Users Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

