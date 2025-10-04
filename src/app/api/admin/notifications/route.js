import { connectDB } from "@/lib/database.Connection";
import NotificationModel from "@/app/models/Notification.model";
import { NextResponse } from "next/server";

// GET all notifications
export async function GET() {
  try {
    await connectDB();

    const notifications = await NotificationModel.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      notifications: JSON.parse(JSON.stringify(notifications)),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PUT(request) {
  try {
    await connectDB();

    const { notificationIds } = await request.json();

    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await NotificationModel.updateMany(
        { _id: { $in: notificationIds } },
        { $set: { isRead: true, readAt: new Date() } }
      );
    } else {
      // Mark all as read
      await NotificationModel.updateMany(
        { isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

// Delete notification
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: "Notification ID is required" },
        { status: 400 }
      );
    }

    await NotificationModel.findByIdAndDelete(notificationId);

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
