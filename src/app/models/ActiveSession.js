import mongoose from "mongoose";

// This model tracks who is currently online
const activeSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    ipAddress: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
      required: true,
    },

    // Last time they were active (updates every 2 minutes)
    lastActive: {
      type: Date,
      default: Date.now,
    },

    // Current page they're viewing
    page: {
      type: String,
      required: true,
    },

    // User or guest?
    userType: {
      type: String,
      enum: ["guest", "user"],
      default: "guest",
    },

    // Store user info for easy display
    userInfo: {
      name: String,
      email: String,
      role: String,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove sessions older than 15 minutes
activeSessionSchema.index({ lastActive: 1 }, { expireAfterSeconds: 900 });

export default mongoose.models.ActiveSession ||
  mongoose.model("ActiveSession", activeSessionSchema);
