import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { category, title, limit } = await request.json();

    if (!category || !category.trim()) {
      return Response.json(
        { success: false, error: "Category is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.RUBAID_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const safeLimit = limit && limit > 0 ? Math.min(limit, 10) : 7;

    const systemPrompt = `You are a social media & SEO expert. Suggest ${safeLimit} trending hashtags for a blog in the "${category}" category. ${
      title ? `Blog Title: "${title}".` : ""
    } 
Return ONLY a JSON array like ["#tag1","#tag2"].`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    let tags = [];
    try {
      const match = text.match(/\[.*\]/s);
      if (match) {
        tags = JSON.parse(match[0]);
      } else {
        tags = text
          .split(/\s|,/)
          .map((t) => t.trim())
          .filter((t) => t.startsWith("#"))
          .slice(0, safeLimit);
      }
    } catch (err) {
      console.error("Parse error:", err);
      tags = [];
    }

    return Response.json({ success: true, tags });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate hashtags.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
