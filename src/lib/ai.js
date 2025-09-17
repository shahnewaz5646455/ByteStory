import axios from "axios";

const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

export async function summarizeText(text) {
  try {
    const res = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );
    return res.data[0].summary_text;
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    return "⚠️ Could not generate summary.";
  }
}
