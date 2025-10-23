import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";
import UserNotification from "@/app/models/UserNotification";

export async function POST(request, { params }) {
  try {
    // Await params first
    const { id } = await params;

    // Get user email from headers (consistent with your comments API)
    const userEmail = request.headers.get("x-user-email");
    const userName = request.headers.get("x-user-name");
    const userPhoto = request.headers.get("x-user-photo");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reactionType } = await request.json();

    if (!["like", "love"].includes(reactionType)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Facebook-style reaction logic
    const oppositeReaction = reactionType === "like" ? "love" : "like";

    // Check if user already has this reaction
    const hasCurrentReaction = post[`${reactionType}s`].includes(userEmail);
    const hasOppositeReaction =
      post[`${oppositeReaction}s`].includes(userEmail);

    // Store previous state for notification logic
    const hadReactionBefore = hasCurrentReaction || hasOppositeReaction;

    if (hasCurrentReaction) {
      // Remove current reaction if already exists (toggle off)
      post[`${reactionType}s`] = post[`${reactionType}s`].filter(
        (email) => email !== userEmail
      );
    } else {
      // Remove opposite reaction if exists
      post[`${oppositeReaction}s`] = post[`${oppositeReaction}s`].filter(
        (email) => email !== userEmail
      );
      // Add new reaction
      post[`${reactionType}s`].push(userEmail);
    }

    await post.save();

    // NOTIFICATION LOGIC - Create notification only when adding reaction (not removing)
    if (!hadReactionBefore && !hasCurrentReaction) {
      // Only create notification if:
      // 1. User didn't have any reaction before
      // 2. User is not the post owner
      if (post.authorId !== userEmail) {
        await UserNotification.create({
          type: reactionType === "like" ? "post_like" : "post_love",
          recipientId: post.authorId, // Post owner
          senderId: userEmail, // Who reacted
          senderName: userName || "Anonymous",
          senderImage: userPhoto || "",
          postId: id,
          postTitle: post.title || "Your post",
          isRead: false,
        });
      }
    }

    return NextResponse.json({
      message: "Reaction updated",
      hasLike: post.likes.includes(userEmail),
      hasLove: post.loves.includes(userEmail),
      likes: post.likes,
      loves: post.loves,
    });
  } catch (error) {
    console.error("Error updating reaction:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
