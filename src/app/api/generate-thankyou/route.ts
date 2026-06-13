import { NextRequest, NextResponse } from 'next/server';

const fallbacks: Record<string, string> = {
  grateful: 'Thank you SO much for the tip! 🙏',
  hype: 'LFG!! That tip just MADE MY DAY!! 🔥🚀',
  professional: 'Thank you for your generous contribution.',
  creative: 'Your tip is like sunlight — it bends into color. ✨',
};

const tones: Record<string, string> = {
  grateful: 'Warm, heartfelt, personal, genuinely moved. Use first person.',
  hype: 'HIGH ENERGY, excited, use caps and emojis, LETS GOOOO energy. Go wild.',
  professional: 'Clean, polished, formal but warm. No slang. Elegant.',
  creative: 'Poetic, metaphorical, imaginative, artistic. Paint a picture.',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      creatorName: string;
      personality: string;
      amount: number;
      token: string;
      tipperWallet: string;
      supporterCount: number;
    };
    const { creatorName, personality, amount, token, tipperWallet, supporterCount } = body;
    const apiKey = process.env.GEMINI_API_KEY;
    const p = personality || 'grateful';

    if (!apiKey)
      return NextResponse.json({ thankYouMessage: fallbacks[p] ?? fallbacks.grateful });

    const prompt = `You are ${creatorName}, a creator on Solana. Write a thank-you message for a tip.
Tone: ${tones[p] ?? tones.grateful}
Tip: ${amount} ${token} from wallet ${String(tipperWallet).slice(0, 8)}...
You now have ${supporterCount} supporters.
Keep it under 120 characters. Return ONLY the message, no quotes.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!res.ok)
      return NextResponse.json({ thankYouMessage: fallbacks[p] });

    const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const msg = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? fallbacks[p];
    return NextResponse.json({ thankYouMessage: msg.slice(0, 120) });
  } catch (err) {
    console.error('[POST /api/generate-thankyou]', err);
    return NextResponse.json({ thankYouMessage: 'Thank you for the tip! 🙏' }, { status: 500 });
  }
}
