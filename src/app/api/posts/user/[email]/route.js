import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";

export async function GET(request, { params }) {
  try {
    // ✅ Next.js 14 - params await করতে হবে
    const { email } = await params;

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ শুধু non-deleted posts fetch করুন
    const posts = await Post.find({
      authorId: email,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map((post) => ({
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
      comments: post.comments.map((comment) => ({
        id: comment._id?.toString(),
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorImage: comment.authorImage,
        likes: comment.likes,
        createdAt: comment.createdAt,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isDeleted: post.isDeleted,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
