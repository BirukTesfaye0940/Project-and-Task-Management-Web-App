import Issue from "../models/Issue.model.js";
import Project from "../models/Project.model.js";
import Task from "../models/Task.model.js";

// CREATE Issue
export const createIssue = async (req, res) => {
  try {
    const { description, task, project } = req.body;

    // Basic validation
    if (!description) return res.status(400).json({ message: "Description is required" });

    // Validate task and project existence if provided
    if (task) {
      const taskExists = await Task.findById(task);
      if (!taskExists) return res.status(404).json({ message: "Task not found" });
    }

    if (project) {
      const projectExists = await Project.findById(project);
      if (!projectExists) return res.status(404).json({ message: "Project not found" });
    }

    const newIssue = await Issue.create({
      description,
      task,
      project,
      reportedBy: req.user._id,
    });

    res.status(201).json(newIssue);
  } catch (error) {
    console.error("Error creating issue:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET issue by ID
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("task", "title")
      .populate("project", "name")
      .populate("reportedBy", "fullName email");

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.status(200).json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET all issues (optionally filtered by project/task)
export const getAllIssues = async (req, res) => {
  try {
    const { projectId, taskId } = req.query;

    const filter = {};
    if (projectId) filter.project = projectId;
    if (taskId) filter.task = taskId;

    const issues = await Issue.find(filter)
      .populate("task", "title")
      .populate("project", "name")
      .populate("reportedBy", "fullName email");

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error getting issues:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE issue (status, resolution, description, task, or project)
export const updateIssue = async (req, res) => {
    try {
      const { status, resolution, description, task, project } = req.body;
  
      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).json({ message: "Issue not found" });
  
      if (status) issue.status = status;
      if (resolution !== undefined) issue.resolution = resolution;
      if (description !== undefined) issue.description = description;
  
      if (task) {
        const taskExists = await Task.findById(task);
        if (!taskExists) return res.status(404).json({ message: "Task not found" });
        issue.task = task;
      }
  
      if (project) {
        const projectExists = await Project.findById(project);
        if (!projectExists) return res.status(404).json({ message: "Project not found" });
        issue.project = project;
      }
  
      await issue.save();
      res.status(200).json(issue);
    } catch (error) {
      console.error("Error updating issue:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// DELETE issue
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error deleting issue:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
