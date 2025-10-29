// app/api/email-writer/templates/route.js
import { connectDB } from "@/lib/database.Connection";
import EmailTemplateModel from "@/app/models/EmailTemplate.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const purpose = searchParams.get("purpose");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    let query = { userId };
    if (purpose) {
      query.purpose = purpose;
    }

    const templates = await EmailTemplateModel.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return new Response(
      JSON.stringify({
        success: true,
        templates,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching templates:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch email templates",
      }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId,
      title,
      purpose,
      tone,
      keyPoints,
      generatedEmail,
      isFavorite = false,
    } = body;

    if (!userId || !title || !purpose || !generatedEmail) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: userId, title, purpose, generatedEmail",
        }),
        { status: 400 }
      );
    }

    const newTemplate = new EmailTemplateModel({
      userId,
      title,
      purpose,
      tone,
      keyPoints,
      generatedEmail,
      isFavorite,
      createdAt: new Date(),
    });

    await newTemplate.save();

    return new Response(
      JSON.stringify({
        success: true,
        template: newTemplate,
        message: "Email template saved successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving template:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to save email template",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { templateId, userId } = body;

    if (!templateId || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Template ID and User ID are required",
        }),
        { status: 400 }
      );
    }

    // Find the template first to verify ownership
    const template = await EmailTemplateModel.findById(templateId);

    if (!template) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Template not found",
        }),
        { status: 404 }
      );
    }

    // Check if the template belongs to the user
    if (template.userId.toString() !== userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "You don't have permission to delete this template",
        }),
        { status: 403 }
      );
    }

    // Delete the template
    await EmailTemplateModel.findByIdAndDelete(templateId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Template deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting template:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to delete template",
      }),
      { status: 500 }
    );
  }
}
