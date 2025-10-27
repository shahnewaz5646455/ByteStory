import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import Post from "@/app/models/Post";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectDB();

    // Direct permanent delete for specific post
    await Post.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Post permanently deleted via cleanup",
    });
  } catch (error) {
    console.error("Error in manual cleanup:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
