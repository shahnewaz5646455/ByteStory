import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";

export async function PUT(request, { params }) {
  try {
    // ✅ params await
    const { id } = await params;

    // Get user email from headers (consistent with your frontend)
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, imageUrl, tags } = await request.json();

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the current user is the author of the post
    if (post.authorId !== userEmail) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own posts" },
        { status: 403 }
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: title?.trim() || "",
        content: content.trim(),
        imageUrl: imageUrl || "",
        tags: tags || [],
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      id: updatedPost._id.toString(),
      title: updatedPost.title,
      content: updatedPost.content,
      authorId: updatedPost.authorId,
      authorName: updatedPost.authorName,
      authorImage: updatedPost.authorImage,
      imageUrl: updatedPost.imageUrl,
      tags: updatedPost.tags,
      likes: updatedPost.likes,
      loves: updatedPost.loves,
      comments: updatedPost.comments,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Get user email from headers
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the current user is the author of the post
    if (post.authorId !== userEmail) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own posts" },
        { status: 403 }
      );
    }

    // ✅ SOFT DELETE - Send to Recycle Bin
    await Post.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return NextResponse.json({ message: "Post moved to recycle bin" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
