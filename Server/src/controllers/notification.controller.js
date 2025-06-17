import Notification from "../models/Notification.model.js";

// Create and emit notification
export const createNotification = async ({ recipients, message, taskId, io }) => {
  const notification = new Notification({
    recipients: recipients.map((id) => ({ user: id })),
    message,
    task: taskId,
  });
  await notification.save();

  // Emit to each recipient's room
  recipients.forEach((userId) => {
    io.to(userId).emit("new-notification", {
      message,
      taskId,
    });
  });

  return notification;
};

// Get notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ "recipients.user": userId })
      .sort({ createdAt: -1 })
      .populate("task", "title")
      .exec();
    res.json(notifications);
  } catch (error) {
    console.error("Fetch Notifications Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
