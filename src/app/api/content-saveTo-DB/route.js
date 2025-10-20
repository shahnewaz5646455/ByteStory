import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      prompt,
      template,
      content,
      type = "blog",
      generated_time, // { time: "08 Oct 2025, 11:22 AM" }
      visibility = "public",
      user, // { email, name }
    } = body || {};

    // Validation
    if (!content || !String(content).trim()) {
      return NextResponse.json(
        { success: false, message: "Content is required." },
        { status: 400 }
      );
    }


const doc = {
  prompt: prompt ?? "",
  template: template ?? "",
  content: content.trim(),
  type,
  shared: true,
  timeline: false,
  generated_time: generated_time?.time ? { time: generated_time.time } : null, // ✅ Fix nested object
  visibility,
  user: {
    email: user?.email ?? null,
    name: user?.name ?? null,
  },
  createdAt: new Date(),
};

    // Get collection via mongoose connection
    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("generated_contents");

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        data: { insertedId: result.insertedId.toString() }, // Convert to string
        message: "Content saved successfully.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("content-saveTo-DB POST error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("Received ID:", id); // Debug log

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing id parameter." },
        { status: 400 }
      );
    }

    // Connect to database
    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("generated_contents");

    // Validate and create ObjectId
    let _id;
    try {
      // Check if the string is a valid 24-character hex string
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error("Invalid ObjectId format");
      }
      _id = new ObjectId(id);
    } catch (err) {
      console.error("Invalid ObjectId:", err);
      return NextResponse.json(
        { success: false, message: "Invalid id format." },
        { status: 400 }
      );
    }

    // Find the document
    const record = await collection.findOne({ _id });

    console.log("Found record:", record ? "Yes" : "No"); // Debug log

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Content not found." },
        { status: 404 }
      );
    }

    // Optional visibility gate (uncomment if needed):
    // if (record.visibility && record.visibility !== "public") {
    //   return NextResponse.json(
    //     { success: false, message: "This content is not public." },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json({ success: true, record }, { status: 200 });
  } catch (err) {
    console.error("content-saveTo-DB GET error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error: " + err.message },
      { status: 500 }
    );
  }
}