import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true },
    description: { 
      type: String, 
      default: "" },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    status: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
      default: "to-do",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },    
    deadline: Date,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
