import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";
import { ObjectId } from "mongodb";

// 🚀 POST /api/public-messages/[id]/reply
// Admin replies to a message
export async function POST(req, { params }) {
  try {
    const { id } = params;
    
    // Validate message ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Valid message ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { text, admin } = body || {};

    // Validate required fields
    if (!text?.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply text is required." },
        { status: 400 }
      );
    }

    if (!admin?.name) {
      return NextResponse.json(
        { success: false, message: "Admin information is required." },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    const db = conn.connection.db;
    const collection = db.collection("public_messages");

    // Check if message exists
    const existingMessage = await collection.findOne({ 
      _id: new ObjectId(id) 
    });

    if (!existingMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found." },
        { status: 404 }
      );
    }

    // Create reply object
    const newReply = {
      _id: new ObjectId(), // Generate new ID for the reply
      from: "admin",
      text: text.trim(),
      by: {
        id: admin.id || null,
        name: admin.name,
        email: admin.email || null
      },
      createdAt: new Date()
    };

    // Update the message with new reply and status
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { replies: newReply },
        $set: { 
          status: "answered",
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to add reply." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reply sent successfully.",
        data: { 
          replyId: newReply._id.toString(),
          message: "Reply has been saved and user will see it in their dashboard."
        }
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("POST /public-messages/[id]/reply error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}