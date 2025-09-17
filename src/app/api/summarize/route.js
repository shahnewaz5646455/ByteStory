import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return Response.json(
        { success: false, error: "Text is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prompt for summarization
    const systemPrompt = `
      You are a professional AI text summarizer. 
      Summarize the following text concisely in 3-5 sentences:
      "${text}"
    `;

    const result = await model.generateContent(systemPrompt);
    const summary = result.response.text().trim();

    return Response.json({ success: true, summary });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate summary.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
