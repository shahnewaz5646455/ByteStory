import mongoose from "mongoose";

// This model will store information about each website visitor
const visitorSchema = new mongoose.Schema(
  {
    // If user is logged in, we store their user ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This connects to your User model
      required: false, // Not required because guests don't have user accounts
    },

    // A unique ID for each browsing session
    sessionId: {
      type: String,
      required: true,
    },

    // Visitor's IP address
    ipAddress: {
      type: String,
      required: true,
    },

    // Browser information
    userAgent: {
      type: String,
      required: true,
    },

    // First page they visited
    landingPage: {
      type: String,
      required: true,
    },

    // Where they came from (Google, Facebook, etc.)
    referrer: {
      type: String,
      required: false,
    },

    // Type of device they're using
    deviceType: {
      type: String,
      enum: ["desktop", "tablet", "mobile"],
      required: true,
    },

    // Browser name (Chrome, Firefox, etc.)
    browser: {
      type: String,
      required: true,
    },

    // Operating system (Windows, Mac, Android, etc.)
    os: {
      type: String,
      required: true,
    },

    // Is this a registered user or guest?
    visitorType: {
      type: String,
      enum: ["guest", "user"],
      default: "guest",
    },
  },
  {
    // This automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create the model if it doesn't exist, or use the existing one
export default mongoose.models.Visitor ||
  mongoose.model("Visitor", visitorSchema);
