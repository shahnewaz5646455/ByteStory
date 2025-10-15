// app/api/test-gemini/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(
      'Say \'Hello World\' in JSON format: {\\"message\\": \\"text\\"}'
    );
    const response = await result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Gemini API is working",
        response: text,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        apiKey: process.env.RUBAID_GEMINI_API_KEY ? "Present" : "Missing",
      }),
      { status: 500 }
    );
  }
}
