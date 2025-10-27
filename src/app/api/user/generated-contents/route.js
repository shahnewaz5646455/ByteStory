import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("generated_contents");

    // Build query for user's shared content
    const query = { 
      "user.email": email.toLowerCase(),
      shared: true 
    };

    const total = await collection.countDocuments(query);
    
    const items = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: {
          items,
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("GET /user/generated-contents error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}