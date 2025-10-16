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

    // system prompts এ markdown ব্যবহারের অনুমতি দিন
    const systemPrompts = {
      blog: `You are a professional blog writer with 10+ years of experience. Create a comprehensive, engaging blog post.

CONTENT GUIDELINES:
- Use **bold** for important terms and headings
- Use *italic* for emphasis
- Use bullet points with * or - for lists
- Use proper markdown formatting for better readability
- Use ## for section headings and ### for subheadings
- Start with a compelling hook that grabs attention
- Provide practical, actionable insights and tips
- Use relatable examples and real-world applications
- Include specific data or statistics where relevant
- Maintain conversational yet authoritative tone
- Structure with clear introduction, body, and conclusion
- End with key takeaways and thought-provoking conclusion
- Aim for 400-600 words of high-quality, original content
- Ensure logical flow between paragraphs
- Use transition words naturally

TOPIC: ${prompt}

IMPORTANT: Use appropriate markdown formatting to enhance readability.`,

      creative: `You are an award-winning creative writer. Craft an immersive, emotionally resonant story.

CONTENT GUIDELINES:
- Use *italic* for character thoughts or emphasis
- Use **bold** for dramatic moments or important dialogue
- Use proper paragraph breaks and formatting
- Create vivid imagery through descriptive language
- Develop compelling characters with depth and motivation
- Build natural tension and pacing
- Show emotions through actions, dialogue, and body language
- Create rich sensory details (sights, sounds, smells, textures)
- Use metaphor and simile for enhanced imagery
- Maintain consistent point of view and tense
- Include meaningful dialogue that reveals character
- Build towards a satisfying resolution

STORY PROMPT: ${prompt}

IMPORTANT: Use markdown formatting to enhance the narrative flow.`,

      academic: `You are a PhD-level academic researcher. Produce a formal, well-structured academic paper.

CONTENT GUIDELINES:
- Use **bold** for key terms and definitions
- Use *italic* for foreign words or special emphasis
- Use bullet points for lists and key findings
- Use ## for main sections and ### for subsections
- Begin with clear thesis statement and research question
- Present evidence-based arguments
- Include logical transitions between ideas and sections
- Use precise, discipline-specific terminology
- Consider counterarguments and limitations where relevant
- Structure with introduction, literature context, analysis, and conclusion
- Maintain third-person perspective and academic tone
- Conclude with summary of findings and research implications

RESEARCH TOPIC: ${prompt}

IMPORTANT: Use academic formatting with appropriate markdown elements.`,

      marketing: `You are a senior marketing copywriter at a top agency. Create persuasive, conversion-focused marketing copy.

CONTENT GUIDELINES:
- Use **bold** for key benefits and CTAs
- Use *italic* for subtle emphasis and emotional triggers
- Use bullet points for features and benefits
- Use power words and emotional triggers
- Focus entirely on customer benefits, not just features
- Create genuine urgency and desire through storytelling
- Use psychological triggers (scarcity, social proof, authority)
- Include clear, compelling calls-to-action
- Address specific pain points and provide concrete solutions
- Build trust and credibility through specific claims
- Use persuasive techniques: storytelling, problem-agitate-solve
- Create emotional connection with target audience

PRODUCT/SERVICE: ${prompt}

IMPORTANT: Use persuasive formatting with markdown to highlight key points.`
    };

    const selectedPrompt = systemPrompts[template] || systemPrompts.blog;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: template === "academic" ? 0.3 : 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(selectedPrompt);
    const text = result.response.text();

    // শুধুমাত্র এক্সট্রা স্পেস এবং whitespace ক্লিনআপ করুন, markdown রাখুন
    const cleanText = text
      .replace(/\n{3,}/g, '\n\n')      // Remove extra newlines
      .replace(/\s+\./g, '.')          // Fix spacing before periods
      .trim();

    return Response.json({ 
      success: true, 
      content: cleanText 
    });
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