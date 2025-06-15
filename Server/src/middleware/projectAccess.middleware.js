import Project from "../models/Project.model.js";

export const isOwnerOrAdmin = async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.user._id;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is in the team and has role of owner or admin
    const teamMember = project.team.find(
      (member) => member.user.toString() === userId.toString()
    );

    if (!teamMember || !["owner", "admin"].includes(teamMember.role)) {
      return res.status(403).json({ message: "Access denied. Admins and owners only." });
    }

    // Attach the project to the request for further use if needed
    req.project = project;

    next();
  } catch (error) {
    console.error("Error in role-check middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
