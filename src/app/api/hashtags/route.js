import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { category, title, limit, platform } = await request.json();

    if (!category || !category.trim()) {
      return Response.json(
        { success: false, error: "Category is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.RUBAID_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const safeLimit = limit && limit > 0 ? Math.min(limit, 30) : 15;

    const platformTips = {
      instagram: "Include mix of popular (1M+ posts) and niche (10k-100k posts) hashtags. Focus on visual content tags.",
      twitter: "Focus on trending topics and current events. Use 2-3 highly relevant hashtags maximum.",
      tiktok: "Include viral challenge tags, sound tags, and trending topics. Keep it fun and engaging.",
      linkedin: "Use professional, industry-specific hashtags. Focus on business and career topics.",
      facebook: "Mix broad and specific tags. Facebook groups often use specific hashtags.",
      general: "Mix of broad and specific tags. Consider search volume and relevance."
    };

    const systemPrompt = `You are a social media expert specializing in ${platform} marketing. 
Generate ${safeLimit} highly effective hashtags for content in the "${category}" category. 
${title ? `Content Title: "${title}".` : ""}
${platformTips[platform] ? `Platform-specific guidance: ${platformTips[platform]}` : ""}

Return ONLY a JSON array of hashtag strings without the # symbol, like ["tag1","tag2","tag3"].
Ensure hashtags are relevant, trending, and appropriate for the platform.`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    let tags = [];
    try {
      const match = text.match(/\[.*\]/s);
      if (match) {
        tags = JSON.parse(match[0]);
      } else {
        tags = text
          .split(/\s|,|\./)
          .map((t) => t.trim().replace(/^#/, ''))
          .filter((t) => t.length > 1 && t.length < 20)
          .slice(0, safeLimit);
      }
    } catch (err) {
      console.error("Parse error:", err);
      tags = [];
    }

    const uniqueTags = [...new Set(tags)].map(tag => 
      tag.toLowerCase().replace(/\s+/g, '')
    ).filter(tag => tag.length > 0);

    return Response.json({ success: true, tags: uniqueTags.slice(0, safeLimit) });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate hashtags.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}