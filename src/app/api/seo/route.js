import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { content } = await request.json();

    if (!content || !content.trim() || content.trim().length < 50) {
      return Response.json(
        { success: false, error: "Content must be at least 50 characters long for SEO analysis." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RUBAID_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing RUBAID_GEMINI_API_KEY environment variable");
      return Response.json(
        { success: false, error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const maxLength = 3000;
    const truncatedContent = content.length > maxLength ? content.substring(0, maxLength) : content;
    const truncationNote = content.length > maxLength ? "Note: Content has been truncated to 3000 characters for analysis." : "";

    // SEO analysis prompt
    const seoPrompt = `
      Act as an expert SEO analyst. Analyze the following content comprehensively and provide detailed SEO recommendations.

      ${truncationNote}

      CONTENT TO ANALYZE:
      """${truncatedContent}"""  [Truncated if too long]

      Please provide a thorough SEO analysis with the following structure:

      {
        "score": 85,
        "overview": "Brief overall assessment of the content's SEO health",
        "strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "improvementAreas": {
          "critical": ["Critical issue 1", "Critical issue 2"],
          "important": ["Important suggestion 1", "Important suggestion 2"],
          "optional": ["Optional improvement 1"]
        },
        "keywordAnalysis": {
          "primaryKeywords": ["keyword1", "keyword2"],
          "keywordOpportunities": ["opportunity1", "opportunity2"],
          "keywordDensity": 2.5
        },
        "contentQuality": {
          "readabilityScore": 75,
          "contentLengthAssessment": "adequate|too short|too long",
          "recommendedWordCount": 1200
        },
        "technicalSeo": ["Technical suggestion 1", "Technical suggestion 2"],
        "actionableTips": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3", "Actionable tip 4", "Actionable tip 5"]
      }

      Guidelines:
      1. Score should be 0-100 based on comprehensive SEO factors
      2. Be specific and actionable in recommendations
      3. Consider: keyword optimization, content structure, readability, meta aspects, technical SEO
      4. Provide 3-5 most critical actionable tips in the actionableTips array
      5. For short content, be more lenient on word count but stricter on other factors
      6. If content is very short (<100 words), provide guidance on ideal content length

      Respond with valid JSON only.
    `;

    const result = await model.generateContent(seoPrompt);
    const rawText = result.response.text();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No valid JSON found in AI response:", rawText);
      throw new Error("Invalid AI response format");
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.score || !parsed.overview || !parsed.actionableTips) {
        throw new Error("Incomplete JSON structure");
      }
      if (!parsed.strengths) parsed.strengths = [];
      if (!parsed.improvementAreas) parsed.improvementAreas = { critical: [], important: [], optional: [] };
      if (!parsed.keywordAnalysis) parsed.keywordAnalysis = { primaryKeywords: [], keywordOpportunities: [] };
      if (!parsed.actionableTips) parsed.actionableTips = [];
    } catch (e) {
      console.error("JSON parsing error:", e, "Raw response:", rawText);
      // Fallback response
      parsed = {
        score: 50,
        overview: "Basic SEO analysis completed due to parsing issues",
        strengths: ["Content is readable"],
        improvementAreas: {
          critical: ["Could not parse detailed analysis"],
          important: [],
          optional: []
        },
        keywordAnalysis: {
          primaryKeywords: [],
          keywordOpportunities: []
        },
        actionableTips: [
          "Ensure content is at least 300 words for better SEO",
          "Include relevant keywords naturally throughout the content",
          "Use headings to structure your content properly"
        ]
      };
    }

    if (parsed.actionableTips.length === 0) {
      parsed.actionableTips = [
        "Add more relevant keywords to improve search visibility",
        "Structure content with proper headings (H2, H3)",
        "Ensure content length is adequate for your topic"
      ];
    }

    return Response.json({ success: true, data: parsed });

  } catch (error) {
    console.error("SEO API error:", error);
    
    // fallback response for error
    const fallbackResponse = {
      score: 50,
      overview: "Basic analysis completed with limited insights",
      strengths: ["Content is provided for analysis"],
      improvementAreas: {
        critical: ["AI analysis temporarily unavailable"],
        important: ["Check back later for detailed analysis"],
        optional: []
      },
      keywordAnalysis: {
        primaryKeywords: [],
        keywordOpportunities: []
      },
      actionableTips: [
        "Aim for content length of 1000-2000 words for comprehensive topics",
        "Include your primary keyword in the first 100 words",
        "Use subheadings to break up content and improve readability",
        "Add internal and external links to support your content",
        "Include meta description with primary keyword"
      ]
    };

    return Response.json({ success: true, data: fallbackResponse });
  }
}