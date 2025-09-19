import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { prompt, template } = await request.json();

    if (!prompt || !prompt.trim()) {
      return Response.json(
        { success: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Choose system instructions based on template
    let systemPrompt;
    switch (template) {
      case "blog":
        systemPrompt =
          "You are a professional blog writer. Create a well-structured blog post about:";
        break;
      case "creative":
        systemPrompt =
          "You are a creative writer. Write an engaging story about:";
        break;
      case "academic":
        systemPrompt =
          "You are an academic researcher. Write a formal academic paper about:";
        break;
      case "marketing":
        systemPrompt =
          "You are a marketing copywriter. Create compelling marketing copy about:";
        break;
      default:
        systemPrompt =
          "You are a helpful writing assistant. Create content about:";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`${systemPrompt} ${prompt}`);
    const text = result.response.text();

    return Response.json({ success: true, content: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate content.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
