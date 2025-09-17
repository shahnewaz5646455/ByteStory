import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { text } = await req.json();
  const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY }`, // no NEXT_PUBLIC_
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to summarize what we can do " },
      { status: 500 }
    );
  }
}
