import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipients: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    message: {
      type: String,
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false, // Optional, for task-related notifications
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false, // Optional, for project-related notifications
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;