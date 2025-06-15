import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false, // Optional, as issues may relate to projects
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false, // Optional, as issues may relate to tasks
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    resolution: {
      type: String,
      default: "", // Details on how the issue was resolved
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;