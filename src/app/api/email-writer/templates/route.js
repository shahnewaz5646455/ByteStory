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
