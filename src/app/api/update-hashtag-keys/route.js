import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, hashtag_key } = body;

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

    // Update user's email_key count
    const result = await collection.updateOne(
      { email: email.toLowerCase() },
      { $set: { hashtag_key: hashtag_key } }
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
        message: "email keys updated successfully.",
        newCount: hashtag_key
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("update-hashtag-keys API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}