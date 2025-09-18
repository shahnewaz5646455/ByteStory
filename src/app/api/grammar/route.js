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

    const prompt = `
      Analyze the following text for grammar, spelling, and punctuation errors. 
      Provide a JSON response with this exact structure ONLY:
      {
        "issues": [
          {
            "type": "grammar|spelling|punctuation",
            "message": "Description of the issue",
            "suggestion": "Suggested correction",
            "context": "The text excerpt where the issue occurs"
          }
        ],
        "correctedText": "The fully corrected version of the text"
      }

      Text to analyze: """${text.replace(/"/g, '\\"')}"""
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean possible markdown formatting
    const cleanedText = responseText.replace(/```json|```/g, "").trim();

    let grammarResults;
    try {
      grammarResults = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw response:", responseText);
      grammarResults = {
        issues: [],
        correctedText: text,
      };
    }

    return Response.json({
      success: true,
      ...grammarResults,
    });
  } catch (error) {
    console.error("Grammar check error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to check grammar Sorry Bhai.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
