import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required." },
        { status: 400 }
      );
    }

    // Connect to database
    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("users");

    // Find user by email
    const user = await collection.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Remove sensitive data before sending
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        success: true, 
        user: userWithoutPassword 
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("get-user-data API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}