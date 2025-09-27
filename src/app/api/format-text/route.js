import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEWAZ_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.NEWAZ_GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
Please clean and format the following text extracted from a PDF. Remove any unwanted characters, fix formatting issues, and make it readable while preserving the original meaning and structure.

Text to format:
${text}

Please return only the cleaned and formatted text without any additional commentary or explanations.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const formattedText = response.text();

    return new Response(JSON.stringify({ formattedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error formatting text with Gemini:', error);
    return new Response(JSON.stringify({ error: 'Failed to format text: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}