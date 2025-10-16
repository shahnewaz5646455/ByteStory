import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";

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
      content,
      type,
      shared:true,
      timeline:false,
      generated_time: generated_time ?? null,
      visibility,
      user: {
        email: user?.email ?? null,
        name: user?.name ?? null,
      },
      createdAt: new Date(), // <- for sorting
    };

    // Get collection via mongoose connection
    const conn = await connectDB();
    const db = conn.connection.db;                 // important line
    const collection = db.collection("generated_contents");

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        data: { insertedId: result.insertedId },
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
    const email = searchParams.get("email") || undefined;

    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("generated_contents");

    const query = email ? { "user.email": email } : {};
    const items = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (err) {
    console.error("content-saveTo-DB GET error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
