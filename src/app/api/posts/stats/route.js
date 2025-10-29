// app/api/posts/stats/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";

export async function GET() {
  try {
    await connectDB();

    // Get total posts count
    const totalPosts = await Post.countDocuments();

    // Get all posts to calculate reactions and comments
    const allPosts = await Post.find({}).lean();

    const totalReactions = allPosts.reduce(
      (total, post) =>
        total + (post.likes?.length || 0) + (post.loves?.length || 0),
      0
    );

    const totalComments = allPosts.reduce(
      (total, post) => total + (post.comments?.length || 0),
      0
    );

    return NextResponse.json({
      stories: totalPosts,
      reactions: totalReactions,
      conversations: totalComments,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
