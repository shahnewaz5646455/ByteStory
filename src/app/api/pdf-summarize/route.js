// app/api/summarize/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Validate environment variable
if (!process.env.NEWAZ_GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.NEWAZ_GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    // Check if API key is available
    if (!process.env.NEWAZ_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API configuration error. Please try again later." }, 
        { status: 500 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const text = formData.get("text");

    if (!text) {
      return NextResponse.json(
        { error: "No text provided for summarization" }, 
        { status: 400 }
      );
    }

    // Validate text length
    if (text.length < 50) {
      return NextResponse.json(
        { error: "Text is too short to summarize. Minimum 50 characters required." }, 
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    // Create prompt for summarization
    const prompt = `Please provide a clear and concise summary of the following text content. 
    Focus on the main points, key findings, and important information. 
    The summary should be well-structured and easy to understand:\n\n${text}`;

    // Generate summary
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    // Return successful response
    return NextResponse.json({ 
      success: true,
      summary,
      originalLength: text.length,
      summaryLength: summary.length
    });

  } catch (error) {
    console.error("Text Summarization Error:", error);
    
    // Handle specific API errors
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key")) {
      return NextResponse.json(
        { error: "Authentication error. Please check API configuration." }, 
        { status: 500 }
      );
    }
    
    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." }, 
        { status: 503 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: "Something went wrong while processing your request. Please try again." }, 
      { status: 500 }
    );
  }
}