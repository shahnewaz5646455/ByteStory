// app/api/posts/recycle/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";

// GET - Get all recycled posts for a user
export async function GET(request) {
  try {
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find posts that are deleted but not permanently deleted
    const recycledPosts = await Post.find({
      authorId: userEmail,
      isDeleted: true,
    })
      .sort({ deletedAt: -1 })
      .lean();

    const formattedPosts = recycledPosts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      authorImage: post.authorImage,
      imageUrl: post.imageUrl,
      tags: post.tags,
      likes: post.likes,
      loves: post.loves,
      comments: post.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      deletedAt: post.deletedAt,
      daysLeft: Math.max(
        0,
        7 -
          Math.floor(
            (new Date() - new Date(post.deletedAt)) / (1000 * 60 * 60 * 24)
          )
      ),
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching recycled posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
