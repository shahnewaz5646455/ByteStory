// app/api/email-writer/save/route.js
import { connectDB } from "@/lib/database.Connection";
import EmailTemplateModel from "@/app/models/EmailTemplate.model";

export async function POST(request) {
  try {
    await connectDB();

    const {
      userId,
      title,
      purpose,
      tone,
      keyPoints,
      generatedEmail,
      isFavorite = false,
    } = await request.json();

    const emailTemplate = new EmailTemplateModel({
      userId,
      title,
      purpose,
      tone,
      keyPoints,
      generatedEmail,
      isFavorite,
      wordCount: generatedEmail.body.split(/\s+/).length,
    });

    await emailTemplate.save();

    return new Response(
      JSON.stringify({
        success: true,
        template: emailTemplate,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving email template:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to save email template",
      }),
      { status: 500 }
    );
  }
}
