import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Validate environment variable
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API configuration error. Please try again later." }, 
        { status: 500 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" }, 
        { status: 400 }
      );
    }

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" }, 
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum 10MB allowed." }, 
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF with error handling
    let extractedText;
    try {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } catch (parseError) {
      console.error("PDF parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to extract text from PDF. The file might be corrupted or encrypted." }, 
        { status: 400 }
      );
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: "PDF does not contain enough text to summarize. Minimum 50 characters required." }, 
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    // Create prompt for summarization
    const prompt = `Please provide a clear and concise summary of the following PDF content. 
    Focus on the main points, key findings, and important information. 
    The summary should be well-structured and easy to understand:\n\n${extractedText}`;

    // Generate summary
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    // Return successful response
    return NextResponse.json({ 
      success: true,
      summary,
      originalLength: extractedText.length,
      summaryLength: summary.length
    });

  } catch (error) {
    console.error("PDF Summarization Error:", error);
    
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