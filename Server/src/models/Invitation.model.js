import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "regular"],
      default: "regular",
    },
    token: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 1000 * 60 * 60 * 48, // 48 hours from now
    },
  },
  {
    timestamps: true,
  }
);

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
