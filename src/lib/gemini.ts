// Uses Gemini REST API directly — no @google/generative-ai SDK needed
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function generateThankYou(
  creatorName: string,
  amount: number,
  token: string,
  personality: string
): Promise<string> {
  const styleMap: Record<string, string> = {
    grateful: 'warm, heartfelt, deeply appreciative',
    hype: 'high-energy, excited, uses emojis and exclamation marks',
    professional: 'clean, concise, polished and professional',
    creative: 'poetic, imaginative, metaphorical',
  };
  const style = styleMap[personality] ?? styleMap.grateful;
  const prompt = `You are ${creatorName}, a content creator. Someone just sent you a ${amount} ${token} tip on Solana. Write a 2-sentence thank-you message in a ${style} style. Keep it under 160 characters total. Be specific about the amount. Do not use quotes.`;
  const result = await callGemini(prompt);
  return result ?? `Thank you so much for the ${amount} ${token} tip! Your support means everything to ${creatorName} 🙏`;
}

export async function generateEnhancedBio(
  name: string,
  bio: string
): Promise<string> {
  const prompt = `Rewrite this creator bio for ${name} to be compelling, punchy and under 160 characters. Make it sound exciting and professional for a Web3 tipping platform. Original bio: "${bio}". Return only the rewritten bio, no quotes.`;
  const result = await callGemini(prompt);
  return result ? result.slice(0, 160) : bio;
}
