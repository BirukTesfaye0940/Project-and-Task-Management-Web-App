import Project from "../models/Project.model.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;

    const newProject = await Project.create({
      name,
      description,
      startDate,
      endDate,
      status,
      createdBy: req.user._id, // 👈 Pulled from middleware
      team: [
        {
          user: req.user._id,
          role: "owner",
        },
      ],
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all projects for the logged-in user
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ "team.user": req.user._id })
      .populate("team.user", "-password")
      .populate({
        path: "tasks",
        options: { sort: { deadline: 1 } }, // ✅ Sort tasks by deadline ascending
      });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("team.user", "-password")
      .populate({
        path: "tasks",
        options: { sort: { deadline: 1 } }, // ✅ Sorted by deadline
      });

    if (!project || !project.team.some((t) => t.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Not authorized to view this project" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a project
export const updateProject = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
  
      if (!project || !project.team.some((t) => t.user.equals(req.user._id))) {
        return res.status(403).json({ message: "Not authorized to update this project" });
      }
  
      const updates = { ...req.body };
  
      // 🧠 Add team members safely (no duplicates)
      if (updates.team && Array.isArray(updates.team)) {
        const existingUserIds = project.team.map((t) => t.user.toString());
  
        const newMembers = updates.team.filter(
          (member) => !existingUserIds.includes(member.user)
        );
  
        if (newMembers.length > 0) {
          project.team.push(...newMembers);
        }
  
        delete updates.team; // Remove from updates so it doesn't overwrite
      }
  
      // 🛠 Apply other updates (like name, status, etc.)
      Object.assign(project, updates);
      await project.save();
  
      res.status(200).json(project);
    } catch (error) {
      console.error("Error updating project:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
//remove a team member from  a project
export const removeTeamMember = async (req, res) => {
    try {
      const { id } = req.params; // project ID
      const { userId } = req.body; // user to remove
  
      const project = await Project.findById(id);
  
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Prevent owner from removing themselves
      if (req.user._id.toString() === userId) {
        return res.status(400).json({ message: "You can't remove yourself" });
      }
  
      project.team = project.team.filter((t) => t.user.toString() !== userId);
      await project.save();
  
      res.status(200).json({ message: "Team member removed", team: project.team });
    } catch (error) {
      console.error("Error removing team member:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || !project.team.some((t) => t.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
