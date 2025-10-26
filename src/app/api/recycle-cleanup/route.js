// app/api/recycle-cleanup/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";

export async function GET() {
  try {
    await connectDB();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find posts that were deleted more than 7 days ago
    const expiredPosts = await Post.find({
      isDeleted: true,
      deletedAt: { $lte: sevenDaysAgo },
    });

    // Permanently delete them
    const result = await Post.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: sevenDaysAgo },
    });

    return NextResponse.json({
      message: `Automatically deleted ${result.deletedCount} expired posts`,
      deletedCount: result.deletedCount,
      expiredPosts: expiredPosts.map((post) => ({
        id: post._id.toString(),
        title: post.title,
        deletedAt: post.deletedAt,
      })),
    });
  } catch (error) {
    console.error("Error in automated cleanup:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
