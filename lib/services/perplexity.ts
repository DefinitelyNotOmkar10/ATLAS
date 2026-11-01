const PERPLEXITY_API_BASE = 'https://api.perplexity.ai';

function getApiKey(): string {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY is not configured. Please add it to your .env.local file.');
  }
  return apiKey;
}

export async function searchPerplexity(query: string) {
  const apiKey = getApiKey();
  const response = await fetch(`${PERPLEXITY_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar', // Use Perplexity's online search model
      messages: [
        { role: 'user', content: query }
      ],
      temperature: 0.2,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity Search API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  return {
    answer: data.choices[0]?.message?.content || '',
    citations: data.citations || []
  };
}

export async function generateWithPerplexity(
  prompt: string,
  systemPrompt: string
) {
  const apiKey = getApiKey();
  const response = await fetch(`${PERPLEXITY_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro', // Use Perplexity's professional model for better quality
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      stream: false, // Disable streaming for reliable JSON parsing
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity LLM API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}


