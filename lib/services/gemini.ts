import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-3.1-flash-lite';

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env.local file.');
  }
  return apiKey;
}

/**
 * Performs a knowledge-grounded query using Gemini.
 * Replaces the previous Perplexity `searchPerplexity` function.
 * Returns { answer: string, citations: [] } to keep the same shape as before.
 */
export async function searchGemini(query: string) {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const result = await model.generateContent(query);
  const answer = result.response.text();

  return {
    answer,
    citations: [] as string[], // Gemini flash doesn't return citations; kept for interface parity
  };
}

/**
 * Generates structured text using Gemini with a system + user prompt.
 * Replaces the previous Perplexity `generateWithPerplexity` function.
 * Returns the raw model text string — identical contract as before.
 */
export async function generateWithGemini(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(getApiKey());

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json', // Forces clean JSON output — no markdown fences
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
