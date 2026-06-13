import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY ?? '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateThankYou(
  creatorName: string,
  amount: number,
  token: string,
  personality: string
): Promise<string> {
  if (!apiKey) return `Thank you so much for the ${amount} ${token} tip, ${creatorName} really appreciates it! 🙏`;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const styleMap: Record<string, string> = {
      grateful: 'warm, heartfelt, deeply appreciative',
      hype: 'high-energy, excited, uses emojis and exclamation marks',
      professional: 'clean, concise, polished and professional',
      creative: 'poetic, imaginative, metaphorical',
    };
    const style = styleMap[personality] ?? styleMap.grateful;
    const prompt = `You are ${creatorName}, a content creator. Someone just sent you a ${amount} ${token} tip on Solana. Write a 2-sentence thank-you message in a ${style} style. Keep it under 160 characters total. Be specific about the amount. Do not use quotes.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return `Thank you so much for the ${amount} ${token}! Your support means everything to ${creatorName} 🙏`;
  }
}

export async function generateEnhancedBio(
  name: string,
  bio: string
): Promise<string> {
  if (!apiKey) return bio;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Rewrite this creator bio for ${name} to be compelling, punchy and under 160 characters. Make it sound exciting and professional for a Web3 tipping platform. Original bio: "${bio}". Return only the rewritten bio, no quotes.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim().slice(0, 160);
  } catch {
    return bio;
  }
}
