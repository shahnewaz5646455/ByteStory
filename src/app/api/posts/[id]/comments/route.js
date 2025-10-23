import Post from "@/app/models/Post";
import { connectDB } from "@/lib/database.Connection";
import { NextResponse } from "next/server";
import UserNotification from "@/app/models/UserNotification";
import UserModel from "@/app/models/User.model";

export async function POST(request, { params }) {
  try {
    // Await params first -
    const { id } = await params;

    // Get user email from headers
    const userEmail = request.headers.get("x-user-email");
    const userName = request.headers.get("x-user-name");
    const userPhoto = request.headers.get("x-user-photo");

    console.log("Headers received:", {
      userEmail,
      userName,
      userPhoto,
    });

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Try multiple sources for user avatar
    let authorImage = userPhoto || "";

    // If no photo in headers, try to fetch from User model
    if (!authorImage) {
      try {
        const userProfile = await UserModel.findOne({ email: userEmail });
        console.log("User profile from DB:", userProfile);

        if (userProfile?.avatar?.url) {
          authorImage = userProfile.avatar.url;
          console.log("Found avatar in DB:", authorImage);
        }
      } catch (err) {
        console.log("Could not fetch user avatar from DB:", err.message);
      }
    }

    console.log("Final authorImage:", authorImage);

    const newComment = {
      content: content.trim(),
      authorId: userEmail,
      authorName: userName || "Anonymous",
      authorImage: authorImage,
      likes: [],
    };

    post.comments.push(newComment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];

    // Create notification if commenter is not the post owner
    if (post.authorId !== userEmail) {
      await UserNotification.create({
        type: "post_comment",
        recipientId: post.authorId,
        senderId: userEmail,
        senderName: userName || "Anonymous",
        senderImage: authorImage,
        postId: id,
        postTitle: post.title || "Your post",
        commentContent: content.trim().substring(0, 100),
        isRead: false,
      });
    }

    return NextResponse.json({
      id: savedComment._id?.toString() || savedComment._id,
      content: savedComment.content,
      authorId: savedComment.authorId,
      authorName: savedComment.authorName,
      authorImage: savedComment.authorImage,
      likes: savedComment.likes || [],
      createdAt: savedComment.createdAt,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
