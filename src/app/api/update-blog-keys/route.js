import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, blog_key } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // Connect to database
    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("users");

    // Update user's blog_key count
    const result = await collection.updateOne(
      { email: email.toLowerCase() },
      { $set: { blog_key: blog_key } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Blog keys updated successfully.",
        newCount: blog_key
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("update-blog-keys API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}