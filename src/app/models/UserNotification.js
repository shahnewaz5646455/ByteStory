import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    // Notification Type
    type: {
      type: String,
      required: true,
      enum: ["post_like", "post_comment", "comment_like", "post_love"],
    },

    // Who will receive the notification
    recipientId: {
      type: String, // post owner / comment owner
      required: true,
      index: true,
    },

    // Who triggered the notification
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderImage: {
      type: String,
      default: "",
    },

    // Related content
    postId: {
      type: String,
      required: true,
    },
    postTitle: {
      type: String,
      default: "Untitled Post",
    },
    commentId: {
      type: String,
      default: "", // Only for comment_like
    },
    commentContent: {
      type: String,
      default: "", // Only for post_comment
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "user_notifications",
  }
);

// Index for efficient queries
userNotificationSchema.index({ recipientId: 1, createdAt: -1 });
userNotificationSchema.index({ recipientId: 1, isRead: 1 });

const UserNotification =
  mongoose.models.UserNotification ||
  mongoose.model("UserNotification", userNotificationSchema);

export default UserNotification;
