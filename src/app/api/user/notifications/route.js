import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import UserNotification from "@/app/models/UserNotification";

// GET - User notifications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const skip = (page - 1) * limit;

    const notifications = await UserNotification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await UserNotification.countDocuments({
      recipientId: userId,
    });
    const unreadCount = await UserNotification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    const formattedNotifications = notifications.map((notification) => ({
      id: notification._id.toString(),
      type: notification.type,
      recipientId: notification.recipientId,
      senderId: notification.senderId,
      senderName: notification.senderName,
      senderImage: notification.senderImage,
      postId: notification.postId,
      postTitle: notification.postTitle,
      commentId: notification.commentId,
      commentContent: notification.commentContent,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      // Human readable message
      message: getNotificationMessage(notification),
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PUT(request) {
  try {
    const { userId, notificationIds } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let updateQuery = { recipientId: userId, isRead: false };

    if (notificationIds && notificationIds.length > 0) {
      updateQuery._id = { $in: notificationIds };
    }

    await UserNotification.updateMany(updateQuery, { $set: { isRead: true } });

    return NextResponse.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to create human readable messages
function getNotificationMessage(notification) {
  const { type, senderName, postTitle, commentContent } = notification;

  switch (type) {
    case "post_like":
      return `${senderName} liked your post "${postTitle}"`;
    case "post_comment":
      return `${senderName} commented on your post "${postTitle}": "${commentContent}"`;
    case "comment_like":
      return `${senderName} liked your comment on "${postTitle}"`;
    case "post_love":
      return `${senderName} loved your post "${postTitle}"`;
    default:
      return "New notification";
  }
}
