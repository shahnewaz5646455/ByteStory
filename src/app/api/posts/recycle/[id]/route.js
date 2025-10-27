import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";

// POST - Restore a post from recycle bin
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Restore the post
    const restoredPost = await Post.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      message: "Post restored successfully",
      post: {
        id: restoredPost._id.toString(),
        title: restoredPost.title,
        content: restoredPost.content,
        authorId: restoredPost.authorId,
        authorName: restoredPost.authorName,
        authorImage: restoredPost.authorImage,
        imageUrl: restoredPost.imageUrl,
        tags: restoredPost.tags,
        likes: restoredPost.likes,
        loves: restoredPost.loves,
        comments: restoredPost.comments,
        createdAt: restoredPost.createdAt,
        updatedAt: restoredPost.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error restoring post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete a post from recycle bin
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Permanently delete the post
    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: "Post permanently deleted" });
  } catch (error) {
    console.error("Error permanently deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
