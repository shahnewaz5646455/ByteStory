import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import { ObjectId } from "mongodb";

// 🚀 GET /api/public-messages
// Fetch all messages (admin) or filtered by email (user)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("public_messages");

    const query = {};
    if (email) query.email = email.toLowerCase();
    if (status) query.status = status;

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
    console.error("GET /public-messages error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🚀 POST /api/public-messages
// When user submits the Contact form
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, phone, topic, message } = body || {};

    if (!email || !message) {
      return NextResponse.json(
        { success: false, message: "Email and message are required." },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("public_messages");

    const doc = {
      name: name || "Anonymous",
      email: email.toLowerCase(),
      subject: subject || "",
      phone: phone || "",
      topic: topic || "general",
      message: message.trim(),
      status: "new",
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        message: "Message saved successfully.",
        data: { insertedId: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /public-messages error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

