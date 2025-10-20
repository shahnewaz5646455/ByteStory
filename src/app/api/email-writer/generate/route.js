// app/api/email-writer/generate/route.js

import { connectDB } from "@/lib/database.Connection";
import EmailTemplateModel from "@/app/models/EmailTemplate.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * --- Configuration and Helper Functions ---
 */

// Define the models to try for generation
const GENERATION_MODELS = [
  "gemini-2.5-flash", // Recommended for fast and high-quality generation
  "gemini-1.0-pro",
];

// Fallback templates (same as your original, but moved slightly for clarity)
const getProfessionalFallbackEmail = (
  purpose,
  keyPoints,
  tone,
  recipientType
) => {
  const baseTemplates = {
    // ... (Your existing professional fallback templates go here) ...
    business: {
      professional: {
        subject: `Business Proposal: ${
          keyPoints[0] || "Strategic Collaboration"
        }`,
        body: `Dear ${recipientType || "Colleague"},

I hope this message finds you well.

I am reaching out to discuss ${keyPoints.join(
          ", "
        )} and explore potential synergies between our organizations. After reviewing your recent initiatives, I believe there is a compelling opportunity for mutual growth and value creation.

Key aspects I'd like to highlight:
${keyPoints.map((point, index) => `• ${point}`).join("\n")}

I am available for a preliminary discussion next week to explore this further. Would Tuesday at 2:00 PM work for your schedule?

Thank you for your consideration.`,
        closing: "Best regards,\n[Your Name]\n[Your Position]\n[Your Company]",
      },
      friendly: {
        subject: `Quick connect: ${keyPoints[0] || "Working together"}`,
        body: `Hi ${recipientType || "there"},

Hope you're having a productive week!

I wanted to reach out about ${keyPoints.join(
          ", "
        )} - thought there might be some great opportunities for us to collaborate.

A few things that caught my attention:
${keyPoints.map((point, index) => `• ${point}`).join("\n")}

Would you be open to a quick chat sometime next week? Let me know what works for you!

Looking forward to connecting.`,
        closing: "Best,\n[Your Name]",
      },
    },
    sales: {
      professional: {
        subject: `Partnership Opportunity: Enhancing ${
          keyPoints[0] || "Your Operations"
        }`,
        body: `Dear ${recipientType || "Decision Maker"},

I'm writing from [Your Company] regarding how our ${keyPoints.join(
          ", "
        )} solutions can address your current challenges and drive measurable results.

Based on our analysis, we can help you achieve:
${keyPoints.map((point, index) => `• ${point}`).join("\n")}

Many organizations in your sector have seen [specific benefit] within [timeframe] of implementation.

Would you be available for a 20-minute discovery call next week to discuss your specific needs?`,
        closing:
          "Sincerely,\n[Your Name]\n[Your Position]\n[Your Company]\n[Phone Number]",
      },
      persuasive: {
        subject: `Transform Your ${
          keyPoints[0] || "Business Outcomes"
        } - Exclusive Opportunity`,
        body: `Dear ${recipientType || "Team"},

I'm excited to share how our ${keyPoints.join(
          ", "
        )} can revolutionize your approach and deliver exceptional ROI.

Imagine achieving:
${keyPoints.map((point, index) => `• ${point}`).join("\n")}

Our clients typically see [quantifiable results] within weeks of implementation.

This is a limited-time opportunity to [specific offer]. I'd love to schedule a brief demo to show you exactly how we can help.

Are you available for a quick 15-minute call this week?`,
        closing: "Warm regards,\n[Your Name]\n[Your Position]",
      },
    },
    "customer-service": {
      professional: {
        subject: `Update Regarding Your ${
          keyPoints[0] || "Recent Inquiry"
        } [Ticket #${Math.random().toString().substr(2, 6)}]`,
        body: `Dear ${recipientType || "Valued Customer"},

Thank you for bringing ${keyPoints.join(", ")} to our attention.

I want to assure you that we are actively addressing this matter. Our team has identified the issue and is implementing a solution.

Next Steps:
• [Action item with timeline]
• [Expected resolution date]
• [Any temporary workarounds]

We truly value your business and appreciate your patience as we work to resolve this completely.

Please don't hesitate to reach out if you have any further questions.`,
        closing:
          "Sincerely,\n[Your Name]\nCustomer Success Manager\n[Your Company]",
      },
      friendly: {
        subject: `Following up on your ${keyPoints[0] || "recent message"}`,
        body: `Hi ${recipientType || "there"},

Thanks so much for reaching out about ${keyPoints.join(", ")}!

I wanted to let you know that we're on it and making good progress. Here's what's happening:
${keyPoints.map((point, index) => `• ${point}`).join("\n")}

We're aiming to have this fully resolved by [date]. In the meantime, [suggestion if applicable].

Really appreciate your patience - we're committed to making this right for you!`,
        closing: "Best regards,\n[Your Name]\nSupport Team",
      },
    },
    "job-application": {
      formal: {
        subject: `Application for ${keyPoints[0] || "Position"} - [Your Name]`,
        body: `Dear ${recipientType || "Hiring Manager"},

I am writing to express my enthusiastic interest in the ${
          keyPoints[0] || "position"
        } at [Company Name], as advertised on [Platform]. With my extensive experience in ${keyPoints
          .slice(1)
          .join(
            ", "
          )}, I am confident in my ability to contribute significantly to your team.

My qualifications include:
${keyPoints
  .slice(1)
  .map((point, index) => `• ${point}`)
  .join("\n")}

I am particularly drawn to [Company Name] because of [specific reason related to company values/mission].

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and experience align with your needs.`,
        closing:
          "Sincerely,\n[Your Name]\n[Phone Number]\n[Email Address]\n[LinkedIn Profile URL]",
      },
    },
  };

  // Get the appropriate template
  const purposeTemplates = baseTemplates[purpose] || baseTemplates.business;
  const toneTemplate =
    purposeTemplates[tone] ||
    purposeTemplates.professional ||
    purposeTemplates.formal ||
    Object.values(purposeTemplates)[0];

  return toneTemplate;
};

/**
 * Generates the AI prompt for Gemini.
 * @param {object} params - Generation parameters.
 * @returns {string} The full prompt string.
 */
const createEmailPrompt = ({
  purpose,
  tone,
  keyPoints,
  recipientType,
  customInstructions,
}) => {
  const instructionsBlock = customInstructions
    ? `- SPECIAL INSTRUCTIONS: ${customInstructions}`
    : "";

  return `
    You are a world-class business communication expert. Generate a highly professional, realistic, and actionable email.
    
    You MUST adhere to all constraints and requirements below.

    CONTEXT:
    - PURPOSE: ${purpose}
    - TONE: ${tone}
    - RECIPIENT: ${recipientType || "professional contact"}
    - KEY POINTS: ${keyPoints.join(" | ")}
    ${instructionsBlock}

    REQUIREMENTS:
    1. Focus on being concise, clear, and action-oriented.
    2. Incorporate a **strong call-to-action (CTA)**, such as a suggested meeting time or a next step.
    3. Use professional business language appropriate for the specified tone.
    4. Structure the email with a clear opening, body paragraphs, and a closing.
    5. Use **[Placeholders]** for all necessary personalization (e.g., [Recipient Name], [Your Name], [Company Name]).
    6. Ensure the email's content directly addresses the KEY POINTS provided.

    FORMAT REQUIREMENTS:
    Return ONLY valid JSON in this exact structure. Do not include any text, explanations, or code block delimiters (\`\`\`).
    
    {
      "subject": "A concise and specific email subject line reflecting the key points",
      "body": "The well-structured and action-oriented email body, including placeholders",
      "closing": "A professional closing, e.g., 'Sincerely,\\n[Your Name]'"
    }
  `;
};

/**
 * --- Main API Route Handler ---
 */

export async function POST(request) {
  try {
    await connectDB();

    const {
      purpose,
      tone,
      keyPoints,
      recipientType,
      customInstructions,
      userId,
    } = await request.json();

    // 1. Validation
    if (!purpose || !userId) {
      return new Response(
        JSON.stringify({
          error: "Purpose and user ID are required",
        }),
        { status: 400 }
      );
    }

    const validKeyPoints = Array.isArray(keyPoints)
      ? keyPoints.filter((point) => point && point.trim() !== "")
      : [];

    if (validKeyPoints.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Please provide at least one valid key point for content generation.",
        }),
        { status: 400 }
      );
    }

    console.log("📧 Starting email generation:", {
      purpose,
      tone,
      validKeyPoints,
    });

    const API_KEY = process.env.GEMINI_API_KEY;
    let generatedEmail = null;
    let source = "Professional Template";

    // 2. AI Generation Attempt
    if (API_KEY) {
      const enhancedPrompt = createEmailPrompt({
        purpose,
        tone,
        keyPoints: validKeyPoints,
        recipientType,
        customInstructions,
      });

      try {
        const genAI = new GoogleGenerativeAI(API_KEY);

        for (const modelName of GENERATION_MODELS) {
          try {
            console.log(`🔄 Trying AI generation with: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Use responseSchema for stricter JSON output (if your model version supports it)
            // For general usage, the text-based prompt is often sufficient with Gemini Pro/Flash
            const result = await model.generateContent(enhancedPrompt);
            const rawContent = result.text.trim();

            // Attempt to clean and parse the JSON response
            const cleanContent = rawContent
              .replace(/```json\s*|\s*```/g, "")
              .trim();
            const parsedEmail = JSON.parse(cleanContent);

            if (!parsedEmail.subject || !parsedEmail.body) {
              throw new Error(
                "AI response structure is invalid after parsing."
              );
            }

            generatedEmail = parsedEmail;
            source = "AI Generated";
            console.log(`✅ AI generation successful with ${modelName}`);
            break; // Exit the loop on success
          } catch (modelError) {
            console.log(
              `❌ ${modelName} failed or produced bad JSON:`,
              modelError.message
            );
          }
        }
      } catch (aiGlobalError) {
        console.error(
          "❌ Overall AI generation failed:",
          aiGlobalError.message
        );
      }
    }

    // 3. Fallback to Professional Template
    if (!generatedEmail) {
      console.log("🔄 Falling back to professional template.");
      generatedEmail = getProfessionalFallbackEmail(
        purpose,
        validKeyPoints,
        tone,
        recipientType
      );
    }

    // 4. Save and Respond
    const emailTemplate = new EmailTemplateModel({
      userId,
      title: `${source} ${purpose} Email - ${new Date().toLocaleDateString()}`,
      purpose,
      tone,
      keyPoints: validKeyPoints,
      generatedEmail,
      wordCount: generatedEmail.body.split(/\s+/).length,
    });

    await emailTemplate.save();

    return new Response(
      JSON.stringify({
        success: true,
        email: generatedEmail,
        templateId: emailTemplate._id,
        source: source,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Critical error in email generation endpoint:", error);

    // Provide a more informative 500 response
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error.message
        : "An internal server error occurred. Please check the logs.";

    return new Response(
      JSON.stringify({
        error: "Unable to generate email.",
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}
